<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Buku;
use App\Models\Peminjaman;
use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class ReadingProgressController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'buku_id' => 'required|exists:buku,id',
            'halaman' => 'required|integer|min:1',
        ]);

        $buku = Buku::findOrFail($request->buku_id);
        $userId = Auth::id();

        $canRead = $buku->bisa_online || Peminjaman::where('user_id', $userId)
            ->where('buku_id', $buku->id)
            ->whereIn('status', [Peminjaman::STATUS_DIPINJAM, Peminjaman::STATUS_TERLAMBAT])
            ->exists();

        abort_unless($canRead, 403);

        ReadingProgress::updateOrCreate(
            ['user_id' => $userId, 'buku_id' => $request->buku_id],
            ['halaman' => $request->halaman]
        );

        return response()->json(['success' => true]);
    }
}
