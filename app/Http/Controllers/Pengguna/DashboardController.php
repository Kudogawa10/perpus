<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Peminjaman};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $user = auth()->user();

        // Stats
        $stats = [
            'sedang_dipinjam'    => Peminjaman::where('user_id', $user->id)
                ->whereIn('status', ['dipinjam', 'terlambat'])->count(),
            'total_dipinjam'     => Peminjaman::where('user_id', $user->id)->count(),
            'buku_dibaca_online' => $user->readingProgress()->count(),
            'poin_anggota'       => $user->getPoinAnggota(),
        ];

        // Peminjaman aktif (limit 5)
        $peminjaman_aktif = Peminjaman::with(['buku'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'disetujui', 'dipinjam', 'terlambat'])
            ->latest()
            ->limit(5)
            ->get();

        // Buku yang akan jatuh tempo (3 hari)
        $peminjaman_akan_kembali = Peminjaman::with('buku')
            ->where('user_id', $user->id)
            ->where('status', 'dipinjam')
            ->whereBetween('tanggal_kembali_rencana', [Carbon::now(), Carbon::now()->addDays(3)])
            ->get();

        // Rekomendasi (populer berdasarkan total peminjaman)
        $buku_rekomendasi = Buku::withCount(['peminjaman'])
            ->where('stok_tersedia', '>', 0)
            ->orderByDesc('peminjaman_count')
            ->limit(6)->get();

        // Buku baru
        $buku_baru = Buku::latest()->limit(6)->get();

        return Inertia::render('Pengguna/Dashboard', [
            'stats'                    => $stats,
            'peminjaman_aktif'         => $peminjaman_aktif,
            'buku_rekomendasi'         => $buku_rekomendasi,
            'buku_baru'                => $buku_baru,
            'peminjaman_akan_kembali'  => $peminjaman_akan_kembali,
        ]);
    }
}
