<?php

namespace Database\Seeders;

use App\Models\Chat;
use App\Models\User;
use App\Models\Message;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        collect([
            [
                'name' => 'Farid Rizky Wijaya',
                'username' => 'far',
                'email' => 'far@far.test',
                'password' => bcrypt('password')
            ],
            [
                'name' => 'Iqbal Rizky Wijaya',
                'username' => 'iqbal',
                'email' => 'iq@iq.test',
                'password' => bcrypt('password')
            ]
        ])->each(fn($user) => User::create($user));
        User::factory(10)->create();
        $this->call(ChatSeeder::class);
    }
}
