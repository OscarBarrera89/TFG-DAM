<?php

namespace App\Policies;

use App\Models\Reservation;
use App\Models\User;

class ReservationPolicy
{
    public function view(User $user, Reservation $reservation)
    {
        return $user->role === 'admin' || $user->role === 'camarero' || $user->id === $reservation->user_id;
    }

    public function update(User $user, Reservation $reservation)
    {
        return $user->role === 'admin' || $user->role === 'camarero';
    }

    public function delete(User $user, Reservation $reservation)
    {
        return $user->role === 'admin';
    }
}