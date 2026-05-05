<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Buku;
use App\Models\Peminjaman;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

echo "== Controller ajukanKembali test ==\n";

$pengguna = User::whereHas('roles', function($q){ $q->where('name', 'pengguna'); })->first();
if (! $pengguna) { $pengguna = User::first(); }
if (! $pengguna) { echo "No users found\n"; exit(1); }

auth()->login($pengguna);
echo "Logged in as user id={$pengguna->id} name={$pengguna->name}\n";

$buku = Buku::first();
if (! $buku) { echo "No buku\n"; exit(1); }

// create peminjaman owned by this user
$p = Peminjaman::create([
    'user_id' => $pengguna->id,
    'buku_id' => $buku->id,
    'kode_peminjaman' => Peminjaman::generateKode(),
    'tanggal_pinjam' => now()->subDays(2),
    'tanggal_kembali_rencana' => now()->addDays(12),
    'status' => Peminjaman::STATUS_DIPINJAM,
]);

echo "Created peminjaman id={$p->id} status={$p->status}\n";

$request = Request::create('/peminjaman/' . $p->id . '/ajukan-kembali', 'POST', ['catatan' => 'Ajukan via controller test']);

$controller = new App\Http\Controllers\Pengguna\PeminjamanController();

try {
    $response = $controller->ajukanKembali($request, $p);
    echo "Controller returned: ";
    if (is_object($response)) {
        echo get_class($response) . PHP_EOL;
    } else { echo var_export($response, true) . PHP_EOL; }

    $p->refresh();
    echo "After controller: status={$p->status} catatan={$p->catatan}\n";
} catch (\Throwable $e) {
    echo "Exception: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
