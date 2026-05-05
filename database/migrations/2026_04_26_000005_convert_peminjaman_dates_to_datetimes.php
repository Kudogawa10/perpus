<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('peminjaman')) {
            return;
        }

        // Attempt to convert DATE columns to DATETIME. This uses raw SQL ALTER
        // statements for MySQL. If you use a different DB engine, adjust accordingly.
        DB::statement("ALTER TABLE peminjaman MODIFY tanggal_pinjam DATETIME NOT NULL");
        DB::statement("ALTER TABLE peminjaman MODIFY tanggal_kembali_rencana DATETIME NOT NULL");
        DB::statement("ALTER TABLE peminjaman MODIFY tanggal_kembali_aktual DATETIME NULL");
    }

    public function down(): void
    {
        if (! Schema::hasTable('peminjaman')) {
            return;
        }

        DB::statement("ALTER TABLE peminjaman MODIFY tanggal_pinjam DATE NOT NULL");
        DB::statement("ALTER TABLE peminjaman MODIFY tanggal_kembali_rencana DATE NOT NULL");
        DB::statement("ALTER TABLE peminjaman MODIFY tanggal_kembali_aktual DATE NULL");
    }
};
