<?php

namespace Database\Seeders;

use App\Models\{User, Buku, Peminjaman};
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PeminjamanSeeder extends Seeder
{
    public function run(): void
    {
        $anggota = User::role('pengguna')->get();
        $buku    = Buku::all();
        $petugas = User::role('petugas')->first();

        if ($anggota->isEmpty() || $buku->isEmpty()) return;

        $statuses = [
            'dikembalikan' => 15,
            'dipinjam'     => 5,
            'terlambat'    => 3,
            'menunggu'     => 4,
        ];

        foreach ($statuses as $status => $count) {
            for ($i = 0; $i < $count; $i++) {
                $user      = $anggota->random();
                $bukuItem  = $buku->random();
                $tglPinjam = Carbon::now()->subDays(rand(1, 60));
                $rencana   = (clone $tglPinjam)->addDays(14);

                $data = [
                    'user_id'                  => $user->id,
                    'buku_id'                  => $bukuItem->id,
                    'petugas_id'               => $petugas?->id,
                    'kode_peminjaman'           => Peminjaman::generateKode(),
                    'tanggal_pinjam'           => $tglPinjam,
                    'tanggal_kembali_rencana'  => $rencana,
                    'status'                   => $status,
                    'catatan'                  => null,
                    // default denda 0; will be computed for 'terlambat'
                    'denda'                    => 0,
                ];

                if ($status === 'dikembalikan') {
                    $data['tanggal_kembali_aktual'] = (clone $rencana)->subDays(rand(0, 3));
                }
                if ($status === 'terlambat') {
                    $data['tanggal_kembali_rencana'] = Carbon::now()->subDays(rand(3, 10));
                    $hari = Carbon::now()->diffInDays(Carbon::parse($data['tanggal_kembali_rencana']));
                    // ensure integer, non-negative and use model constant for per-day fine
                    $hari = max(0, (int) round($hari));
                    $data['denda'] = $hari * Peminjaman::DENDA_PER_HARI;
                }

                Peminjaman::create($data);

                // Reduce stock for active loans
                if (in_array($status, ['dipinjam', 'terlambat', 'disetujui'])) {
                    $bukuItem->decrement('stok_tersedia');
                }
            }
        }
    }
}
