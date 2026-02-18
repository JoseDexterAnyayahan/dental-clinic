<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Admin;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::create([
            'name'     => 'Clinic Admin',
            'email'    => 'admin@dentalclinic.com',
            'password' => Hash::make('admin123'),
            'role'     => 'admin',
            'is_active'=> true,
        ]);

        Admin::create([
            'user_id'  => $user->id,
            'phone'    => '09123456789',
            'position' => 'Clinic Administrator',
        ]);
    }
}