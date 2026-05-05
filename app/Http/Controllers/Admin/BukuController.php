<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Kategori};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BukuController extends Controller
{
    public function index(Request $request)
    {
        $query = Buku::with('kategoriRelasi');

        if ($search = $request->get('search')) {
            $query->search($search);
        }
        if ($kat = $request->get('kategori')) {
            $query->whereHas('kategoriRelasi', fn($q) => $q->where('nama', $kat));
        }

        $buku     = $query->latest()->paginate(20)->withQueryString();
        $kategori = Kategori::orderBy('nama')->get();

        return Inertia::render('Admin/ManajemenBuku', [
            'buku'     => $buku,
            'kategori' => $kategori,
            'filters'  => $request->only('search', 'kategori'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul'       => 'required|string|max:255',
            'penulis'     => 'required|string|max:255',
            'penerbit'    => 'required|string|max:255',
            'tahun_terbit'=> 'required|integer|min:1000|max:' . date('Y'),
            'isbn'        => 'nullable|string|max:20|unique:buku,isbn',
            'kategori'    => 'required|exists:kategori,nama',
            'deskripsi'   => 'nullable|string',
            'stok_total'  => 'required|integer|min:0',
            'halaman'     => 'nullable|integer|min:0',
            'bahasa'      => 'required|string|max:30',
            'bisa_online' => 'boolean',
            'cover'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'file_pdf'    => 'nullable|mimes:pdf|max:102400',
        ]);

        $kategori = Kategori::where('nama', $validated['kategori'])->firstOrFail();

        $data = array_merge($validated, [
            'kategori_id'   => $kategori->id,
            'stok_tersedia' => $validated['stok_total'],
        ]);
        unset($data['kategori']);

        if ($request->hasFile('cover')) {
            $data['cover'] = $request->file('cover')->store('buku/cover', 'public');
        }
        if ($request->hasFile('file_pdf')) {
            $data['file_pdf']    = $request->file('file_pdf')->store('buku/pdf', 'local');
            $data['bisa_online'] = true;
        }

        Buku::create($data);

        return back()->with('success', 'Buku berhasil ditambahkan.');
    }

    public function update(Request $request, Buku $buku)
    {
        $validated = $request->validate([
            'judul'       => 'required|string|max:255',
            'penulis'     => 'required|string|max:255',
            'penerbit'    => 'required|string|max:255',
            'tahun_terbit'=> 'required|integer|min:1000|max:' . date('Y'),
            'isbn'        => 'nullable|string|max:20|unique:buku,isbn,' . $buku->id,
            'kategori'    => 'required|exists:kategori,nama',
            'deskripsi'   => 'nullable|string',
            'stok_total'  => 'required|integer|min:0',
            'halaman'     => 'nullable|integer|min:0',
            'bahasa'      => 'required|string|max:30',
            'bisa_online' => 'boolean',
            'cover'       => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120',
            'file_pdf'    => 'nullable|mimes:pdf|max:102400',
        ]);

        $kategori = Kategori::where('nama', $validated['kategori'])->firstOrFail();
        $data     = array_merge($validated, ['kategori_id' => $kategori->id]);
        unset($data['kategori']);

        // Adjust stok_tersedia proportionally
        $stokDipinjam = $buku->stok_total - $buku->stok_tersedia;
        $data['stok_tersedia'] = max(0, $data['stok_total'] - $stokDipinjam);

        if ($request->hasFile('cover')) {
            if ($buku->cover) Storage::disk('public')->delete($buku->cover);
            $data['cover'] = $request->file('cover')->store('buku/cover', 'public');
        }
        if ($request->hasFile('file_pdf')) {
            $this->deletePdf($buku->file_pdf);
            $data['file_pdf']    = $request->file('file_pdf')->store('buku/pdf', 'local');
            $data['bisa_online'] = true;
        }

        $buku->update($data);

        return back()->with('success', 'Buku berhasil diperbarui.');
    }

    public function destroy(Buku $buku)
    {
        // Cek tidak ada peminjaman aktif
        $aktif = $buku->peminjaman()->whereIn('status', ['menunggu', 'disetujui', 'dipinjam', 'terlambat', \App\Models\Peminjaman::STATUS_PENGAJUAN_KEMBALI])->count();
        if ($aktif > 0) {
            return back()->withErrors(['buku' => 'Tidak bisa menghapus buku yang sedang dipinjam.']);
        }

        if ($buku->cover)    Storage::disk('public')->delete($buku->cover);
        $this->deletePdf($buku->file_pdf);

        $buku->delete();

        return back()->with('success', 'Buku berhasil dihapus.');
    }

    private function deletePdf(?string $path): void
    {
        if (! $path) {
            return;
        }

        Storage::disk('local')->delete($path);
        Storage::disk('public')->delete($path);
    }
}
