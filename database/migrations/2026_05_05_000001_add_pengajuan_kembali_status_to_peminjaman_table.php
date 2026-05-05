<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Add 'pengajuan_kembali' to the peminjaman.status enum
        DB::statement("ALTER TABLE `peminjaman` MODIFY `status` ENUM('menunggu','disetujui','dipinjam','pengajuan_kembali','dikembalikan','terlambat','ditolak') NOT NULL DEFAULT 'menunggu'");
    }

    public function down()
    {
        // Revert to previous enum values (without pengajuan_kembali)
        DB::statement("ALTER TABLE `peminjaman` MODIFY `status` ENUM('menunggu','disetujui','dipinjam','dikembalikan','terlambat','ditolak') NOT NULL DEFAULT 'menunggu'");
    }
};
