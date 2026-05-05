<?php

namespace App\Notifications;

use App\Models\Peminjaman;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\DatabaseMessage;

class PengembalianDiajukan extends Notification
{
    use Queueable;

    protected $peminjaman;

    public function __construct(Peminjaman $peminjaman)
    {
        $this->peminjaman = $peminjaman;
    }

    public function via($notifiable)
    {
        return ['database', 'broadcast'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'type' => 'pengembalian_diajukan',
            'peminjaman_id' => $this->peminjaman->id,
            'kode' => $this->peminjaman->kode_peminjaman,
            'user_id' => $this->peminjaman->user_id,
            'message' => "Pengguna {$this->peminjaman->user->name} mengajukan pengembalian untuk kode {$this->peminjaman->kode_peminjaman}",
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toDatabase($notifiable));
    }
}
