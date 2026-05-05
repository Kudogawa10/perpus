<?php
// File: database/migrations/2024_01_01_000002_create_kategori_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // ---- KATEGORI ----
        Schema::create('kategori', function (Blueprint $table) {
            $table->id();
            $table->string('nama', 100)->unique();
            $table->string('slug', 120)->unique();
            $table->text('deskripsi')->nullable();
            $table->string('icon', 50)->default('book');
            $table->timestamps();
        });

        // ---- BUKU ----
        Schema::create('buku', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->string('penulis');
            $table->string('penerbit');
            $table->smallInteger('tahun_terbit');
            $table->string('isbn', 20)->nullable()->unique();
            $table->foreignId('kategori_id')->constrained('kategori')->restrictOnDelete();
            $table->text('deskripsi')->nullable();
            $table->string('cover')->nullable();
            $table->string('file_pdf')->nullable();
            $table->unsignedSmallInteger('stok_total')->default(1);
            $table->unsignedSmallInteger('stok_tersedia')->default(1);
            $table->unsignedSmallInteger('halaman')->default(0);
            $table->string('bahasa', 30)->default('Indonesia');
            $table->boolean('bisa_online')->default(false);
            $table->timestamps();

            $table->index(['judul', 'penulis']);
            $table->index('kategori_id');
        });

        // ---- PETUGAS ----
        Schema::create('petugas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $table->string('nip', 30)->unique();
            $table->string('jabatan', 100);
            $table->string('bagian', 100);
            $table->string('foto')->nullable();
            $table->text('tentang')->nullable();
            $table->timestamps();
        });

        // ---- PEMINJAMAN ----
        Schema::create('peminjaman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->restrictOnDelete();
            $table->foreignId('petugas_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('kode_peminjaman', 20)->unique();
            $table->date('tanggal_pinjam');
            $table->date('tanggal_kembali_rencana');
            $table->date('tanggal_kembali_aktual')->nullable();
            $table->enum('status', ['menunggu', 'disetujui', 'dipinjam', 'dikembalikan', 'terlambat', 'ditolak'])
                  ->default('menunggu');
            $table->text('catatan')->nullable();
            $table->unsignedInteger('denda')->default(0);
            $table->timestamps();

            $table->index(['user_id', 'status']);
            $table->index(['buku_id', 'status']);
            $table->index('tanggal_kembali_rencana');
        });

        // ---- ULASAN ----
        Schema::create('ulasan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating'); // 1-5
            $table->text('komentar')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'buku_id']);
        });

        // ---- READING PROGRESS ----
        Schema::create('reading_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('buku_id')->constrained('buku')->cascadeOnDelete();
            $table->unsignedSmallInteger('halaman')->default(1);
            $table->timestamps();
            $table->unique(['user_id', 'buku_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reading_progress');
        Schema::dropIfExists('ulasan');
        Schema::dropIfExists('peminjaman');
        Schema::dropIfExists('petugas');
        Schema::dropIfExists('buku');
        Schema::dropIfExists('kategori');
    }
};
