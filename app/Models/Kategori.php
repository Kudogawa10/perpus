<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kategori extends Model
{
    protected $table = 'kategori';

    protected $fillable = ['nama', 'slug', 'deskripsi', 'icon'];

    protected $appends = ['total_buku'];

    public function buku()
    {
        return $this->hasMany(Buku::class, 'kategori_id');
    }

    public function getTotalBukuAttribute(): int
    {
        return $this->buku()->count();
    }

    protected static function booted()
    {
        static::creating(function ($kategori) {
            if (empty($kategori->slug)) {
                $kategori->slug = \Str::slug($kategori->nama);
            }
        });
    }
}
