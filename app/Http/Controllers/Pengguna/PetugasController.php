<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\Petugas;
use Inertia\Inertia;

class PetugasController extends Controller
{
    public function index()
    {
        $petugas = Petugas::with('user')
            ->orderBy('bagian')
            ->orderBy('jabatan')
            ->get();

        return Inertia::render('Pengguna/Petugas', [
            'petugas' => $petugas,
        ]);
    }
}
