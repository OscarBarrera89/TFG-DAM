@component('mail::message')
# Reserva Confirmada

Hola {{ $reservation->user->name }},

Tu reserva para la mesa {{ $reservation->table_id }} ha sido confirmada.

**Fecha:** {{ $reservation->date }}  
**Hora:** {{ $reservation->time }}  
**Personas:** {{ $reservation->people }}

Gracias por confiar en nosotros.

@endcomponent
