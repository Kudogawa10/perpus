<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class Buku extends Model
{
    protected $table = 'buku';

    protected $fillable = [
        'judul', 'penulis', 'penerbit', 'tahun_terbit',
        'isbn', 'kategori_id', 'deskripsi', 'cover',
        'file_pdf', 'stok_total', 'stok_tersedia',
        'halaman', 'bahasa', 'bisa_online',
    ];

    protected $casts = [
        'bisa_online'  => 'boolean',
        'tahun_terbit' => 'integer',
        'stok_total'   => 'integer',
        'stok_tersedia'=> 'integer',
        'halaman'      => 'integer',
        'rating'       => 'float',
    ];

    protected $appends = ['kategori'];

    // ---- Relationships ----

    public function kategoriRelasi()
    {
        return $this->belongsTo(Kategori::class, 'kategori_id');
    }

    public function peminjaman()
    {
        return $this->hasMany(Peminjaman::class);
    }

    public function readingProgress()
    {
        return $this->hasMany(ReadingProgress::class);
    }

    public function ulasan()
    {
        return $this->hasMany(Ulasan::class);
    }

    // ---- Accessors ----

    public function getKategoriAttribute(): string
    {
        return $this->kategoriRelasi?->nama ?? '-';
    }

    public function getRatingAttribute(): float
    {
        return round($this->ulasan()->avg('rating') ?? 0, 1);
    }

    public function getTotalRatingAttribute(): int
    {
        return $this->ulasan()->count();
    }

    public function getTotalPeminjamanAttribute(): int
    {
        return $this->peminjaman()->count();
    }

    // ---- Scopes ----

    public function scopeTersedia(Builder $query): Builder
    {
        return $query->where('stok_tersedia', '>', 0);
    }

    public function scopeOnline(Builder $query): Builder
    {
        return $query->where('bisa_online', true)->whereNotNull('file_pdf');
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        return $query->where(function ($q) use ($term) {
            $q->where('judul',   'like', "%{$term}%")
              ->orWhere('penulis','like', "%{$term}%")
              ->orWhere('isbn',   'like', "%{$term}%")
              ->orWhere('penerbit','like',"%{$term}%");
        });
    }

    // ---- Helpers ----

    public function kurangiStok(): bool
    {
        if ($this->stok_tersedia <= 0) return false;
        $this->decrement('stok_tersedia');
        return true;
    }

    public function tambahStok(): void
    {
        if ($this->stok_tersedia < $this->stok_total) {
            $this->increment('stok_tersedia');
        }
    }
}
