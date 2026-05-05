<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class KartuController extends Controller
{
    /**
     * Download kartu (anggota / petugas / admin) as PDF.
     */
    public function download(User $user)
    {
        $me = auth()->user();

        // allow self download, or staff/admin to download other users
        if ($me->id !== $user->id && ! $me->hasAnyRole(['petugas', 'admin'])) {
            abort(403);
        }

        $settings = Setting::allAsArray();

        // Choose template based on role
        if ($user->hasRole('admin')) {
            $view = 'kartu.card_admin';
            $filename = 'kartu-admin-' . strtolower(preg_replace('/[^a-z0-9]+/i', '-', $user->name)) . '.pdf';
        } elseif ($user->hasRole('petugas')) {
            $view = 'kartu.card_petugas';
            $filename = 'kartu-petugas-' . strtolower(preg_replace('/[^a-z0-9]+/i', '-', $user->name)) . '.pdf';
        } else {
            $view = 'kartu.card_member';
            $filename = 'kartu-anggota-' . strtolower(preg_replace('/[^a-z0-9]+/i', '-', $user->name)) . '.pdf';
        }

        $pdf = Pdf::loadView($view, [
            'user' => $user,
            'settings' => $settings,
        ])->setPaper('a6', 'portrait');

        return $pdf->download($filename);
    }
}
