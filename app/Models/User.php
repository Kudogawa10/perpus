<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasRoles, HasApiTokens;

    protected $fillable = [
        'name', 'email', 'password',
        'phone', 'address', 'domisili', 'avatar',
        'no_anggota', 'tanggal_lahir', 'jenis_kelamin',
        'status',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password'          => 'hashed',
        'tanggal_lahir'     => 'date',
    ];

    protected $appends = ['roles_list'];

    // ---- Relationships ----

    public function petugas()
    {
        return $this->hasOne(Petugas::class);
    }

    public function peminjaman()
    {
        return $this->hasMany(Peminjaman::class);
    }

    public function readingProgress()
    {
        return $this->hasMany(ReadingProgress::class);
    }

    // ---- Accessors ----

    public function getRolesListAttribute(): array
    {
        return $this->getRoleNames()->toArray();
    }

    // ---- Scopes ----

    public function scopeAktif($query)
    {
        return $query->where('status', 'aktif');
    }

    public function scopeAnggota($query)
    {
        return $query->role('pengguna');
    }

    // ---- Helpers ----

    public static function generateNoAnggota(): string
    {
        $year  = date('Y');
        $last  = static::where('no_anggota', 'like', "MP{$year}%")->max('no_anggota');
        $seq   = $last ? (int) substr($last, -4) + 1 : 1;
        return sprintf('MP%s%04d', $year, $seq);
    }

    public function getLevelAnggota(): string
    {
        $total = $this->peminjaman()->where('status', 'dikembalikan')->count();
        return match (true) {
            $total >= 100 => 'Platinum',
            $total >= 50  => 'Gold',
            $total >= 20  => 'Silver',
            default       => 'Bronze',
        };
    }

    public function getPoinAnggota(): int
    {
        return $this->peminjaman()->where('status', 'dikembalikan')->count() * 10;
    }
}
