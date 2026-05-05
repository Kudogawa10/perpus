<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Buku;
use App\Models\Peminjaman;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

echo "== Start return flow test ==\n";

$pengguna = User::whereHas('roles', function($q){ $q->where('name', 'pengguna'); })->first();
if (! $pengguna) { $pengguna = User::first(); }
if (! $pengguna) { echo "No users found\n"; exit(1); }
echo "pengguna id={$pengguna->id} name={$pengguna->name}\n";

$petugas = User::whereHas('roles', function($q){ $q->where('name', 'petugas'); })->first();
if (! $petugas) { $petugas = User::whereHas('roles', function($q){ $q->where('name', 'admin'); })->first(); }
if (! $petugas) { $petugas = User::first(); }
echo "petugas id={$petugas->id} name={$petugas->name}\n";

$buku = Buku::first();
if (! $buku) {
    $buku = Buku::create([
        'judul' => 'Test Buku (E2E)',
        'penulis' => 'Test Author',
        'stok_total' => 5,
        'stok_tersedia' => 5,
    ]);
    echo "Created buku id={$buku->id}\n";
} else {
    echo "buku id={$buku->id} judul={$buku->judul} stok_tersedia={$buku->stok_tersedia}\n";
}

// Create a peminjaman record for the pengguna
$p = Peminjaman::create([
    'user_id' => $pengguna->id,
    'buku_id' => $buku->id,
    'kode_peminjaman' => Peminjaman::generateKode(),
    'tanggal_pinjam' => now()->subDays(3),
    'tanggal_kembali_rencana' => now()->addDays(11),
    'status' => Peminjaman::STATUS_DIPINJAM,
]);

// decrement stock if available
if ($buku->stok_tersedia > 0) {
    $buku->decrement('stok_tersedia');
}

echo "Created peminjaman id={$p->id} kode={$p->kode_peminjaman} status={$p->status}\n";

// Simulate user ajukan kembali via model update + notification
try {
    if (! in_array($p->status, [Peminjaman::STATUS_DIPINJAM, Peminjaman::STATUS_TERLAMBAT])) {
        echo "Cannot ajukan-kembali from status={$p->status}\n";
    } else {
        $p->update(['status' => Peminjaman::STATUS_PENGAJUAN_KEMBALI, 'catatan' => 'Ajukan via E2E test']);
        echo "After ajukan: status={$p->status}\n";

        $staff = User::whereHas('roles', function($q){ $q->whereIn('name', ['petugas','admin']); })->get();
        echo "Found staff count=".count($staff)."\n";
        Notification::send($staff, new App\Notifications\PengembalianDiajukan($p));
        echo "Sent PengembalianDiajukan to staff\n";
    }
} catch (\Throwable $e) {
    echo "Error during ajukan-kembali: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}

// Simulate petugas confirming the return
try {
    $p->refresh();
    $p->update([ 'status' => Peminjaman::STATUS_DIKEMBALIKAN, 'tanggal_kembali_aktual' => now(), 'petugas_id' => $petugas->id ]);
    // restore stock
    $buku->increment('stok_tersedia');
    echo "After confirm: status={$p->status} tanggal_kembali_aktual={$p->tanggal_kembali_aktual}\n";

    // Notify user
    $p->user->notify(new App\Notifications\PengembalianDikonfirmasi($p));
    echo "Sent PengembalianDikonfirmasi to user id={$p->user->id}\n";
} catch (\Throwable $e) {
    echo "Error during confirm: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}

// Check notifications table
$notifs = DB::table('notifications')->orderBy('created_at', 'desc')->limit(8)->get();
echo "Last notifications:\n";
foreach ($notifs as $n) {
    echo "- id={$n->id} type={$n->type} data=" . substr($n->data,0,200) . "\n";
}

echo "== End test ==\n";
