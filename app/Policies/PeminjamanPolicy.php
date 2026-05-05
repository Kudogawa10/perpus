<?php

namespace App\Policies;

use App\Models\Peminjaman;
use App\Models\User;

class PeminjamanPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Peminjaman $peminjaman): bool
    {
        return $user->id === $peminjaman->user_id || $user->hasAnyRole(['admin', 'petugas']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Peminjaman $peminjaman): bool
    {
        // Owners can update their peminjaman (e.g., ajukan pengembalian).
        // Staff (petugas/admin) may also update records.
        return $user->id === $peminjaman->user_id || $user->hasAnyRole(['admin', 'petugas']);
    }

    /**
     * Determine whether the user can delete (cancel) the model.
     */
    public function delete(User $user, Peminjaman $peminjaman): bool
    {
        return $user->id === $peminjaman->user_id;
    }
}

