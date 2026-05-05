<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ulasan;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UlasanController extends Controller
{
    public function index(Request $request)
    {
        $query = Ulasan::with('user', 'buku', 'balasanAdmin');
        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('komentar', 'like', "%{$search}%")
                  ->orWhereHas('user', fn($q2) => $q2->where('name', 'like', "%{$search}%"))
                  ->orWhereHas('buku', fn($q3) => $q3->where('judul', 'like', "%{$search}%"));
            });
        }
        $ulasan = $query->latest()->paginate(30)->withQueryString();
        return Inertia::render('Admin/Ulasan', [ 'ulasan' => $ulasan ]);
    }

    public function destroy(Ulasan $ulasan)
    {
        $id = $ulasan->id;
        $ulasan->delete();
        if (request()->wantsJson() || request()->ajax()) {
            return response()->json(['deleted' => true, 'id' => $id]);
        }
        return back()->with('success', 'Ulasan berhasil dihapus.');
    }

    public function update(Request $request, Ulasan $ulasan)
    {
        // Admin reply endpoint: only accept 'balasan' from admin
        $request->validate([ 'balasan' => 'nullable|string|max:1000' ]);

        if ($request->has('balasan')) {
            $ulasan->update([
                'balasan' => $request->balasan,
                'balasan_admin_id' => $request->user()->id,
                'balasan_dibalas_pada' => now(),
            ]);
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json($ulasan->fresh()->load('balasanAdmin', 'user', 'buku'));
        }

        return back()->with('success', 'Balasan ulasan berhasil disimpan.');
    }
}
