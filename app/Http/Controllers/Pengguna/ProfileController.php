<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth()->user();

        $stats = [
            'total_dipinjam'     => $user->peminjaman()->count(),
            'sedang_dipinjam'    => $user->peminjaman()->whereIn('status', ['dipinjam', 'terlambat'])->count(),
            'buku_favorit'       => $user->readingProgress()->count(),
            'tahun_bergabung'    => $user->created_at->year,
            'poin'               => $user->getPoinAnggota(),
            'level'              => $user->getLevelAnggota(),
        ];

        return Inertia::render('Pengguna/Profile', [
            'stats' => $stats,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name'         => 'required|string|max:255',
            'email'        => 'required|email|unique:users,email,' . $user->id,
            'phone'        => 'nullable|string|max:20',
            'address'      => 'nullable|string|max:500',
            'tanggal_lahir'=> 'nullable|date',
            'jenis_kelamin'=> 'nullable|in:L,P',
            'avatar'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $data = $request->only('name', 'email', 'phone', 'address', 'tanggal_lahir', 'jenis_kelamin');

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return back()->with('success', 'Profil berhasil diperbarui.');
    }
}
