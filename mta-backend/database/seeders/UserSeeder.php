<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Department;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $hrDept = Department::where('name', 'Administration')->first();

        // 1. Admin accounts
        User::firstOrCreate(
            ['email' => 'admin@mta.ma'],
            [
                'first_name' => 'MTA',
                'last_name' => 'Admin',
                'password' => Hash::make('Admin@2026'),
                'position' => 'Responsable Intégration',
                'department_id' => $hrDept ? $hrDept->id : 1,
                'onboarding_step' => 0,
                'role' => 'admin'
            ]
        );

        // 2. Direct data (linked to departments)
        $employeeData = [
            "Board of Directors" => ["Falchetti Andrea", "Falchetti Antonio"],
            "Plant Manager" => ["El Qabli Bouali"],
            "Program Management" => ["Zouine Meryem"],
            "Quality System & HSE" => ["Talmani Doha"],
            "Finance & Accounting" => ["Lechhab Bouchra"],
            "Human Resources" => ["Lechhab Bouchra"],
            "Accounting" => ["Zouaida Adil", "Benzouita Nargiss", "Elaasri Ahmed", "Talqi Mohamed"],
            "Personnel Administration" => ["El Rhazouani Tarik", "El Hirech Sanaa", "Sajid Meryem"],
            "Recruiting & Training" => ["Khoumacha Boutaina", "Sadik Mohamed"],
            "Purchasing" => ["Zahraoui Sara", "Chaibi Ilyass"],
            "Electronic R&D" => ["El Boustani Mourad"],
            "Software Engineering" => ["Ben Lahmadi Said", "El Allouli Abdelilah", "El Ouahhabi Abdeslam", "Taoug Mohammed"],
            "Hardware Engineering" => ["Ait Ghrib Abderrahman", "Haddou Brahim"],
            "Facility Services" => ["Namouli Oussama", "Nainia Mohamed", "Salim Abdelali"],
            "Electrical Laboratory" => ["Ghanfari Mohamed", "Ouakhi Ismail"],
            "Manufacturing Engineering" => ["Bouizgar Younes", "Bajdi Mouhcine", "Bouikalfidane Hafsa", "El Khadiri Rachid", "Driouich Leila", "El Mednoub Hamza", "El Ouarti Adnane", "Jraif Youssef", "Abidi Taha"],
            "Electrical Production" => ["El Idrissi Abdelhamid"],
            "Manual Assembly" => ["Amara Abderrazzak", "Chfeg Nor-Eddine", "El-Kouissi Noujoud", "Chelli Mohamed Amine", "Boussetta Oumaima", "Saidi Daad", "El Maadioui Hamza"],
            "Assembly Maintenance" => ["Chahboune Adel", "El Bouka Yassine", "El Bakiti Issam", "El Qortobi Yassine", "Abbou Morad"],
            "Molding" => ["El Ouiguemani Rachid", "En-Nkhyly Zakaria", "Ameur Ayoub", "Bakkali Abdessamade", "Zinou Nour Eddine", "El Afi Mehdi"],
            "Molding Maintenance" => ["Aiai Hamza", "Ait Khamim Abdelkrim", "Boudina Mohamed", "El Majdoubi Driss"],
            "Maintenance" => ["Bouizgar Younes", "El Fasely Rida", "Qannoufa Mostafa", "Touijar Mohamed"],
            "Quality" => ["Zouine Meryem"],
            "Electrical Logistics" => ["Zouitine Abdelfettah", "Echchen Mohammed"],
            "Electrical Customer Quality" => ["Charrah Amine"],
            "Electrical Customer Service" => ["El Ghabi Safae", "Echennoufi Mohammed"],
            "Electrical Supplier Quality" => ["Nouichi Marouane", "Smiri Mohamed", "Khibabi Fatima Ezzahra", "Megramane Atik"],
            "Electrical Production Scheduling" => ["Ait Kaddour Mohammed", "El Attari Salma", "El Mniai Hamza", "Haddouche Mohamed"],
            "Electrical Process Quality" => ["Halaouet Zineb", "Yamini Soukaina", "Driyer Yassine", "Sayiar Badr", "Hattab Salma", "Nechouani Radouane", "Bouabadi Achraf", "El Faqry Abderrahim", "Zaghdidi Narjiss", "Zaghdidi Naima", "Sitel Ali", "Jbira Naima", "Brhioui Mahjouba", "Zohair Youssef", "Lachhab Hafsa", "Zhourate Hakima", "Dhimene Yassir", "En-Nesraoui Nabile"],
            "Electrical Warehouse" => ["Bibi Redouane", "Bellouti Alae Eddine", "Kahlouch Tarik", "Lakteb Abdelilah", "Baihi Younes", "Rhbech Hamid", "Baba Abdelkarim", "Damir Soufiane", "Lahssini Soufiane", "Roubou Said", "Mahamat Ilias", "Ennaami Issam", "Yahiaoui Saif-Eddine", "El Haddaji Youssef", "Kerrou Ayoub", "Qninia Ayoub", "El Fakir Hissam", "El Machria Ayoub", "Statoua Marouan", "Ech-Charqy Youssef", "Haider Mohammed"]
        ];

        // 3. Mapping for main departments
        $subDepartmentsMapping = [
            "Board of Directors" => "Management",
            "Plant Manager" => "Management",
            "Program Management" => "Management",
            "Personnel Administration" => "Human Resources",
            "Recruiting & Training" => "Human Resources",
            "Finance & Accounting" => "Finance",
            "Accounting" => "Finance",
            "Electronic R&D" => "R&D",
            "Software Engineering" => "R&D",
            "Hardware Engineering" => "R&D",
            "Manufacturing Engineering" => "Engineering",
            "Electrical Laboratory" => "Laboratory",
            "Electrical Production" => "Production",
            "Manual Assembly" => "Production",
            "Molding" => "Production",
            "Assembly Maintenance" => "Maintenance",
            "Molding Maintenance" => "Maintenance",
            "Facility Services" => "Facility",
            "Quality System & HSE" => "QHSE",
            "Electrical Customer Quality" => "Quality",
            "Electrical Supplier Quality" => "Quality",
            "Electrical Process Quality" => "Quality",
            "Purchasing" => "Purchasing",
            "Electrical Logistics" => "Logistics",
            "Electrical Production Scheduling" => "Logistics",
            "Electrical Warehouse" => "Logistics",
            "Electrical Customer Service" => "Logistics"
        ];

        // 4. Iterate through the data and create employees
        foreach ($employeeData as $subDeptName => $names) {
            $mainDeptName = $subDepartmentsMapping[$subDeptName] ?? $subDeptName;

            $dept = Department::firstOrCreate(
                ['name' => $mainDeptName],
                [
                    'zone' => 'Zone 1'
                ]
            );
            $deptId = $dept->id;

            // ... (نفس الكود الفوق حتى كتوصل لـ وسط الـ Loop)

            foreach ($names as $fullName) {
                // 1. تقطيع الإسم
                $nameParts = explode(' ', trim($fullName));
                if (count($nameParts) >= 3) {
                    $lastName = $nameParts[0] . ' ' . $nameParts[1];
                    $firstName = implode(' ', array_slice($nameParts, 2));
                } else {
                    $lastName = $nameParts[0];
                    $firstName = $nameParts[1] ?? $lastName;
                }

                $cleanFirstName = strtolower(preg_replace('/[^a-zA-Z]/', '', $firstName));
                $cleanLastName = strtolower(preg_replace('/[^a-zA-Z]/', '', $lastName));
                $firstLetter = substr($cleanFirstName, 0, 1);

                // 2. تحديد الـ Role و الـ User Type (إيلا بغيتي تفرقهم مستقبلاً)
                $userType = 'operator'; // تقدر تبدلها بـ logic إيلا بغيتي
                $role = ($userType === 'admin') ? 'admin' : 'employee';

                // 3. 💡 تطبيق اللوجيك الجديد ديال الإيميل
                if ($userType === 'admin') {
                    $baseEmail = 'admin.' . $cleanLastName;
                } else {
                    $baseEmail = $firstLetter . '.' . $cleanLastName;
                }

                $email = $baseEmail . '@mta.ma';

                // 4. التأكد من عدم تكرار الإيميل
                $counter = 1;
                while (User::where('email', $email)->exists()) {
                    $email = ($userType === 'admin' ? 'admin.' : $firstLetter) . $counter . '.' . $cleanLastName . '@mta.ma';
                    $counter++;
                }

                // 5. المودپاس (Pattern) - كيبقى هكا أحسن فـ السايدر
                $rawPassword = ucfirst($firstLetter) . $cleanLastName . '@2026';

                User::create([
                    'first_name' => $firstName ?: $lastName,
                    'last_name' => $lastName,
                    'email' => $email,
                    'cin' => null,
                    'password' => Hash::make($rawPassword),
                    'position' => $subDeptName,
                    'department_id' => $deptId,
                    'onboarding_step' => 0,
                    'role' => $role,
                    'user_type' => $userType,
                    'start_date' => \Carbon\Carbon::now(),
                    'is_active' => true,
                ]);
            }
        }
    }
}
