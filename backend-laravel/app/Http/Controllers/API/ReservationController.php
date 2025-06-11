<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmed;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user->role === 'admin' || $user->role === 'waiter') {
            return Reservation::with(['user', 'table'])->get();
        }
        return $user->reservations()->with('table')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'date' => 'required|date',
            'time' => 'required',
            'people' => 'required|integer|min:1',
        ]);

        $reservation = auth()->user()->reservations()->create($validated);

        try {
            Mail::to(auth()->user()->email)->send(new ReservationConfirmed($reservation));
        } catch (\Exception $e) {
            Log::error('Error enviando email: '.$e->getMessage());
        }

        return response()->json($reservation, 201);
    }

    public function show(Reservation $reservation)
    {
        $user = Auth::user();
    
        if (!$user) {
            return response()->json(['message' => 'Usuario no autenticado'], 401);
        }

        $reservations = Reservation::where('user_id', $user->id)
            ->with(['user', 'table'])
            ->get();

        return response()->json($reservations);
    }

    public function edit(Request $request, Reservation $reservation)
    {

        $validated = $request->validate([
            'table_id' => 'sometimes|exists:tables,id',
            'date' => 'sometimes|date',
            'time' => 'sometimes',
            'people' => 'sometimes|integer|min:1',
        ]);

        $reservation->update($validated);

        return response()->json([
            'message' => 'Reserva actualizada exitosamente',
            'reservation' => $reservation->load(['user', 'table'])
        ]);
    }

    public function cancel(Request $request, Reservation $reservation)
    {

        if ($reservation->status !== 'pending') {
            return response()->json(['message' => 'Solo se pueden cancelar reservas pendientes'], 400);
        }

        $reservation->update(['status' => 'cancelled']);

        return response()->json([
            'message' => 'Reserva cancelada exitosamente',
            'reservation' => $reservation->load(['user', 'table'])
        ]);
    }

    public function confirm(Request $request, Reservation $reservation)
    {
        $user = Auth::user();

        if (!$user || !in_array($user->role, ['admin', 'waiter'])) {
            return response()->json(['message' => 'No autorizado para confirmar reservas'], 403);
        }

        if ($reservation->status !== 'pending') {
            return response()->json(['message' => 'Solo se pueden confirmar reservas pendientes'], 400);
        }

        $reservation->update(['status' => 'confirmed']);

        return response()->json([
            'message' => 'Reserva confirmada exitosamente',
            'reservation' => $reservation->load(['user', 'table'])
        ]);
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'table_id' => 'required|exists:tables,id',
            'date' => 'required|date',
            'time' => 'required',
            'people' => 'required|integer|min:1',
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $reservation->update($validated);
        return $reservation;
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['message' => 'Reservation deleted']);
    }

    public function checkConflict(Request $request)
    {
        $validated = $request->validate([
            'table_id' => 'required|integer|exists:tables,id',
            'date' => 'required|date',
            'time' => 'required|string',
        ]);

        $exists = Reservation::where('table_id', $validated['table_id'])
            ->where('date', $validated['date'])
            ->where('time', $validated['time'])
            ->exists();

        return response()->json(['exists' => $exists]);
    }
}