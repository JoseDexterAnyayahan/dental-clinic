<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dentist;
use App\Models\Schedule;

class ScheduleSeeder extends Seeder
{
    public function run(): void
    {
        $dentists = Dentist::all();

        foreach ($dentists as $dentist) {
            // Monday to Friday: 9:00 AM - 5:00 PM
            for ($day = 1; $day <= 5; $day++) {
                Schedule::create([
                    'dentist_id'    => $dentist->id,
                    'day_of_week'   => $day, // 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri
                    'start_time'    => '09:00',
                    'end_time'      => '17:00',
                    'slot_duration' => 30, // 30-minute slots
                    'is_active'     => true,
                ]);
            }

            // Saturday: 9:00 AM - 1:00 PM (shorter hours)
            Schedule::create([
                'dentist_id'    => $dentist->id,
                'day_of_week'   => 6, // Saturday
                'start_time'    => '09:00',
                'end_time'      => '13:00',
                'slot_duration' => 30,
                'is_active'     => true,
            ]);

            // Sunday: No schedule (day off)
        }
    }
}