<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\Ulasan;
use App\Models\Peminjaman;
use Illuminate\Http\Request;

class UlasanController extends Controller
{
    public function index(Request $request)
    {
        $bukuId = $request->get('buku_id');
        $query = Ulasan::with(['user:id,name,avatar,no_anggota'])->when($bukuId, function ($q) use ($bukuId) {
            return $q->where('buku_id', $bukuId);
        });

        return response()->json($query->orderByDesc('created_at')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'buku_id' => 'required|exists:buku,id',
            'rating'  => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Hanya izinkan pengguna yang sudah pernah meminjam buku (dipinjam / terlambat / dikembalikan)
        $hasBorrowed = Peminjaman::where('user_id', $user->id)
            ->where('buku_id', $request->buku_id)
            ->whereIn('status', [Peminjaman::STATUS_DIPINJAM, Peminjaman::STATUS_TERLAMBAT, Peminjaman::STATUS_DIKEMBALIKAN])
            ->exists();

        if (! $hasBorrowed) {
            return response()->json(['message' => 'Hanya pengguna yang sudah meminjam buku ini yang dapat mengulas.'], 403);
        }

        $ulasan = Ulasan::updateOrCreate(
            ['user_id' => $user->id, 'buku_id' => $request->buku_id],
            ['rating' => $request->rating, 'komentar' => $request->komentar]
        );

        $ulasan->load('user:id,name,avatar,no_anggota');

        try {
            event(new \App\Events\UlasanCreated($ulasan));
        } catch (\Throwable $e) {
            // ignore broadcasting errors
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json($ulasan);
        }

        return back()->with('success', 'Ulasan berhasil disimpan.');
    }

    /**
     * Update the specified ulasan (only owner).
     */
    public function update(Request $request, Ulasan $ulasan)
    {
        $user = $request->user();
        if (! $user || $user->id !== $ulasan->user_id) {
            return response()->json(['message' => 'Tidak diizinkan.'], 403);
        }

        $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'komentar' => 'nullable|string|max:1000',
        ]);

        $ulasan->update([
            'rating' => $request->rating,
            'komentar' => $request->komentar,
        ]);

        $ulasan->load('user:id,name,avatar,no_anggota', 'buku', 'balasanAdmin:id,name,avatar');

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json($ulasan);
        }

        return back()->with('success', 'Ulasan berhasil diperbarui.');
    }

    /**
     * Remove the specified ulasan (only owner).
     */
    public function destroy(Request $request, Ulasan $ulasan)
    {
        $user = $request->user();
        if (! $user || $user->id !== $ulasan->user_id) {
            return response()->json(['message' => 'Tidak diizinkan.'], 403);
        }

        $ulasan->delete();

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json(['message' => 'Ulasan dihapus']);
        }

        return back()->with('success', 'Ulasan berhasil dihapus.');
    }
}
