<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        if (! $user) return response()->json([], 401);

        $notifs = $user->unreadNotifications()->latest()->take(20)->get()->map(function ($n) {
            return [
                'id' => $n->id,
                'type' => $n->data['type'] ?? null,
                'message' => $n->data['message'] ?? null,
                'peminjaman_id' => $n->data['peminjaman_id'] ?? null,
                'created_at' => $n->created_at,
            ];
        });

        return response()->json($notifs);
    }

    public function markRead(Request $request, $id)
    {
        $user = $request->user();
        if (! $user) return response()->json([], 401);

        $notif = $user->unreadNotifications()->where('id', $id)->first();
        if ($notif) {
            $notif->markAsRead();
            return response()->json(['ok' => true]);
        }

        return response()->json(['ok' => false], 404);
    }
}
