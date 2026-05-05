<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LaporanBuku;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LaporanBukuController extends Controller
{
    public function index(Request $request)
    {
        $query = LaporanBuku::with(['buku', 'petugas', 'peminjaman', 'adminPeninjau'])->latest();

        if ($status = $request->get('status')) {
            $query->where('status', $status);
        }

        if ($search = $request->get('search')) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('buku', fn ($b) => $b->where('judul', 'like', "%{$search}%"))
                    ->orWhereHas('petugas', fn ($p) => $p->where('name', 'like', "%{$search}%"))
                    ->orWhere('kondisi_buku', 'like', "%{$search}%")
                    ->orWhere('catatan', 'like', "%{$search}%");
            });
        }

        return Inertia::render('Admin/LaporanBuku', [
            'laporan' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only('search', 'status'),
        ]);
    }

    public function tinjau(LaporanBuku $laporanBuku)
    {
        $laporanBuku->update([
            'status' => 'ditinjau',
            'ditinjau_admin_id' => auth()->id(),
            'ditinjau_pada' => now(),
        ]);

        return back()->with('success', 'Laporan ditandai sudah ditinjau.');
    }
}
