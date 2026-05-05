<?php

namespace App\Notifications;

use App\Models\Peminjaman;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;

class PengembalianDikonfirmasi extends Notification
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
            'type' => 'pengembalian_dikonfirmasi',
            'peminjaman_id' => $this->peminjaman->id,
            'kode' => $this->peminjaman->kode_peminjaman,
            'message' => "Pengembalian untuk kode {$this->peminjaman->kode_peminjaman} telah dikonfirmasi.",
        ];
    }

    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage($this->toDatabase($notifiable));
    }
}
