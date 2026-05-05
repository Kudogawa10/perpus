<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\Ulasan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UlasanPageController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $ulasan = Ulasan::with('buku', 'balasanAdmin')
            ->where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Pengguna/Ulasan', [
            'ulasan' => $ulasan,
        ]);
    }
}
