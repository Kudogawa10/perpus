<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peminjaman', function (Blueprint $table) {
            if (!Schema::hasColumn('peminjaman', 'kondisi_buku_saat_serah')) {
                $table->text('kondisi_buku_saat_serah')->nullable()->after('denda');
            }
            if (!Schema::hasColumn('peminjaman', 'bukti_penyerahan')) {
                $table->string('bukti_penyerahan')->nullable()->after('kondisi_buku_saat_serah');
            }
        });
    }

    public function down(): void
    {
        Schema::table('peminjaman', function (Blueprint $table) {
            if (Schema::hasColumn('peminjaman', 'bukti_penyerahan')) {
                $table->dropColumn('bukti_penyerahan');
            }
            if (Schema::hasColumn('peminjaman', 'kondisi_buku_saat_serah')) {
                $table->dropColumn('kondisi_buku_saat_serah');
            }
        });
    }
};
