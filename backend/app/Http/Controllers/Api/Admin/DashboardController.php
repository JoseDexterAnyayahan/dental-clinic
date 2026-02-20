<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Dentist;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
    
        return response()->json([
            'total_appointments_today' => Appointment::whereDate('appointment_date', $today)->count(),
            'pending_appointments'     => Appointment::where('status', 'pending')->count(),
            'confirmed_appointments'   => Appointment::where('status', 'confirmed')->count(),
            'completed_today'          => Appointment::whereDate('appointment_date', $today)
                                            ->where('status', 'completed')->count(),
            'total_clients'            => Client::count(),
            'total_dentists'           => Dentist::where('is_active', true)->count(),
            'recent_appointments'      => Appointment::with(['client.user', 'dentist', 'service'])
                                            ->latest()
                                            ->take(5)
                                            ->get(),
        ]);
    }
}