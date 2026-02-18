<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Dentist;

class DentistSeeder extends Seeder
{
    public function run(): void
    {
        $dentists = [
            [
                'first_name'     => 'Maria',
                'last_name'      => 'Santos',
                'email'          => 'maria.santos@dentacare.com',
                'phone'          => '09171234567',
                'specialization' => 'General Dentistry',
                'bio'            => 'Dr. Santos has over 10 years of experience in general dentistry, specializing in preventive care and patient education.',
                'is_active'      => true,
            ],
            [
                'first_name'     => 'Jose',
                'last_name'      => 'Reyes',
                'email'          => 'jose.reyes@dentacare.com',
                'phone'          => '09182345678',
                'specialization' => 'Orthodontics',
                'bio'            => 'Dr. Reyes is a certified orthodontist with expertise in braces, aligners, and jaw correction treatments.',
                'is_active'      => true,
            ],
            [
                'first_name'     => 'Ana',
                'last_name'      => 'Cruz',
                'email'          => 'ana.cruz@dentacare.com',
                'phone'          => '09193456789',
                'specialization' => 'Cosmetic Dentistry',
                'bio'            => 'Dr. Cruz specializes in smile makeovers, teeth whitening, veneers, and other aesthetic dental procedures.',
                'is_active'      => true,
            ],
            [
                'first_name'     => 'Carlos',
                'last_name'      => 'Mendoza',
                'email'          => 'carlos.mendoza@dentacare.com',
                'phone'          => '09204567890',
                'specialization' => 'Oral Surgery',
                'bio'            => 'Dr. Mendoza is an experienced oral surgeon handling tooth extractions, implants, and complex surgical procedures.',
                'is_active'      => true,
            ],
            [
                'first_name'     => 'Liza',
                'last_name'      => 'Villanueva',
                'email'          => 'liza.villanueva@dentacare.com',
                'phone'          => '09215678901',
                'specialization' => 'Pediatric Dentistry',
                'bio'            => 'Dr. Villanueva is passionate about children\'s oral health, creating a comfortable and fun dental experience for young patients.',
                'is_active'      => true,
            ],
            [
                'first_name'     => 'Ramon',
                'last_name'      => 'Flores',
                'email'          => 'ramon.flores@dentacare.com',
                'phone'          => '09226789012',
                'specialization' => 'Endodontics',
                'bio'            => 'Dr. Flores specializes in root canal treatments and diseases of the dental pulp with a gentle, pain-free approach.',
                'is_active'      => true,
            ],
        ];

        foreach ($dentists as $dentist) {
            Dentist::create($dentist);
        }
    }
}