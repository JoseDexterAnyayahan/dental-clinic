<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\Client;
use App\Models\Dentist;
use App\Models\Service;
use Carbon\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run(): void
    {
        $clients  = Client::all();
        $dentists = Dentist::where('is_active', true)->get();
        $services = Service::where('is_active', true)->get();

        if ($clients->isEmpty() || $dentists->isEmpty() || $services->isEmpty()) {
            $this->command->warn('Skipping AppointmentSeeder: missing clients, dentists, or services.');
            return;
        }

        $statuses = ['pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

        $timeSlots = [
            ['start' => '08:00', 'end' => '08:30'],
            ['start' => '08:30', 'end' => '09:00'],
            ['start' => '09:00', 'end' => '09:30'],
            ['start' => '09:30', 'end' => '10:00'],
            ['start' => '10:00', 'end' => '10:30'],
            ['start' => '10:30', 'end' => '11:00'],
            ['start' => '11:00', 'end' => '11:30'],
            ['start' => '13:00', 'end' => '13:30'],
            ['start' => '13:30', 'end' => '14:00'],
            ['start' => '14:00', 'end' => '14:30'],
            ['start' => '14:30', 'end' => '15:00'],
            ['start' => '15:00', 'end' => '15:30'],
            ['start' => '15:30', 'end' => '16:00'],
            ['start' => '16:00', 'end' => '16:30'],
        ];

        $counter = 1;

        // Past appointments (last 60 days) — mostly completed/cancelled
        for ($i = 0; $i < 40; $i++) {
            $date    = Carbon::today()->subDays(rand(1, 60));
            $slot    = $timeSlots[array_rand($timeSlots)];
            $client  = $clients->random();
            $dentist = $dentists->random();
            $service = $services->random();
            $status  = collect(['completed', 'completed', 'completed', 'cancelled', 'no_show'])->random();

            Appointment::create([
                'appointment_no'  => 'APT-' . str_pad($counter++, 5, '0', STR_PAD_LEFT),
                'client_id'       => $client->id,
                'dentist_id'      => $dentist->id,
                'service_id'      => $service->id,
                'appointment_date'=> $date->toDateString(),
                'start_time'      => $slot['start'],
                'end_time'        => $slot['end'],
                'status'          => $status,
                'notes'           => rand(0, 1) ? $this->randomNote() : null,
                'cancel_reason'   => $status === 'cancelled' ? $this->randomCancelReason() : null,
                'cancelled_by'    => $status === 'cancelled' ? (rand(0, 1) ? 'client' : 'admin') : null,
            ]);
        }

        // Today's appointments — mix of statuses
        $todaySlots = collect($timeSlots)->shuffle()->take(6);
        $todayStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'pending', 'confirmed'];
        foreach ($todaySlots as $idx => $slot) {
            $client  = $clients->random();
            $dentist = $dentists->random();
            $service = $services->random();

            Appointment::create([
                'appointment_no'  => 'APT-' . str_pad($counter++, 5, '0', STR_PAD_LEFT),
                'client_id'       => $client->id,
                'dentist_id'      => $dentist->id,
                'service_id'      => $service->id,
                'appointment_date'=> Carbon::today()->toDateString(),
                'start_time'      => $slot['start'],
                'end_time'        => $slot['end'],
                'status'          => $todayStatuses[$idx] ?? 'pending',
                'notes'           => rand(0, 1) ? $this->randomNote() : null,
            ]);
        }

        // Upcoming appointments (next 30 days) — pending/confirmed
        for ($i = 0; $i < 20; $i++) {
            $date    = Carbon::today()->addDays(rand(1, 30));
            $slot    = $timeSlots[array_rand($timeSlots)];
            $client  = $clients->random();
            $dentist = $dentists->random();
            $service = $services->random();
            $status  = collect(['pending', 'pending', 'confirmed', 'confirmed'])->random();

            Appointment::create([
                'appointment_no'  => 'APT-' . str_pad($counter++, 5, '0', STR_PAD_LEFT),
                'client_id'       => $client->id,
                'dentist_id'      => $dentist->id,
                'service_id'      => $service->id,
                'appointment_date'=> $date->toDateString(),
                'start_time'      => $slot['start'],
                'end_time'        => $slot['end'],
                'status'          => $status,
                'notes'           => rand(0, 1) ? $this->randomNote() : null,
            ]);
        }

        $this->command->info("Seeded {$counter} appointments.");
    }

    private function randomNote(): string
    {
        return collect([
            'Patient requested morning slot.',
            'First time patient, needs extra time.',
            'Follow-up from previous extraction.',
            'Patient has dental anxiety.',
            'Bring previous X-ray records.',
            'Requested Dr. preference.',
            'Insurance pre-approval needed.',
            'Emergency consultation.',
        ])->random();
    }

    private function randomCancelReason(): string
    {
        return collect([
            'Patient had an emergency.',
            'Schedule conflict.',
            'Feeling unwell.',
            'Rescheduled to a later date.',
            'No reason provided.',
        ])->random();
    }
}