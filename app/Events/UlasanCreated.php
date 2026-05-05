<?php

namespace App\Events;

use App\Models\Ulasan;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\ShouldBroadcastNow;

class UlasanCreated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Ulasan $ulasan;

    public function __construct(Ulasan $ulasan)
    {
        $this->ulasan = $ulasan;
    }

    public function broadcastOn()
    {
        return new Channel('buku.' . $this->ulasan->buku_id);
    }

    public function broadcastWith()
    {
        return ['ulasan' => $this->ulasan->load('user')->toArray()];
    }

    public function broadcastAs()
    {
        return 'UlasanCreated';
    }
}
