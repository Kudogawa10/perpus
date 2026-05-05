<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnggotaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::role('pengguna');

        if ($s = $request->get('search')) {
            $query->where(fn($q) => $q
                ->where('name', 'like', "%$s%")
                ->orWhere('email', 'like', "%$s%")
                ->orWhere('no_anggota', 'like', "%$s%")
            );
        }

        $anggota = $query->withCount('peminjaman')->latest()->paginate(20)->withQueryString();

        return Inertia::render('Petugas/Anggota', [
            'anggota' => $anggota,
            'filters' => $request->only('search'),
        ]);
    }

    public function show(User $user)
    {
        \App\Models\Peminjaman::sinkronkanStatusDanDenda();
        $user->load(['peminjaman.buku']);

        return Inertia::render('Petugas/DetailAnggota', [
            'anggota' => $user,
            'stats'   => [
                'total'    => $user->peminjaman->count(),
                'aktif'    => $user->peminjaman->whereIn('status', ['dipinjam', 'terlambat'])->count(),
                'denda'    => $user->peminjaman->sum(fn ($p) => $p->hitungDenda()),
                'level'    => $user->getLevelAnggota(),
            ],
        ]);
    }
}
