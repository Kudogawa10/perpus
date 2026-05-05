<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('laporan_buku', function (Blueprint $table) {
            $table->id();
            $table->foreignId('petugas_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->restrictOnDelete();
            $table->foreignId('peminjaman_id')->nullable()->constrained('peminjaman')->nullOnDelete();
            $table->unsignedSmallInteger('stok_total')->default(0);
            $table->unsignedSmallInteger('stok_tersedia')->default(0);
            $table->text('kondisi_buku');
            $table->text('catatan')->nullable();
            $table->string('bukti_gambar')->nullable();
            $table->enum('status', ['dikirim', 'ditinjau'])->default('dikirim');
            $table->foreignId('ditinjau_admin_id')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('ditinjau_pada')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
            $table->index(['petugas_id', 'created_at']);
            $table->index(['buku_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('laporan_buku');
    }
};
