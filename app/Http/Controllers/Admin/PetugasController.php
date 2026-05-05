<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{User, Petugas};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Hash, Storage};
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class PetugasController extends Controller
{
    public function index()
    {
        $petugas = Petugas::with('user')->orderBy('bagian')->get();

        return Inertia::render('Admin/Petugas', [
            'petugas' => $petugas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => ['required', 'string', 'max:72', Password::min(8)->letters()->numbers()],
            'phone'    => 'nullable|string|max:20',
            'nip'      => 'required|string|max:30|unique:petugas,nip',
            'jabatan'  => 'required|string|max:100',
            'bagian'   => 'required|string|max:100',
            'tentang'  => 'nullable|string',
            'foto'     => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $user = User::create([
            'name'       => $request->name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'phone'      => $request->phone,
            'no_anggota' => User::generateNoAnggota(),
            'status'     => 'aktif',
        ]);
        $user->assignRole('petugas');

        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $fotoPath = $request->file('foto')->store('petugas', 'public');
        }

        Petugas::create([
            'user_id' => $user->id,
            'nip'     => $request->nip,
            'jabatan' => $request->jabatan,
            'bagian'  => $request->bagian,
            'tentang' => $request->tentang,
            'foto'    => $fotoPath,
        ]);

        return back()->with('success', 'Petugas berhasil ditambahkan.');
    }

    public function update(Request $request, Petugas $petugas)
    {
        $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|unique:users,email,' . $petugas->user_id,
            'phone'   => 'nullable|string|max:20',
            'nip'     => 'required|string|max:30|unique:petugas,nip,' . $petugas->id,
            'jabatan' => 'required|string|max:100',
            'bagian'  => 'required|string|max:100',
            'tentang' => 'nullable|string',
            'foto'    => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $petugas->user->update([
            'name'  => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        $data = $request->only('nip', 'jabatan', 'bagian', 'tentang');

        if ($request->hasFile('foto')) {
            if ($petugas->foto) Storage::disk('public')->delete($petugas->foto);
            $data['foto'] = $request->file('foto')->store('petugas', 'public');
        }

        $petugas->update($data);

        return back()->with('success', 'Data petugas berhasil diperbarui.');
    }

    public function destroy(Petugas $petugas)
    {
        if ($petugas->foto) Storage::disk('public')->delete($petugas->foto);
        $petugas->user->removeRole('petugas');
        $petugas->delete();
        return back()->with('success', 'Petugas berhasil dihapus.');
    }
}
