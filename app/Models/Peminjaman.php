<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Peminjaman extends Model
{
    protected $table = 'peminjaman';

    protected $fillable = [
        'user_id', 'buku_id', 'petugas_id',
        'kode_peminjaman',
        'tanggal_pinjam', 'tanggal_kembali_rencana',
        'tanggal_kembali_aktual',
        'status', 'catatan', 'denda',
        'kondisi_buku_saat_serah', 'bukti_penyerahan',
    ];

    protected $casts = [
        'tanggal_pinjam'          => 'datetime',
        'tanggal_kembali_rencana' => 'datetime',
        'tanggal_kembali_aktual'  => 'datetime',
        'denda'                   => 'integer',
    ];

    protected $appends = [
        'denda_berjalan',
    ];

    const STATUS_MENUNGGU     = 'menunggu';
    const STATUS_DISETUJUI    = 'disetujui';
    const STATUS_DIPINJAM     = 'dipinjam';
    const STATUS_PENGAJUAN_KEMBALI = 'pengajuan_kembali';
    const STATUS_DIKEMBALIKAN = 'dikembalikan';
    const STATUS_TERLAMBAT    = 'terlambat';
    const STATUS_DITOLAK      = 'ditolak';

    const DURASI_PINJAM_DEFAULT = 14; // hari
    const DENDA_PER_HARI        = 1000; // Rp 1.000/hari

    // ---- Relationships ----

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function buku()
    {
        return $this->belongsTo(Buku::class);
    }

    public function petugas()
    {
        return $this->belongsTo(User::class, 'petugas_id');
    }

    // ---- Scopes ----

    public function scopeAktif($query)
    {
        return $query->whereIn('status', [self::STATUS_DISETUJUI, self::STATUS_DIPINJAM, self::STATUS_TERLAMBAT, self::STATUS_PENGAJUAN_KEMBALI]);
    }

    public function scopeMenunggu($query)
    {
        return $query->where('status', self::STATUS_MENUNGGU);
    }

    public function scopeTerlambat($query)
    {
        return $query->where('status', self::STATUS_TERLAMBAT)
                     ->orWhere(function ($q) {
                         $q->where('status', self::STATUS_DIPINJAM)
                           ->where('tanggal_kembali_rencana', '<', now());
                     });
    }

    public function scopeAkanKembali($query, int $hari = 3)
    {
        return $query->where('status', self::STATUS_DIPINJAM)
                     ->whereBetween('tanggal_kembali_rencana', [now(), now()->addDays($hari)]);
    }

    // ---- Helpers ----

    public static function generateKode(): string
    {
        do {
            $kode = 'PJM' . strtoupper(substr(uniqid(), -6));
        } while (static::where('kode_peminjaman', $kode)->exists());
        return $kode;
    }

    public function hitungDenda(): int
    {
        $isLateWindow = $this->tanggal_kembali_rencana
            && $this->tanggal_kembali_rencana->lt(now());

        if (!in_array($this->status, [self::STATUS_DIPINJAM, self::STATUS_TERLAMBAT, self::STATUS_DIKEMBALIKAN]) || !$isLateWindow) {
            return 0;
        }

        $tglKembali = $this->tanggal_kembali_aktual ?? now();
        $hari = max(
            0,
            \Carbon\Carbon::parse($this->tanggal_kembali_rencana)
                ->diffInDays(\Carbon\Carbon::parse($tglKembali), false)
        );

        return $hari * self::DENDA_PER_HARI;
    }

    public function cekDanUpdateTerlambat(): void
    {
        if ($this->status === self::STATUS_DIPINJAM &&
            $this->tanggal_kembali_rencana->isPast()) {
            $this->update([
                'status' => self::STATUS_TERLAMBAT,
                'denda'  => $this->hitungDenda(),
            ]);
        }
    }

    public function getDendaBerjalanAttribute(): int
    {
        return $this->hitungDenda();
    }

    public static function sinkronkanStatusDanDenda(): void
    {
        static::where('status', self::STATUS_DIPINJAM)
            ->where('tanggal_kembali_rencana', '<', now())
            ->chunkById(100, function ($items) {
                foreach ($items as $item) {
                    $item->update([
                        'status' => self::STATUS_TERLAMBAT,
                        'denda' => $item->hitungDenda(),
                    ]);
                }
            });

        static::where('status', self::STATUS_TERLAMBAT)
            ->chunkById(100, function ($items) {
                foreach ($items as $item) {
                    $item->update([
                        'denda' => $item->hitungDenda(),
                    ]);
                }
            });
    }
}
