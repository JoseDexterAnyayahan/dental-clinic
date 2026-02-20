<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            AdminSeeder::class,
            ServiceSeeder::class,
            DentistSeeder::class,
            ScheduleSeeder::class,
            DentistServiceSeeder::class,
            AppointmentSeeder::class,
        ]);
    }
}