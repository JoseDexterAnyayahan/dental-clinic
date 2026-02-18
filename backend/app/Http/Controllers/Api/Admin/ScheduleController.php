<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request)
    {
        $query = Schedule::with('dentist');

        if ($request->filled('dentist_id')) {
            $query->where('dentist_id', $request->dentist_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'dentist_id'   => 'required|exists:dentists,id',
            'day_of_week'  => 'required|integer|between:0,6',
            'start_time'   => 'required|date_format:H:i',
            'end_time'     => 'required|date_format:H:i|after:start_time',
            'slot_duration'=> 'required|integer|min:15',
        ]);

        // Prevent duplicate schedule for same dentist + day
        $exists = Schedule::where('dentist_id', $request->dentist_id)
                          ->where('day_of_week', $request->day_of_week)
                          ->exists();

        if ($exists) {
            return response()->json([
                'message' => 'Schedule for this dentist on this day already exists.'
            ], 422);
        }

        $schedule = Schedule::create($request->all());

        return response()->json([
            'message'  => 'Schedule created successfully.',
            'schedule' => $schedule->load('dentist'),
        ], 201);
    }

    public function show(Schedule $schedule)
    {
        return response()->json($schedule->load('dentist'));
    }

    public function update(Request $request, Schedule $schedule)
    {
        $request->validate([
            'start_time'   => 'sometimes|date_format:H:i',
            'end_time'     => 'sometimes|date_format:H:i|after:start_time',
            'slot_duration'=> 'sometimes|integer|min:15',
            'is_active'    => 'sometimes|boolean',
        ]);

        $schedule->update($request->all());

        return response()->json([
            'message'  => 'Schedule updated successfully.',
            'schedule' => $schedule->load('dentist'),
        ]);
    }

    public function destroy(Schedule $schedule)
    {
        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully.'
        ]);
    }
}