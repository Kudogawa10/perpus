<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Peminjaman;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Notifications\PengembalianDikonfirmasi;

class PeminjamanController extends Controller
{
    public function index(Request $request)
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $query = Peminjaman::with(['user', 'buku', 'petugas']);

        if ($s = $request->get('search')) {
            $query->where(fn ($q) => $q
                ->whereHas('user', fn ($u) => $u->where('name', 'like', "%$s%")->orWhere('no_anggota', 'like', "%$s%"))
                ->orWhereHas('buku', fn ($b) => $b->where('judul', 'like', "%$s%"))
                ->orWhere('kode_peminjaman', 'like', "%$s%"));
        }

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($dari = $request->get('dari')) {
            $query->whereDate('tanggal_pinjam', '>=', $dari);
        }

        if ($sampai = $request->get('sampai')) {
            $query->whereDate('tanggal_pinjam', '<=', $sampai);
        }

        $peminjaman = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Peminjaman', [
            'peminjaman' => $peminjaman,
            'filters' => $request->only('search', 'status', 'dari', 'sampai'),
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

        $peminjaman->update(['status' => 'disetujui', 'petugas_id' => auth()->id()]);

        return back()->with('success', 'Peminjaman disetujui.');
    }

    public function kembalikan(Request $request, Peminjaman $peminjaman)
    {
        abort_unless(in_array($peminjaman->status, ['dipinjam', 'terlambat', Peminjaman::STATUS_PENGAJUAN_KEMBALI]), 422, 'Status tidak valid untuk dikembalikan.');
        $request->validate([
            'denda' => 'nullable|integer|min:0',
        ]);

        $peminjaman->update([
            'status' => 'dikembalikan',
            'tanggal_kembali_aktual' => today(),
            'petugas_id' => auth()->id(),
            'denda' => max(0, (int) $request->input('denda', $peminjaman->hitungDenda())),
        ]);
        if ($peminjaman->buku) {
            $peminjaman->buku->tambahStok();
        }

        // Notify the user that the return was processed
        try {
            $peminjaman->user->notify(new PengembalianDikonfirmasi($peminjaman));
        } catch (\Throwable $e) {
            // ignore notification errors
        }

        return back()->with('success', 'Peminjaman ditandai dikembalikan.');
    }

    public function destroy(Peminjaman $peminjaman)
    {
        if (in_array($peminjaman->status, ['dipinjam', 'terlambat'])) {
            return back()->withErrors(['peminjaman' => 'Tidak bisa menghapus peminjaman aktif.']);
        }

        $peminjaman->delete();

        return back()->with('success', 'Data peminjaman dihapus.');
    }
}
