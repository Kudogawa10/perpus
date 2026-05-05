<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\LaporanBuku;
use App\Models\Peminjaman;
use App\Notifications\PengembalianDikonfirmasi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Storage;

class PeminjamanController extends Controller
{
    public function index(Request $request)
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $query = Peminjaman::with(['user', 'buku', 'petugas']);

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', fn($u) => $u->where('name', 'like', "%$search%")->orWhere('no_anggota', 'like', "%$search%"))
                  ->orWhereHas('buku', fn($b) => $b->where('judul', 'like', "%$search%"))
                  ->orWhere('kode_peminjaman', 'like', "%$search%");
            });
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $peminjaman = $query->latest()->paginate(15)->withQueryString();

        $stats = [
            'menunggu'             => Peminjaman::where('status', 'menunggu')->count(),
            'dipinjam'             => Peminjaman::whereIn('status', ['dipinjam'])->count(),
            'terlambat'            => Peminjaman::where('status', 'terlambat')->count(),
            'pengajuan_kembali'    => Peminjaman::where('status', Peminjaman::STATUS_PENGAJUAN_KEMBALI)->count(),
            'dikembalikan_hari_ini'=> Peminjaman::where('status', 'dikembalikan')
                ->whereDate('tanggal_kembali_aktual', today())->count(),
        ];

        return Inertia::render('Petugas/Peminjaman', [
            'peminjaman' => $peminjaman,
            'stats'      => $stats,
            'filters'    => $request->only('search', 'status'),
        ]);
    }

    public function show(Peminjaman $peminjaman)
    {
        $peminjaman->load(['buku', 'user', 'petugas']);

        return Inertia::render('Pengguna/DetailPeminjaman', [
            'peminjaman' => $peminjaman,
        ]);
    }

    public function setujui(Request $request, Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->status === 'menunggu', 422, 'Hanya peminjaman menunggu yang bisa disetujui.');

        $peminjaman->update([
            'status'     => 'disetujui',
            'petugas_id' => auth()->id(),
            'catatan'    => $request->catatan,
        ]);

        return back()->with('success', 'Peminjaman berhasil disetujui.');
    }

    public function tolak(Request $request, Peminjaman $peminjaman)
    {
        $request->validate(['catatan' => 'required|string|min:5']);

        abort_unless(in_array($peminjaman->status, ['menunggu', 'disetujui']), 422, 'Status tidak valid untuk ditolak.');

        $peminjaman->update([
            'status'     => 'ditolak',
            'petugas_id' => auth()->id(),
            'catatan'    => $request->catatan,
        ]);

        return back()->with('success', 'Peminjaman berhasil ditolak.');
    }

    public function serahkan(Request $request, Peminjaman $peminjaman)
    {
        abort_unless($peminjaman->status === 'disetujui', 422, 'Hanya peminjaman disetujui yang bisa diserahkan.');

        $validated = $request->validate([
            'catatan' => 'nullable|string|max:1000',
            'kondisi_buku_saat_serah' => 'required|string|min:3|max:1000',
            'bukti_penyerahan' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        // Kurangi stok buku
        if (! $peminjaman->buku) {
            return back()->withErrors(['buku' => 'Buku terkait tidak ditemukan.']);
        }

        if (! $peminjaman->buku->kurangiStok()) {
            return back()->withErrors(['stok' => 'Stok buku tidak tersedia.']);
        }

        $payload = [
            'status'     => 'dipinjam',
            'petugas_id' => auth()->id(),
            'catatan'    => $validated['catatan'] ?? null,
            'kondisi_buku_saat_serah' => $validated['kondisi_buku_saat_serah'],
        ];

        if ($request->hasFile('bukti_penyerahan')) {
            if ($peminjaman->bukti_penyerahan) {
                Storage::disk('public')->delete($peminjaman->bukti_penyerahan);
            }
            $payload['bukti_penyerahan'] = $request->file('bukti_penyerahan')->store('peminjaman/bukti-penyerahan', 'public');
        }

        $peminjaman->update($payload);

        LaporanBuku::create([
            'petugas_id' => auth()->id(),
            'buku_id' => $peminjaman->buku_id,
            'peminjaman_id' => $peminjaman->id,
            'stok_total' => (int) $peminjaman->buku->stok_total,
            'stok_tersedia' => (int) $peminjaman->buku->stok_tersedia,
            'kondisi_buku' => $validated['kondisi_buku_saat_serah'],
            'catatan' => $validated['catatan'] ?? null,
            'bukti_gambar' => $payload['bukti_penyerahan'] ?? null,
            'status' => 'dikirim',
        ]);

        return back()->with('success', 'Buku berhasil diserahkan kepada anggota.');
    }

    public function kembalikan(Request $request, Peminjaman $peminjaman)
    {
        abort_unless(in_array($peminjaman->status, ['dipinjam', 'terlambat', Peminjaman::STATUS_PENGAJUAN_KEMBALI]), 422, 'Status tidak valid untuk dikembalikan.');
        $request->validate([
            'denda' => 'nullable|integer|min:0',
            'catatan' => 'nullable|string|max:1000',
        ]);

        $tglKembali = Carbon::today();
        $denda = max(0, (int) $request->input('denda', $peminjaman->hitungDenda()));

        $peminjaman->update([
            'status'                  => 'dikembalikan',
            'tanggal_kembali_aktual'  => $tglKembali,
            'petugas_id'              => auth()->id(),
            'catatan'                 => $request->catatan,
            'denda'                   => $denda,
        ]);

        // Kembalikan stok buku jika masih ada relasi buku
        if ($peminjaman->buku) {
            $peminjaman->buku->tambahStok();
        }

        // Notify the user that the return has been confirmed
        try {
            $peminjaman->user->notify(new PengembalianDikonfirmasi($peminjaman));
        } catch (\Throwable $e) {
            // ignore notification failures
        }

        return back()->with('success', 'Buku berhasil dikembalikan.' . ($denda > 0 ? " Denda: Rp " . number_format($denda, 0, ',', '.') : ''));
    }
}
