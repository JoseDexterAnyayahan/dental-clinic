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
        $user = $request->user();
    
        if (!$user->client) {
            return response()->json(['message' => 'Client profile not found.'], 404);
        }
    
        $client = $user->client;
    
        $query = Appointment::with(['dentist', 'service'])
                            ->where('client_id', $client->id);
    
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
    
        $perPage = $request->input('per_page', 10);
    
        $appointments = $query->orderBy('appointment_date', 'desc')
                              ->orderBy('start_time', 'asc')
                              ->paginate($perPage);
    
        return response()->json($appointments);
    }
    
    public function stats(Request $request)
    {
        $user = $request->user();
    
        if (!$user->client) {
            return response()->json(['message' => 'Client profile not found.'], 404);
        }
    
        $clientId = $user->client->id;
        $now      = now()->toDateString();
    
        return response()->json([
            'total'     => Appointment::where('client_id', $clientId)->count(),
            'upcoming'  => Appointment::where('client_id', $clientId)
                            ->whereDate('appointment_date', '>=', $now)
                            ->whereNotIn('status', ['cancelled', 'completed'])
                            ->count(),
            'completed' => Appointment::where('client_id', $clientId)
                            ->where('status', 'completed')
                            ->count(),
            'pending'   => Appointment::where('client_id', $clientId)
                            ->where('status', 'pending')
                            ->count(),
        ]);
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

        $user = $request->user();

        if (!$user->client) {
            return response()->json([
                'message' => 'Client profile not found. Please log out and register again.',
            ], 404);
        }

        $client = $user->client;

        // Check for dentist conflicts
        $conflict = Appointment::where('dentist_id', $request->dentist_id)
            ->where('appointment_date', $request->appointment_date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('start_time', '<=', $request->start_time)
                        ->where('end_time', '>=', $request->end_time);
                  });
            })->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'This time slot is already taken. Please choose another.'
            ], 422);
        }

        // Check if client already has appointment at this time
        $clientConflict = Appointment::where('client_id', $client->id)
            ->where('appointment_date', $request->appointment_date)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($request) {
                $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                  ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                  ->orWhere(function ($q) use ($request) {
                      $q->where('start_time', '<=', $request->start_time)
                        ->where('end_time', '>=', $request->end_time);
                  });
            })->exists();

        if ($clientConflict) {
            return response()->json([
                'message' => 'You already have an appointment at this time.'
            ], 422);
        }

        $appointment = Appointment::create([
            'client_id'        => $client->id,
            'dentist_id'       => $request->dentist_id,
            'service_id'       => $request->service_id,
            'appointment_date' => $request->appointment_date,
            'start_time'       => $request->start_time,
            'end_time'         => $request->end_time,
            'notes'            => $request->notes,
            'status'           => 'pending',
        ]);

        return response()->json([
            'message'     => 'Appointment booked successfully.',
            'appointment' => $appointment->load(['dentist', 'service']),
        ], 201);
    }

    public function show(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if (!$user->client) {
            return response()->json(['message' => 'Client profile not found.'], 404);
        }

        $client = $user->client;

        if ($appointment->client_id !== $client->id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        return response()->json(
            $appointment->load(['dentist', 'service'])
        );
    }

    public function update(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if (!$user->client) {
            return response()->json(['message' => 'Client profile not found.'], 404);
        }

        $client = $user->client;

        // Make sure client owns this appointment
        if ($appointment->client_id !== $client->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        // Only allow editing pending or confirmed appointments
        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
            return response()->json([
                'message' => 'This appointment cannot be edited.'
            ], 422);
        }

        // Cannot edit if appointment date is today or past
        if ($appointment->appointment_date <= now()->toDateString()) {
            return response()->json([
                'message' => 'Cannot edit appointments on or after the appointment date.'
            ], 422);
        }

        $request->validate([
            'dentist_id'       => 'sometimes|exists:dentists,id',
            'service_id'       => 'sometimes|exists:services,id',
            'appointment_date' => 'sometimes|date|after:today',
            'start_time'       => 'sometimes|date_format:H:i',
            'end_time'         => 'sometimes|date_format:H:i|after:start_time',
            'notes'            => 'nullable|string',
        ]);

        // Check for conflicts if date/time changed
        if ($request->filled('appointment_date') && $request->filled('start_time') && $request->filled('end_time')) {
            $dentistId = $request->dentist_id ?? $appointment->dentist_id;

            $conflict = Appointment::where('dentist_id', $dentistId)
                ->where('id', '!=', $appointment->id)
                ->where('appointment_date', $request->appointment_date)
                ->where('status', '!=', 'cancelled')
                ->where(function ($q) use ($request) {
                    $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
                })->exists();

            if ($conflict) {
                return response()->json([
                    'message' => 'This time slot is already taken.'
                ], 422);
            }

            // Check client conflicts
            $clientConflict = Appointment::where('client_id', $client->id)
                ->where('id', '!=', $appointment->id)
                ->where('appointment_date', $request->appointment_date)
                ->where('status', '!=', 'cancelled')
                ->where(function ($q) use ($request) {
                    $q->whereBetween('start_time', [$request->start_time, $request->end_time])
                      ->orWhereBetween('end_time', [$request->start_time, $request->end_time])
                      ->orWhere(function ($q) use ($request) {
                          $q->where('start_time', '<=', $request->start_time)
                            ->where('end_time', '>=', $request->end_time);
                      });
                })->exists();

            if ($clientConflict) {
                return response()->json([
                    'message' => 'You already have another appointment at this time.'
                ], 422);
            }
        }

        $appointment->update($request->only([
            'dentist_id', 'service_id', 'appointment_date',
            'start_time', 'end_time', 'notes'
        ]));

        return response()->json([
            'message' => 'Appointment updated successfully.',
            'appointment' => $appointment->load(['dentist', 'service']),
        ]);
    }

    public function cancel(Request $request, Appointment $appointment)
    {
        $user = $request->user();

        if (!$user->client) {
            return response()->json(['message' => 'Client profile not found.'], 404);
        }

        $client = $user->client;

        if ($appointment->client_id !== $client->id) {
            return response()->json([
                'message' => 'Unauthorized.'
            ], 403);
        }

        if (!in_array($appointment->status, ['pending', 'confirmed'])) {
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