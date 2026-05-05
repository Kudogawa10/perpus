<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\{Buku, LaporanBuku, Peminjaman, User};
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'menunggu'             => Peminjaman::where('status', 'menunggu')->count(),
            'dipinjam'             => Peminjaman::whereIn('status', ['dipinjam', 'terlambat'])->count(),
            'terlambat'            => Peminjaman::where('status', 'terlambat')->count(),
            'dikembalikan_hari_ini'=> Peminjaman::where('status', 'dikembalikan')
                ->whereDate('tanggal_kembali_aktual', today())->count(),
            'total_buku'           => Buku::count(),
            'total_anggota'        => User::role('pengguna')->count(),
        ];

        // Peminjaman perlu tindakan
        $butuhPerhatian = Peminjaman::with(['user', 'buku'])
            ->whereIn('status', ['menunggu', 'terlambat'])
            ->latest()
            ->limit(10)
            ->get();

        // Chart: peminjaman 7 hari
        $chartData = collect(range(6, 0))->map(function ($daysAgo) {
            $date = Carbon::today()->subDays($daysAgo);
            return [
                'label' => $date->locale('id')->isoFormat('ddd D/M'),
                'total' => Peminjaman::whereDate('tanggal_pinjam', $date)->count(),
            ];
        });

        return Inertia::render('Petugas/Dashboard', [
            'stats'          => $stats,
            'butuh_perhatian'=> $butuhPerhatian,
            'chart_data'     => $chartData,
        ]);
    }

    public function laporan()
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $bulan = request('bulan', now()->format('Y-m'));
        $petugasId = auth()->id();

        [$tahun, $bln] = explode('-', $bulan);

        $laporanBuku = Buku::with('kategoriRelasi')
            ->orderBy('judul')
            ->get()
            ->map(function ($buku) {
                return [
                    'id' => $buku->id,
                    'judul' => $buku->judul,
                    'penulis' => $buku->penulis,
                    'kategori' => $buku->kategori,
                    'stok_total' => (int) $buku->stok_total,
                    'stok_tersedia' => (int) $buku->stok_tersedia,
                    'stok_dipinjam' => max(0, (int) $buku->stok_total - (int) $buku->stok_tersedia),
                ];
            });

        $penyerahanTerbaru = Peminjaman::with(['buku', 'user', 'petugas'])
            ->whereNotNull('kondisi_buku_saat_serah')
            ->latest()
            ->limit(20)
            ->get();

        $laporanTerkirim = LaporanBuku::with(['buku', 'peminjaman', 'petugas'])
            ->where('petugas_id', $petugasId)
            ->latest()
            ->limit(30)
            ->get();

        $data = [
            'total_peminjaman'  => Peminjaman::whereYear('tanggal_pinjam', $tahun)->whereMonth('tanggal_pinjam', $bln)->count(),
            'total_dikembalikan'=> Peminjaman::whereYear('tanggal_kembali_aktual', $tahun)->whereMonth('tanggal_kembali_aktual', $bln)->where('status', 'dikembalikan')->count(),
            'total_terlambat'   => Peminjaman::whereYear('tanggal_pinjam', $tahun)->whereMonth('tanggal_pinjam', $bln)->where('status', 'terlambat')->count(),
            'total_denda'       => Peminjaman::whereYear('tanggal_pinjam', $tahun)->whereMonth('tanggal_pinjam', $bln)->get()->sum(fn ($p) => $p->hitungDenda()),
            'per_hari'          => Peminjaman::selectRaw('DAY(tanggal_pinjam) as hari, COUNT(*) as total')
                ->whereYear('tanggal_pinjam', $tahun)->whereMonth('tanggal_pinjam', $bln)
                ->groupBy('hari')->orderBy('hari')->get(),
            'laporan_buku'      => $laporanBuku,
            'penyerahan_terbaru'=> $penyerahanTerbaru,
            'laporan_terkirim'  => $laporanTerkirim,
        ];

        return Inertia::render('Petugas/Laporan', [
            'data'  => $data,
            'bulan' => $bulan,
        ]);
    }

    public function kirimLaporan(Request $request)
    {
        $validated = $request->validate([
            'buku_id' => 'required|exists:buku,id',
            'stok_total' => 'required|integer|min:0',
            'stok_tersedia' => 'required|integer|min:0|lte:stok_total',
            'kondisi_buku' => 'required|string|min:5',
            'catatan' => 'nullable|string|max:1000',
            'bukti_gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
            'peminjaman_id' => 'nullable|exists:peminjaman,id',
        ]);

        $buktiPath = $request->hasFile('bukti_gambar')
            ? $request->file('bukti_gambar')->store('laporan-buku', 'public')
            : null;

        LaporanBuku::create([
            'petugas_id' => auth()->id(),
            'buku_id' => $validated['buku_id'],
            'peminjaman_id' => $validated['peminjaman_id'] ?? null,
            'stok_total' => (int) $validated['stok_total'],
            'stok_tersedia' => (int) $validated['stok_tersedia'],
            'kondisi_buku' => $validated['kondisi_buku'],
            'catatan' => $validated['catatan'] ?? null,
            'bukti_gambar' => $buktiPath,
            'status' => 'dikirim',
        ]);

        return back()->with('success', 'Laporan buku berhasil dikirim ke Admin.');
    }
}
