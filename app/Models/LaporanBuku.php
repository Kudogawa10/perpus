<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LaporanBuku extends Model
{
    protected $table = 'laporan_buku';

    protected $fillable = [
        'petugas_id',
        'buku_id',
        'peminjaman_id',
        'stok_total',
        'stok_tersedia',
        'kondisi_buku',
        'catatan',
        'bukti_gambar',
        'status',
        'ditinjau_admin_id',
        'ditinjau_pada',
    ];

    protected $casts = [
        'stok_total' => 'integer',
        'stok_tersedia' => 'integer',
        'ditinjau_pada' => 'datetime',
    ];

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    public function adminPeninjau()
    {
        return $this->belongsTo(User::class, 'ditinjau_admin_id');
    }

    public function buku()
    {
        return $this->belongsTo(Buku::class);
    }

    public function peminjaman()
    {
        return $this->belongsTo(Peminjaman::class);
    }
}
