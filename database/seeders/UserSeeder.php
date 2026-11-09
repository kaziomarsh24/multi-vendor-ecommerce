<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password');

        $users = [
            [
                'name' => 'Kazi Omar Faruk',
                'email' => 'admin@csn.com',
                'phone' => '+8801704039173',
                'role' => UserRole::ADMIN,
                'status' => UserStatus::ACTIVE,
            ],
            [
                'name' => 'Tanvir Ahmed',
                'email' => 'owner1@csn.com',
                'phone' => '+8801712345678',
                'role' => UserRole::SHOP_OWNER,
                'status' => UserStatus::ACTIVE,
            ],
            [
                'name' => 'Nusrat Jahan',
                'email' => 'owner2@csn.com',
                'phone' => '+8801819876543',
                'role' => UserRole::SHOP_OWNER,
                'status' => UserStatus::ACTIVE,
            ],
            [
                'name' => 'Ashraful Alam',
                'email' => 'owner3@csn.com',
                'phone' => '+8801911223344',
                'role' => UserRole::SHOP_OWNER,
                'status' => UserStatus::ACTIVE,
            ],
            [
                'name' => 'Rahim Uddin',
                'email' => 'customer@csn.com',
                'phone' => '+8801755112233',
                'role' => UserRole::CUSTOMER,
                'status' => UserStatus::ACTIVE,
            ],
            [
                'name' => 'Sadia Islam',
                'email' => 'sadia@gmail.com',
                'phone' => '+8801822334455',
                'role' => UserRole::CUSTOMER,
                'status' => UserStatus::ACTIVE,
            ],
        ];

        foreach ($users as $user) {
            User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'phone' => $user['phone'],
                    'role' => $user['role'],
                    'status' => $user['status'],
                    'password' => $password,
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
