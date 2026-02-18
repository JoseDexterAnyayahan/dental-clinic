<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Client;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $client = $request->user()->client;

        $query = Appointment::with(['dentist', 'service'])
                            ->where('client_id', $client->id);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
                              ->orderBy('start_time', 'asc')
                              ->paginate(10);

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'dentist_id'       => 'required|exists:dentists,id',
            'service_id'       => 'required|exists:services,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time'       => 'required|date_format:H:i',
            'end_time'         => 'required|date_format:H:i|after:start_time',
            'notes'            => 'nullable|string',
        ]);

        $client = $request->user()->client;

        // Check for conflicts
        $conflict = Appointment::where('dentist_id', $request->dentist_id)
            ->where('appointment_date', $request->appointment_date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
            })->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This time slot is already taken. Please choose another.'
            ], 422);
        }

        // Check if client already has appointment on same date and time
        $clientConflict = Appointment::where('client_id', $client->id)
            ->where('appointment_date', $request->appointment_date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time]);
            })->exists();

        if ($clientConflict) {
            return response()->json([
                'message' => 'You already have an appointment at this time.'
            ], 422);
        }

        $appointment = Appointment::create([
            ...$request->all(),
            'client_id' => $client->id,
            'status'    => 'pending',
        ]);

        return response()->json([
            'message'     => 'Appointment booked successfully.',
            'appointment' => $appointment->load(['dentist', 'service']),
        ], 201);
    }

    public function show(Request $request, Appointment $appointment)
    {
        $client = $request->user()->client;

        // Make sure client can only view their own appointments
        if ($appointment->client_id !== $client->id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        return response()->json(
            $appointment->load(['dentist', 'service'])
        );
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $client = $request->user()->client;

        if ($appointment->client_id !== $client->id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        if (! in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'This appointment cannot be cancelled.'
            ], 422);
        }

        $request->validate([
            'cancel_reason' => 'nullable|string',
        ]);

        $appointment->update([
            'status'        => 'cancelled',
            'cancelled_by'  => 'client',
            'cancel_reason' => $request->cancel_reason,
        ]);

        return response()->json([
            'message'     => 'Appointment cancelled successfully.',
            'appointment' => $appointment->load(['dentist', 'service']),
        ]);
    }
}