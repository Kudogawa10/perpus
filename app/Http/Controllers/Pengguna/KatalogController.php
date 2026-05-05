<?php
// ============================================================
// KatalogController
// File: app/Http/Controllers/Pengguna/KatalogController.php
// ============================================================

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Kategori};
use Illuminate\Http\Request;
use Inertia\Inertia;

class KatalogController extends Controller
{
    public function index(Request $request)
    {
        $query = Buku::with('kategoriRelasi');

        // Search
        if ($search = $request->get('search')) {
            $query->search($search);
        }

        // Filter kategori
        if ($kategoriSlug = $request->get('kategori')) {
            $query->whereHas('kategoriRelasi', fn($q) => $q->where('slug', $kategoriSlug));
        }

        // Filter tersedia
        if ($request->boolean('tersedia')) {
            $query->tersedia();
        }

        // Sort
        match ($request->get('sort', 'terbaru')) {
            'terpopuler' => $query->withCount('peminjaman')->orderByDesc('peminjaman_count'),
            'judul'      => $query->orderBy('judul'),
            'penulis'    => $query->orderBy('penulis'),
            default      => $query->latest(),
        };

        $buku     = $query->paginate(24)->withQueryString();
        $kategori = Kategori::withCount('buku')->orderByDesc('buku_count')->get();

        return Inertia::render('Pengguna/Katalog', [
            'buku'     => $buku,
            'kategori' => $kategori,
            'filters'  => $request->only('search', 'kategori', 'sort', 'tersedia'),
        ]);
    }

    public function show(Buku $buku)
    {
        $buku->load('kategoriRelasi', 'ulasan.user');

        $user = auth()->user();
        $is_dipinjam = \App\Models\Peminjaman::where('user_id', $user->id)
            ->where('buku_id', $buku->id)
            ->whereIn('status', ['menunggu', 'disetujui', 'dipinjam'])
            ->exists();

        // Bisa ulasan jika pengguna pernah meminjam buku ini (dipinjam, terlambat, atau sudah dikembalikan)
        $bisa_ulasan = \App\Models\Peminjaman::where('user_id', $user->id)
            ->where('buku_id', $buku->id)
            ->whereIn('status', ['dipinjam', 'terlambat', 'dikembalikan'])
            ->exists();

        $buku_serupa = Buku::where('kategori_id', $buku->kategori_id)
            ->where('id', '!=', $buku->id)
            ->limit(6)->get();

        return Inertia::render('Pengguna/DetailBuku', [
            'buku'       => $buku,
            'is_dipinjam'=> $is_dipinjam,
            'bisa_ulasan' => $bisa_ulasan,
            'buku_serupa'=> $buku_serupa,
        ]);
    }
}
