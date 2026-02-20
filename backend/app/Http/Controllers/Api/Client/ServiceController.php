<?php

namespace App\Http\Controllers\Api\Client;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Dentist;
use App\Models\Schedule;
use App\Models\Appointment;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::where('is_active', true)->get();

        return response()->json($services);
    }

    public function dentists(Request $request)
    {
        $request->validate([
            'service_id' => 'required|exists:services,id',
        ]);
    
        $dentists = Dentist::where('is_active', true)
                           ->whereHas('services', function ($query) use ($request) {
                               $query->where('services.id', $request->service_id);
                           })
                           ->with('schedules')
                           ->get();
    
        return response()->json($dentists);
    }

    public function availableSlots(Request $request)
    {
        $request->validate([
            'dentist_id' => 'required|exists:dentists,id',
            'date'       => 'required|date|after_or_equal:today',
        ]);

        $date      = $request->date;
        $dayOfWeek = date('w', strtotime($date)); // 0=Sun, 6=Sat

        // Get dentist schedule for that day
        $schedule = Schedule::where('dentist_id', $request->dentist_id)
                            ->where('day_of_week', $dayOfWeek)
                            ->where('is_active', true)
                            ->first();

        if (! $schedule) {
            return response()->json([
                'message' => 'No schedule available for this day.',
                'slots'   => [],
            ]);
        }

        // Generate all time slots
        $slots     = [];
        $current   = strtotime($schedule->start_time);
        $end       = strtotime($schedule->end_time);
        $duration  = $schedule->slot_duration * 60;

        while ($current + $duration <= $end) {
            $slotStart = date('H:i', $current);
            $slotEnd   = date('H:i', $current + $duration);

            // Check if slot is already booked
            $booked = Appointment::where('dentist_id', $request->dentist_id)
                ->where('appointment_date', $date)
                ->where('status', '!=', 'cancelled')
                ->where('start_time', $slotStart)
                ->exists();

            $slots[] = [
                'start_time' => $slotStart,
                'end_time'   => $slotEnd,
                'available'  => ! $booked,
            ];

            $current += $duration;
        }

        return response()->json([
            'date'     => $date,
            'dentist'  => Dentist::find($request->dentist_id),
            'schedule' => $schedule,
            'slots'    => $slots,
        ]);
    }

    
}