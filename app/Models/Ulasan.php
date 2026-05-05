<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ulasan extends Model
{
    protected $table = 'ulasan';

    protected $fillable = ['user_id', 'buku_id', 'rating', 'komentar', 'balasan', 'balasan_admin_id', 'balasan_dibalas_pada'];

    protected $casts = ['rating' => 'integer'];

    public function user() { return $this->belongsTo(User::class); }
    public function buku() { return $this->belongsTo(Buku::class); }
    public function balasanAdmin() { return $this->belongsTo(User::class, 'balasan_admin_id'); }
}
