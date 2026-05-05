<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Petugas, Peminjaman, Kategori, Buku};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Hash, Storage};
use Inertia\Inertia;
use Carbon\Carbon;

// ============================================================
// AnggotaController
// ============================================================

class AnggotaController extends Controller
{
    public function index(Request $request)
    {
        $query = User::role('pengguna');

        if ($s = $request->get('search')) {
            $query->where(fn($q) => $q->where('name', 'like', "%$s%")->orWhere('email', 'like', "%$s%")->orWhere('no_anggota', 'like', "%$s%"));
        }
        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        $anggota = $query->withCount(['peminjaman'])->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Anggota', [
            'anggota' => $anggota,
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function show(User $user)
    {
        $user->load(['peminjaman.buku']);
        return Inertia::render('Admin/DetailAnggota', [
            'anggota' => $user,
            'stats'   => [
                'total_dipinjam'  => $user->peminjaman->count(),
                'aktif'           => $user->peminjaman->whereIn('status', ['dipinjam', 'terlambat'])->count(),
                'denda_total'     => $user->peminjaman->sum('denda'),
                'level'           => $user->getLevelAnggota(),
            ],
        ]);
    }

    public function updateStatus(Request $request, User $user)
    {
        $request->validate(['status' => 'required|in:aktif,nonaktif,ditangguhkan']);
        $user->update(['status' => $request->status]);
        return back()->with('success', 'Status anggota berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        $aktif = $user->peminjaman()->whereIn('status', ['dipinjam', 'terlambat'])->count();
        if ($aktif > 0) {
            return back()->withErrors(['user' => 'Tidak bisa menghapus anggota yang masih meminjam buku.']);
        }
        if ($user->avatar) Storage::disk('public')->delete($user->avatar);
        $user->delete();
        return back()->with('success', 'Anggota berhasil dihapus.');
    }
}
