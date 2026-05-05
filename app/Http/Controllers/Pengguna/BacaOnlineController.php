<?php
// ============================================================
// BacaOnlineController
// ============================================================

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Peminjaman, ReadingProgress};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class BacaOnlineController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Buku yang sedang dipinjam dan bisa online
        $dipinjam = Peminjaman::with('buku')
            ->where('user_id', $user->id)
            ->whereIn('status', ['dipinjam', 'terlambat'])
            ->whereHas('buku', fn($q) => $q->online())
            ->get()
            ->pluck('buku');

        // Semua buku yang bisa dibaca online
        $bukuOnline = Buku::online()
            ->when($request->get('search'), fn($q, $s) => $q->search($s))
            ->paginate(20);

        // Progress membaca
        $progress = ReadingProgress::where('user_id', $user->id)
            ->with('buku')
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Pengguna/BacaOnlineIndex', [
            'buku_dipinjam' => $dipinjam,
            'buku_online'   => $bukuOnline,
            'progress'      => $progress,
            'filters'       => $request->only('search'),
        ]);
    }

    public function show(Buku $buku)
    {
        $user = auth()->user();

        if (! $this->canReadBook($buku, $user)) {
            abort(403, 'Anda belum memiliki akses baca untuk buku ini.');
        }

        $halamanTerakhir = ReadingProgress::where('user_id', $user->id)
            ->where('buku_id', $buku->id)
            ->value('halaman') ?? 1;

        return Inertia::render('Pengguna/BacaOnline', [
            'buku'           => $buku,
            'halaman_terakhir'=> $halamanTerakhir,
        ]);
    }

    public function pdf(Buku $buku)
    {
        $user = auth()->user();

        if (! $this->canReadBook($buku, $user)) {
            abort(403, 'Anda belum memiliki akses baca untuk buku ini.');
        }

        if (! $buku->file_pdf) {
            abort(404);
        }

        $path = $this->resolvePdfPath($buku->file_pdf);

        if (! $path) {
            abort(404);
        }

        $filename = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $buku->judul));
        $filename = trim($filename, '-') ?: 'buku';

        return response()->file($path, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$filename.'.pdf"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    private function canReadBook(Buku $buku, $user): bool
    {
        if (! $user) {
            return false;
        }

        if ($buku->bisa_online) {
            return true;
        }

        return Peminjaman::where('user_id', $user->id)
            ->where('buku_id', $buku->id)
            ->whereIn('status', ['dipinjam', 'terlambat'])
            ->exists();
    }

    private function resolvePdfPath(string $file): ?string
    {
        foreach (['local', 'public'] as $disk) {
            if (Storage::disk($disk)->exists($file)) {
                return Storage::disk($disk)->path($file);
            }
        }

        return null;
    }
}
