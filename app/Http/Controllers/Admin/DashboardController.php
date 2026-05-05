<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Peminjaman, User, Kategori};
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        Peminjaman::sinkronkanStatusDanDenda();

        // ---- Core Stats ----
        $statistik = [
            'total_buku'               => Buku::count(),
            'total_anggota'            => User::role('pengguna')->count(),
            'total_peminjaman_aktif'   => Peminjaman::whereIn('status', ['dipinjam', 'terlambat', 'disetujui'])->count(),
            'total_peminjaman_hari_ini'=> Peminjaman::whereDate('tanggal_pinjam', today())->count(),
            'buku_terlambat'           => Peminjaman::where('status', 'terlambat')->count(),
            'denda_total'              => Peminjaman::where('status', 'terlambat')->get()->sum(fn ($p) => $p->hitungDenda()),

            // Chart: peminjaman 7 hari terakhir
            'peminjaman_minggu' => collect(range(6, 0))->map(function ($d) {
                $date = Carbon::today()->subDays($d);
                return [
                    'label' => $date->locale('id')->isoFormat('ddd D/M'),
                    'total' => Peminjaman::whereDate('tanggal_pinjam', $date)->count(),
                ];
            })->values(),

            // Buku paling populer
            'buku_populer' => Buku::withCount('peminjaman')
                ->orderByDesc('peminjaman_count')
                ->limit(5)
                ->get()
                ->map(fn($b) => ['buku' => $b, 'total' => $b->peminjaman_count]),

            // Kategori populer
            'kategori_populer' => Kategori::withCount('buku')
                ->orderByDesc('buku_count')
                ->limit(5)
                ->get()
                ->map(fn($k) => ['kategori' => $k->nama, 'total' => $k->buku_count]),
        ];

        // ---- Recent Loans ----
        $peminjaman_terbaru = Peminjaman::with(['user', 'buku'])
            ->latest()
            ->limit(8)
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'nama_anggota'=> $p->user?->name ?? '-',
                // Buku mungkin sudah dihapus -> hindari error dengan pengecekan null
                'judul_buku'  => $p->buku?->judul ?? 'Buku tidak tersedia',
                'status'      => $p->status,
                'tanggal'     => $p->created_at,
            ]);

        // ---- New Members ----
        $anggota_baru = User::role('pengguna')
            ->latest()
            ->limit(6)
            ->get()
            ->map(fn($u) => [
                'id'        => $u->id,
                'nama'      => $u->name,
                'email'     => $u->email,
                'no_anggota'=> $u->no_anggota,
                'tanggal'   => $u->created_at,
            ]);

        return Inertia::render('Admin/Dashboard', [
            'statistik'          => $statistik,
            'peminjaman_terbaru' => $peminjaman_terbaru,
            'anggota_baru'       => $anggota_baru,
        ]);
    }
}
