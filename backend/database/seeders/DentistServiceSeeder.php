<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dentist;
use App\Models\Service;

class DentistServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Map specializations to service types
        $mappings = [
            'General Dentistry' => ['General Checkup', 'Dental Cleaning', 'Dental Filling'],
            'Orthodontics'      => ['Orthodontics'],
            'Cosmetic Dentistry'=> ['Teeth Whitening'],
            'Oral Surgery'      => ['Tooth Extraction', 'Root Canal'],
            'Pediatric Dentistry' => ['General Checkup', 'Dental Cleaning', 'Dental Filling'],
            'Endodontics'       => ['Root Canal', 'Dental Filling'],
        ];

        foreach (Dentist::all() as $dentist) {
            $serviceNames = $mappings[$dentist->specialization] ?? ['General Checkup'];
            
            $services = Service::whereIn('name', $serviceNames)->pluck('id');
            
            $dentist->services()->attach($services);
        }
    }
}