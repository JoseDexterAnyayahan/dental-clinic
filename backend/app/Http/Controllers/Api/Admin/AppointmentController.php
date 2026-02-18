<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
        $query = Appointment::with(['client.user', 'dentist', 'service']);

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->whereDate('appointment_date', $request->date);
        }

        if ($request->filled('dentist_id')) {
            $query->where('dentist_id', $request->dentist_id);
        }

        $appointments = $query->orderBy('appointment_date', 'desc')
                              ->orderBy('start_time', 'asc')
                              ->paginate(10);

        return response()->json($appointments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'client_id'        => 'required|exists:clients,id',
            'dentist_id'       => 'required|exists:dentists,id',
            'service_id'       => 'required|exists:services,id',
            'appointment_date' => 'required|date|after_or_equal:today',
            'start_time'       => 'required|date_format:H:i',
            'end_time'         => 'required|date_format:H:i|after:start_time',
            'notes'            => 'nullable|string',
        ]);

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
                'message' => 'This time slot is already taken.'
            ], 422);
        }

        $appointment = Appointment::create($request->all());

        return response()->json([
            'message'     => 'Appointment created successfully.',
            'appointment' => $appointment->load(['client.user', 'dentist', 'service']),
        ], 201);
    }

    public function show(Appointment $appointment)
    {
        return response()->json(
            $appointment->load(['client.user', 'dentist', 'service'])
        );
    }

    public function update(Request $request, Appointment $appointment)
    {
        $request->validate([
            'dentist_id'       => 'sometimes|exists:dentists,id',
            'service_id'       => 'sometimes|exists:services,id',
            'appointment_date' => 'sometimes|date',
            'start_time'       => 'sometimes|date_format:H:i',
            'end_time'         => 'sometimes|date_format:H:i|after:start_time',
            'notes'            => 'nullable|string',
            'admin_notes'      => 'nullable|string',
        ]);

        $appointment->update($request->all());

        return response()->json([
            'message'     => 'Appointment updated successfully.',
            'appointment' => $appointment->load(['client.user', 'dentist', 'service']),
        ]);
    }

    public function destroy(Appointment $appointment)
    {
        $appointment->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully.'
        ]);
    }

    public function updateStatus(Request $request, Appointment $appointment)
    {
        $request->validate([
            'status'       => 'required|in:pending,confirmed,in_progress,completed,cancelled,no_show',
            'admin_notes'  => 'nullable|string',
            'cancel_reason'=> 'nullable|string',
        ]);

        $appointment->update([
            'status'        => $request->status,
            'admin_notes'   => $request->admin_notes,
            'cancelled_by'  => $request->status === 'cancelled' ? 'admin' : null,
            'cancel_reason' => $request->status === 'cancelled' ? $request->cancel_reason : null,
        ]);

        return response()->json([
            'message'     => 'Appointment status updated.',
            'appointment' => $appointment->load(['client.user', 'dentist', 'service']),
        ]);
    }
}