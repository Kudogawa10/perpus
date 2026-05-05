<?php

namespace App\Http\Controllers\Petugas;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Kategori};
use Illuminate\Http\Request;
use Inertia\Inertia;

class BukuController extends Controller
{
    public function index(Request $request)
    {
        $query = Buku::with('kategoriRelasi');

        if ($search = $request->get('search')) {
            $query->search($search);
        }

        $buku     = $query->latest()->paginate(20)->withQueryString();
        $kategori = Kategori::orderBy('nama')->get();

        return Inertia::render('Petugas/Buku', [
            'buku'     => $buku,
            'kategori' => $kategori,
            'filters'  => $request->only('search'),
        ]);
    }

    public function updateStok(Request $request, Buku $buku)
    {
        $request->validate([
            'stok_total'    => 'required|integer|min:0',
            'stok_tersedia' => 'required|integer|min:0|lte:stok_total',
        ]);

        $buku->update([
            'stok_total'    => $request->stok_total,
            'stok_tersedia' => $request->stok_tersedia,
        ]);

        return back()->with('success', 'Stok buku berhasil diperbarui.');
    }
}
