<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Department;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $mainDepartments = [
            ['name' => 'Manufacturing Engineering', 'zone' => 'Administration'],
            ['name' => 'Production', 'zone' => 'Assemblage'],
            ['name' => 'Logistics', 'zone' => 'Warehouse'],
            ['name' => 'Finance', 'zone' => 'Administration'],
            ['name' => 'QHSE', 'zone' => 'Administration'],
            ['name' => 'HR', 'zone' => 'Administration'],
            ['name' => 'Facilities', 'zone' => 'Administration'],
            ['name' => 'R&D', 'zone' => 'Administration'],
            ['name' => 'Maintenance', 'zone' => 'Assemblage'],
        ];

        foreach ($mainDepartments as $dept) {
            Department::firstOrCreate(
                ['name' => $dept['name']],
                ['zone' => $dept['zone']]
            );
        }
    }
}
