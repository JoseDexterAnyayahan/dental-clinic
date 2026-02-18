<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name'         => 'General Checkup',
                'slug'         => 'general-checkup',
                'description'  => 'Routine dental examination and cleaning.',
                'duration_mins'=> 30,
                'price'        => 500.00,
                'icon'         => 'stethoscope',
                'is_active'    => true,
            ],
            [
                'name'         => 'Tooth Extraction',
                'slug'         => 'tooth-extraction',
                'description'  => 'Safe and painless tooth removal procedure.',
                'duration_mins'=> 45,
                'price'        => 800.00,
                'icon'         => 'tooth',
                'is_active'    => true,
            ],
            [
                'name'         => 'Dental Cleaning',
                'slug'         => 'dental-cleaning',
                'description'  => 'Professional teeth cleaning and polishing.',
                'duration_mins'=> 60,
                'price'        => 1000.00,
                'icon'         => 'sparkles',
                'is_active'    => true,
            ],
            [
                'name'         => 'Teeth Whitening',
                'slug'         => 'teeth-whitening',
                'description'  => 'Professional whitening for a brighter smile.',
                'duration_mins'=> 90,
                'price'        => 3500.00,
                'icon'         => 'sun',
                'is_active'    => true,
            ],
            [
                'name'         => 'Dental Filling',
                'slug'         => 'dental-filling',
                'description'  => 'Composite or amalgam filling for cavities.',
                'duration_mins'=> 45,
                'price'        => 1200.00,
                'icon'         => 'shield',
                'is_active'    => true,
            ],
            [
                'name'         => 'Root Canal',
                'slug'         => 'root-canal',
                'description'  => 'Treatment for infected or damaged tooth pulp.',
                'duration_mins'=> 120,
                'price'        => 5000.00,
                'icon'         => 'activity',
                'is_active'    => true,
            ],
            [
                'name'         => 'Orthodontics',
                'slug'         => 'orthodontics',
                'description'  => 'Braces and aligners for teeth straightening.',
                'duration_mins'=> 60,
                'price'        => 8000.00,
                'icon'         => 'align-center',
                'is_active'    => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}