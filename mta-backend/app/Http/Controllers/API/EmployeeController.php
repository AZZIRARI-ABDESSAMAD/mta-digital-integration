<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;


class EmployeeController extends Controller
{
    public function index(): JsonResponse
    {
        // loading employees with their department and completed modules
        $employees = User::with(['department', 'completedModules'])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'prenom' => $user->first_name,
                'nom' => $user->last_name,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
                'cin' => $user->cin,
                'userType' => $user->user_type,
                'position' => $user->position,
                'role' => $user->role,
                'isActive' => $user->is_active,
                // Return an array of objects containing both slug and signature
                'completed_modules' => $user->completedModules->map(function ($mod) {
                    return [
                        'module_slug' => $mod->module_slug,
                        'signature' => $mod->signature
                    ];
                }),

                // dates important for interns and visitors
                'startDate' => $user->start_date ? $user->start_date->format('Y-m-d') : null,
                'endDate' => $user->end_date ? $user->end_date->format('Y-m-d') : null,

                // department information
                'department' => $user->department ? $user->department->name : 'N/A',
                'zone' => $user->department ? $user->department->zone : 'N/A',
                'costCenter' => $user->department ? $user->department->cost_center : 'N/A',
            ];
        });

        return response()->json($employees);
    }


    // public function store(Request $request): JsonResponse
    // {
    //     // convert all comments from arabic to english

    //     // 1. Validation from the incoming request
    //     $validated = $request->validate([
    //         'first_name' => 'required|string|max:255',
    //         'last_name' => 'required|string|max:255',
    //         'user_type' => 'required|in:admin,operator,stagiaire,visitor',
    //         'department_id' => 'nullable|exists:departments,id',
    //         'position' => 'nullable|string',
    //         'email' => 'nullable|email|unique:users,email',
    //         'cin' => 'nullable|string|unique:users,cin',
    //         'end_date' => 'nullable|date',
    //     ]);

    //     // 2. Base Info (preparing the basic information shared between all users)
    //     $userData = [
    //         'first_name' => $validated['first_name'],
    //         'last_name' => $validated['last_name'],
    //         'user_type' => $validated['user_type'],
    //         'department_id' => $validated['department_id'],
    //         'position' => $validated['position'],
    //         'start_date' => Carbon::now(),
    //         'role' => $validated['user_type'] === 'admin' ? 'admin' : 'employee' // giving them a default role 
    //     ];

    //     $generatedPassword = null;
    //     $email = null;

    //     // 3. conditions based on the user type (Visitor or Employee)
    //     if ($validated['user_type'] === 'visitor') {

    //         // if the user is a visitor: the password is the CIN, and the account expires at the end of the day
    //         $userData['cin'] = $validated['cin'];
    //         $userData['password'] = Hash::make($validated['cin']);
    //         $userData['end_date'] = Carbon::now()->endOfDay();
    //     } else {

    //         // if the user is an employee or a stagiaire: we generate an email and password for them
    //         // a. cleaning the first name and last name from special characters and spaces
    //         $firstNameClean = \Illuminate\Support\Str::slug($validated['first_name'], '');
    //         $lastNameClean = \Illuminate\Support\Str::slug($validated['last_name'], '');

    //         // b. taking only the first letter of the first name (the modification you requested)
    //         $firstLetter = substr($firstNameClean, 0, 1);

    //         // c. concatenating the first letter with the dot and the last name (example: a.azzirari)
    //         $baseEmail = $firstLetter . '.' . $lastNameClean;
    //         $email = $baseEmail . '@mta.ma';

    //         // d. checking if this email already exists to avoid duplicates
    //         $counter = 1;
    //         while (User::where('email', $email)->exists()) {
    //             $email = $baseEmail . $counter . '@mta.ma'; // if it exists, it will become a.azzirari1@mta.ma
    //             $counter++;
    //         }

    //         // e. generating a random password with 8 characters and numbers
    //         $generatedPassword = \Illuminate\Support\Str::random(8);

    //         // f. adding this to the data to be saved
    //         $userData['email'] = $email;
    //         $userData['password'] = Hash::make($generatedPassword);
    //         $userData['end_date'] = $validated['end_date'] ?? null;
    //     }

    //     // 4. Creation (saving the user in the database)
    //     $user = User::create($userData);

    //     // 5. Response (returning the response to the front-end to be displayed to the admin)
    //     return response()->json([
    //         'message' => 'Utilisateur créé avec succès',
    //         'user' => $user,
    //         'generated_email' => $email, // returns null if the user is a visitor
    //         'plain_password' => $generatedPassword // returns null if the user is a visitor because the password is the CIN
    //     ], 201);
    // }
    // public function store(Request $request): JsonResponse
    // {
    //     // 1. Validation
    //     $validated = $request->validate([
    //         'first_name' => 'required|string|max:255',
    //         'last_name' => 'required|string|max:255',
    //         'user_type' => 'required|in:admin,operator,stagiaire,visitor',
    //         'department_id' => 'nullable|exists:departments,id',
    //         'position' => 'nullable|string',
    //         'email' => 'nullable|email|unique:users,email',
    //         'cin' => 'nullable|string|unique:users,cin',
    //         'end_date' => 'nullable|date',
    //     ]);

    //     // 2. Base Info
    //     $userData = [
    //         'first_name' => $validated['first_name'],
    //         'last_name' => $validated['last_name'],
    //         'user_type' => $validated['user_type'],
    //         'department_id' => $validated['department_id'],
    //         'position' => $validated['position'],
    //         'start_date' => Carbon::now(),
    //         'role' => $validated['user_type'] === 'admin' ? 'admin' : 'employee'
    //     ];

    //     $generatedPassword = null;
    //     $email = null;

    //     // 3. Logic based on user type
    //     if ($validated['user_type'] === 'visitor') {
    //         $userData['cin'] = $validated['cin'];
    //         $userData['password'] = Hash::make($validated['cin']);
    //         $userData['end_date'] = Carbon::now()->endOfDay();
    //     } else {
    //         // a. Cleaning strings
    //         $firstNameClean = \Illuminate\Support\Str::slug($validated['first_name'], '');
    //         $lastNameClean = \Illuminate\Support\Str::slug($validated['last_name'], '');

    //         // b. 💡 NEW: Logic to differentiate Admin email
    //         if ($validated['user_type'] === 'admin') {
    //             $baseEmail = 'admin.' . $lastNameClean;
    //         } else {
    //             $firstLetter = substr($firstNameClean, 0, 1);
    //             $baseEmail = $firstLetter . '.' . $lastNameClean;
    //         }

    //         $email = $baseEmail . '@mta.ma';

    //         // d. Check for duplicates
    //         $counter = 1;
    //         while (User::where('email', $email)->exists()) {
    //             $email = $baseEmail . $counter . '@mta.ma';
    //             $counter++;
    //         }

    //         // e. Generating the random password (Best Practice)
    //         $generatedPassword = \Illuminate\Support\Str::random(8);

    //         $userData['email'] = $email;
    //         $userData['password'] = Hash::make($generatedPassword);
    //         $userData['end_date'] = $validated['end_date'] ?? null;
    //     }

    //     // 4. Creation
    //     $user = User::create($userData);

    //     // 5. Response
    //     return response()->json([
    //         'message' => 'Utilisateur créé avec succès',
    //         'user' => $user,
    //         'generated_email' => $email,
    //         'plain_password' => $generatedPassword
    //     ], 201);
    // }
    public function store(Request $request): JsonResponse
    {
        // الخطوة 1: حيدنا فحص الإيميل (Validation) من هنا باش ما يحبسناش
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'user_type' => 'required|in:admin,operator,stagiaire,visitor',
            'department_id' => 'nullable|exists:departments,id',
            'position' => 'nullable|string',
            'cin' => 'nullable|string|unique:users,cin',
            'end_date' => 'nullable|date',
            // لاحظ: مسحنا السطر ديال الإيميل من هنا
        ]);

        // الخطوة 2: جمع المعلومات الأساسية
        $userData = [
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'user_type' => $validated['user_type'],
            'department_id' => $validated['department_id'],
            'position' => $validated['position'],
            'start_date' => \Carbon\Carbon::now(),
            'role' => $validated['user_type'] === 'admin' ? 'admin' : 'employee'
        ];

        $generatedPassword = null;
        $email = null;

        if ($validated['user_type'] === 'visitor') {
            $userData['cin'] = $validated['cin'];
            $userData['password'] = Hash::make($validated['cin']);
            $userData['end_date'] = \Carbon\Carbon::now()->endOfDay();
        } else {
            // الخطوة 3: نقّي السمية والكنية
            $firstNameClean = \Illuminate\Support\Str::slug($validated['first_name'], '');
            $lastNameClean = \Illuminate\Support\Str::slug($validated['last_name'], '');

            // الخطوة 4: صايب الجزء الأول ديال الإيميل
            if ($validated['user_type'] === 'admin') {
                $basePrefix = 'admin.' . $lastNameClean;
            } else {
                $firstLetter = substr($firstNameClean, 0, 1);
                $basePrefix = $firstLetter . '.' . $lastNameClean;
            }

            $email = $basePrefix . '@mta.ma';

            // الخطوة 5 (المهمة): الترقيم الأوتوماتيكي
            // هاد اللوب كتقلب: واش a.azzirari كاين؟ إيلا كاين غتردو a.azzirari1 ... وغتبقا تقلب حتى تلقى شي واحد خاوي
            $counter = 1;
            while (\App\Models\User::where('email', $email)->exists()) {
                $email = $basePrefix . $counter . '@mta.ma';
                $counter++;
            }

            // الخطوة 6: صايب المودپاس وحط كولشي
            $generatedPassword = \Illuminate\Support\Str::random(8);

            $userData['email'] = $email;
            $userData['password'] = Hash::make($generatedPassword);
            $userData['end_date'] = $validated['end_date'] ?? null;
        }

        // الخطوة 7: سجل فالداتابيز وصيفط الجواب
        $user = \App\Models\User::create($userData);

        return response()->json([
            'message' => 'Utilisateur créé avec succès',
            'user' => $user,
            'generated_email' => $email, // هادا هو الإيميل النهائي (اللي فيه الرقم إيلا كان مكرر)
            'plain_password' => $generatedPassword
        ], 201);
    }



    // Method to Update User
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            // You can add validation here if needed

            // Update the user
            $user->update($request->all());

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update user', 'details' => $e->getMessage()], 500);
        }
    }

    // Method to Soft Delete / Deactivate User
    public function toggleStatus(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            // Toggle the boolean state based on what React sent
            $user->is_active = $request->input('is_active');
            $user->save();

            return response()->json([
                'message' => 'User status toggled successfully',
                'isActive' => $user->is_active
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to toggle status', 'details' => $e->getMessage()], 500);
        }
    }
}
