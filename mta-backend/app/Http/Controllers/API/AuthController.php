<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validate input: 'login' can be either an email or a CIN
        $request->validate([
            'login' => 'required|string',
            'password' => 'required',
        ]);

        // 2. Determine if the input is an email or a CIN
        $isEmail = filter_var($request->login, FILTER_VALIDATE_EMAIL);
        $loginField = $isEmail ? 'email' : 'cin';

        // 3. Find the user in the database using the correct field
        $user = User::where($loginField, $request->login)->first();

        // 4. Check if user exists and password is correct
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Les identifiants sont incorrects.'
            ], 401);
        }

        // 5. Optional but recommended: Check if user is active (Soft Delete check)
        if (! $user->is_active) {
            return response()->json([
                'message' => 'Ce compte est désactivé.'
            ], 403);
        }

        // 6. Generate the authentication token
        $token = $user->createToken('mta_auth_token')->plainTextToken;

        // 7. Return the success response
        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user->load('department')
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté avec succès']);
    }
}
