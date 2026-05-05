<?php

namespace App\Http\Controllers\Pengguna;

use App\Http\Controllers\Controller;
use App\Models\{Buku, Peminjaman};
use Illuminate\Support\Facades\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class PeminjamanController extends Controller
{
    public function index(Request $request)
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $user = auth()->user();

        $peminjaman = Peminjaman::with(['buku'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'disetujui', 'dipinjam', 'terlambat', Peminjaman::STATUS_PENGAJUAN_KEMBALI])
            ->latest()
            ->paginate(10);

        // Auto-check terlambat
        foreach ($peminjaman as $p) {
            $p->cekDanUpdateTerlambat();
        }

        return Inertia::render('Pengguna/Peminjaman', [
            'peminjaman' => $peminjaman,
        ]);
    }

    public function store(Request $request)
    {
        // Handle cases where frontend wrapped the actual fields under a `data` key
        $all = $request->all();
        if (isset($all['data']) && is_array($all['data'])) {
            $request->merge($all['data']);
        }
        $request->validate([
            'buku_id' => 'required|exists:buku,id',
            'tanggal_kembali_rencana' => 'nullable|date',
            'tanggal_pinjam' => 'nullable|date',
        ]);

        // Ensure user accepted terms (handle flexible input formats from frontend)
        if (! $request->boolean('accepted_syarat')) {
            return back()->withErrors(['accepted_syarat' => 'Anda harus menyetujui syarat dan ketentuan peminjaman.']);
        }

        $user = auth()->user();
        $buku = Buku::findOrFail($request->buku_id);

        // Hanya anggota dengan domisili di JABODETABEK boleh meminjam
        // `domisili` disimpan sebagai "Kabupaten / Kecamatan" — cek bagian kabupaten saja
        $jabodetabek = config('perpus.jabodetabek', []);
        $kabupaten = '';
        if (!empty($user->domisili)) {
            $parts = explode('/', $user->domisili);
            $kabupaten = trim($parts[0]);
        }
        if (empty($kabupaten) || !in_array($kabupaten, $jabodetabek)) {
            return back()->withErrors(['domisili' => 'Hanya anggota dengan domisili di wilayah JABODETABEK yang boleh meminjam.']);
        }

        // Validasi: buku tersedia?
        if ($buku->stok_tersedia <= 0) {
            return back()->withErrors(['buku_id' => 'Stok buku tidak tersedia saat ini.']);
        }

        // Validasi: user sudah meminjam buku ini?
        $sudahDipinjam = Peminjaman::where('user_id', $user->id)
            ->where('buku_id', $buku->id)
            ->whereIn('status', ['menunggu', 'disetujui', 'dipinjam', 'terlambat', Peminjaman::STATUS_PENGAJUAN_KEMBALI])
            ->exists();

        if ($sudahDipinjam) {
            return back()->withErrors(['buku_id' => 'Anda sudah meminjam buku ini.']);
        }

        // Validasi: max 3 peminjaman aktif
        $totalAktif = Peminjaman::where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'disetujui', 'dipinjam', 'terlambat', Peminjaman::STATUS_PENGAJUAN_KEMBALI])
            ->count();

        if ($totalAktif >= 3) {
            return back()->withErrors(['buku_id' => 'Anda sudah mencapai batas maksimal peminjaman (3 buku).']);
        }

        // Record borrowing: allow user to specify pickup datetime
        if ($request->filled('tanggal_pinjam')) {
            $tglPinjam = Carbon::parse($request->input('tanggal_pinjam'));
            // Frontend input only has minute precision (no seconds),
            // so compare with "now" rounded down to minute to avoid
            // false negatives when seconds are > 00.
            $now = Carbon::now()->startOfMinute();
            $maxPickup = $now->copy()->addDays(7);
            if ($tglPinjam->lt($now)) {
                return back()->withErrors(['tanggal_pinjam' => 'Tanggal pengambilan harus sama atau setelah sekarang.']);
            }
            if ($tglPinjam->gt($maxPickup)) {
                return back()->withErrors(['tanggal_pinjam' => 'Tanggal pengambilan terlalu jauh (maks 7 hari).']);
            }
        } else {
            $tglPinjam = Carbon::now();
        }

        if ($request->filled('tanggal_kembali_rencana')) {
            $tglRencana = Carbon::parse($request->input('tanggal_kembali_rencana'));
            $max = $tglPinjam->copy()->addMonth();
            if ($tglRencana->lt($tglPinjam)) {
                return back()->withErrors(['tanggal_kembali_rencana' => 'Tanggal rencana harus sama atau setelah tanggal pengambilan.']);
            }
            if ($tglRencana->gt($max)) {
                return back()->withErrors(['tanggal_kembali_rencana' => 'Batas maksimal pengembalian adalah 1 bulan dari tanggal pengambilan.']);
            }
        } else {
            $tglRencana = $tglPinjam->copy()->addDays(Peminjaman::DURASI_PINJAM_DEFAULT);
        }

        Peminjaman::create([
            'user_id'                 => $user->id,
            'buku_id'                 => $buku->id,
            'kode_peminjaman'         => Peminjaman::generateKode(),
            'tanggal_pinjam'          => $tglPinjam,
            'tanggal_kembali_rencana' => $tglRencana,
            'status'                  => Peminjaman::STATUS_MENUNGGU,
        ]);

        return back()->with('success', 'Permintaan peminjaman berhasil dikirim. Tunggu persetujuan petugas.');
    }

    public function show(Peminjaman $peminjaman)
    {
        $this->authorize('view', $peminjaman);

        $peminjaman->load(['buku', 'petugas', 'user']);

        return Inertia::render('Pengguna/DetailPeminjaman', [
            'peminjaman' => $peminjaman,
        ]);
    }

    /**
     * User requests a return (ajukan pengembalian).
     */
    public function ajukanKembali(Request $request, Peminjaman $peminjaman)
    {
        $this->authorize('update', $peminjaman);

        if (!in_array($peminjaman->status, [Peminjaman::STATUS_DIPINJAM, Peminjaman::STATUS_TERLAMBAT])) {
            return back()->withErrors(['status' => 'Status peminjaman tidak memungkinkan pengajuan pengembalian.']);
        }

        $request->validate([
            'catatan' => 'nullable|string|max:1000',
        ]);

        $peminjaman->update([
            'status' => Peminjaman::STATUS_PENGAJUAN_KEMBALI,
            'catatan' => $request->catatan ?? $peminjaman->catatan,
        ]);

        // Notify petugas/admin about the return request
        try {
            $users = \App\Models\User::whereHas('roles', function($q){ $q->whereIn('name', ['petugas','admin']); })->get();
            if ($users->count()) {
                Notification::send($users, new \App\Notifications\PengembalianDiajukan($peminjaman));
            }
        } catch (\Throwable $e) {
            // ignore notification errors
        }

        return back()->with('success', 'Permintaan pengembalian berhasil diajukan. Petugas akan menindaklanjuti.');
    }

    public function cancel(Peminjaman $peminjaman)
    {
        $this->authorize('delete', $peminjaman);

        if ($peminjaman->status !== Peminjaman::STATUS_MENUNGGU) {
            return back()->withErrors(['status' => 'Hanya peminjaman dengan status menunggu yang bisa dibatalkan.']);
        }

        $peminjaman->update(['status' => Peminjaman::STATUS_DITOLAK, 'catatan' => 'Dibatalkan oleh anggota.']);

        return back()->with('success', 'Peminjaman berhasil dibatalkan.');
    }

    public function riwayat(Request $request)
    {
        Peminjaman::sinkronkanStatusDanDenda();

        $user = auth()->user();

        $riwayat = Peminjaman::with(['buku'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['dikembalikan', 'ditolak'])
            ->latest()
            ->paginate(15);

        // Attach user's ulasan (if any) for the books in this page of results
        $bookIds = $riwayat->getCollection()->pluck('buku_id')->filter()->unique()->values()->all();
        $ulasanMap = [];
        if (!empty($bookIds)) {
            $ulasan = \App\Models\Ulasan::where('user_id', $user->id)
                ->whereIn('buku_id', $bookIds)
                ->get()
                ->keyBy('buku_id');

            foreach ($ulasan as $buku_id => $u) {
                $ulasanMap[$buku_id] = $u;
            }
        }

        $riwayat->getCollection()->transform(function ($p) use ($ulasanMap) {
            $p->ulasan = $ulasanMap[$p->buku_id] ?? null;
            $p->has_ulasan = $p->ulasan ? true : false;
            return $p;
        });

        return Inertia::render('Pengguna/Riwayat', [
            'riwayat' => $riwayat,
        ]);
    }

    /**
     * Generate a PDF struk for a returned peminjaman (accessible to owner or petugas/admin).
     */
    public function cetakStrukReturn(Peminjaman $peminjaman)
    {
        $this->authorize('view', $peminjaman);

        if ($peminjaman->status !== Peminjaman::STATUS_DIKEMBALIKAN) {
            abort(422, 'Struk hanya tersedia untuk peminjaman yang sudah dikembalikan.');
        }

        $peminjaman->load(['user', 'buku', 'petugas']);

        $pdf = Pdf::loadView('laporan.struk_pengembalian', [
            'peminjaman' => $peminjaman,
        ])->setPaper('a6', 'portrait');

        $filename = "struk-pengembalian-{$peminjaman->kode_peminjaman}.pdf";
        return $pdf->download($filename);
    }

    /**
     * Generate a PDF struk for peminjaman (peminjaman receipt)
     */
    public function cetakStruk(Peminjaman $peminjaman)
    {
        $this->authorize('view', $peminjaman);

        $peminjaman->load(['user', 'buku', 'petugas']);

        $pdf = Pdf::loadView('laporan.struk_peminjaman', [
            'peminjaman' => $peminjaman,
        ])->setPaper('a6', 'portrait');

        $filename = "struk-peminjaman-{$peminjaman->kode_peminjaman}.pdf";
        return $pdf->download($filename);
    }
}
