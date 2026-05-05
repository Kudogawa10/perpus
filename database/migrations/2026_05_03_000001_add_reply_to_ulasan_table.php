<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('ulasan', function (Blueprint $table) {
            $table->text('balasan')->nullable()->after('komentar');
            $table->foreignId('balasan_admin_id')->nullable()->after('balasan')->constrained('users')->nullOnDelete();
            $table->timestamp('balasan_dibalas_pada')->nullable()->after('balasan_admin_id');
        });
    }

    public function down(): void
    {
        Schema::table('ulasan', function (Blueprint $table) {
            $table->dropForeign(['balasan_admin_id']);
            $table->dropColumn(['balasan', 'balasan_admin_id', 'balasan_dibalas_pada']);
        });
    }
};
