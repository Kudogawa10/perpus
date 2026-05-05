<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\{Artisan, Schedule, DB};

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Auto-update status terlambat setiap tengah malam
Schedule::command('peminjaman:cek-terlambat')->dailyAt('00:05');

// Cleanup orphan peminjaman rows referencing missing buku
Artisan::command('peminjaman:cleanup {--delete} {--yes}', function () {
    $ids = DB::table('peminjaman')
        ->leftJoin('buku', 'peminjaman.buku_id', '=', 'buku.id')
        ->whereNull('buku.id')
        ->pluck('peminjaman.id')
        ->toArray();

    if (empty($ids)) {
        $this->comment('No orphan peminjaman rows found.');
        return 0;
    }

    $this->info('Found ' . count($ids) . ' orphan peminjaman rows: ' . implode(', ', $ids));

    if ($this->option('delete') || $this->option('yes') || $this->confirm('Delete these rows?')) {
        DB::table('peminjaman')->whereIn('id', $ids)->delete();
        $this->info('Deleted ' . count($ids) . ' rows.');
    } else {
        $this->info('Dry run only. Rerun with --delete to remove rows.');
    }
})->purpose('Delete peminjaman rows that reference missing buku records');
