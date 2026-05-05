<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Kategori;
use App\Models\Peminjaman;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatistikController extends Controller
{
    public function index(Request $request)
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $tahun = $request->get('tahun', now()->year);
        $bulan = $request->get('bulan', now()->month);

        $perBulan = collect(range(1, 12))->map(fn ($b) => [
            'bulan' => Carbon::createFromDate($tahun, $b, 1)->locale('id')->isoFormat('MMM'),
            'total' => Peminjaman::whereYear('tanggal_pinjam', $tahun)->whereMonth('tanggal_pinjam', $b)->count(),
            'kembali' => Peminjaman::whereYear('tanggal_kembali_aktual', $tahun)->whereMonth('tanggal_kembali_aktual', $b)->where('status', 'dikembalikan')->count(),
        ]);

        $summary = [
            'total_peminjaman_tahun' => Peminjaman::whereYear('tanggal_pinjam', $tahun)->count(),
            'total_anggota_baru_tahun' => User::role('pengguna')->whereYear('created_at', $tahun)->count(),
            'total_buku_baru_tahun' => Buku::whereYear('created_at', $tahun)->count(),
            'total_denda_tahun' => Peminjaman::whereYear('tanggal_pinjam', $tahun)->get()->sum(fn ($p) => $p->hitungDenda()),
            'buku_tersedia' => Buku::where('stok_tersedia', '>', 0)->count(),
            'buku_habis' => Buku::where('stok_tersedia', 0)->count(),
        ];

        $topBuku = Buku::withCount('peminjaman')
            ->whereYear('created_at', '<=', $tahun)
            ->orderByDesc('peminjaman_count')
            ->limit(10)
            ->get();

        $topKategori = Kategori::withCount('buku')
            ->orderByDesc('buku_count')
            ->get();

        return Inertia::render('Admin/Statistik', [
            'per_bulan' => $perBulan,
            'summary' => $summary,
            'top_buku' => $topBuku,
            'top_kategori' => $topKategori,
            'tahun' => $tahun,
            'bulan' => $bulan,
        ]);
    }

    public function export(Request $request)
    {
        $tahun = $request->get('tahun', now()->year);

        $peminjaman = Peminjaman::with(['user', 'buku', 'petugas'])
            ->whereYear('tanggal_pinjam', $tahun)
            ->orderBy('tanggal_pinjam')
            ->get();

        $pdf = Pdf::loadView('laporan.peminjaman', [
            'peminjaman' => $peminjaman,
            'tahun' => $tahun,
        ])->setPaper('a4', 'landscape');

        return $pdf->download("laporan-peminjaman-{$tahun}.pdf");
    }

    public function exportUsers(Request $request)
    {
        $users = \App\Models\User::role('pengguna')->orderBy('name')->get();

        $pdf = Pdf::loadView('laporan.users', [
            'users' => $users,
        ])->setPaper('a4', 'portrait');

        return $pdf->download('daftar-anggota.pdf');
    }

    public function exportBuku(Request $request)
    {
        $buku = \App\Models\Buku::with('kategori')->orderBy('judul')->get();

        $pdf = Pdf::loadView('laporan.buku', [
            'buku' => $buku,
        ])->setPaper('a4', 'portrait');

        return $pdf->download('laporan-buku.pdf');
    }
}
