<?php

use App\Http\Controllers\API\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\EmployeeController;
use App\Http\Controllers\API\DepartmentController;
use App\Http\Controllers\AIController;
use App\Http\Controllers\TtsController;
use App\Http\Controllers\API\ProgressController;
use App\Http\Controllers\API\ProfileController;

// all commants in english

// login route (open to all users to be able to connect)
Route::post('/login', [AuthController::class, 'login']);

// ==========================================
// 1. routes for any user connected (trainee or admin)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/ai/chat', [AIController::class, 'chat']);
    Route::post('/tts', [TtsController::class, 'synthesize']);

    Route::get('/me', function (Request $request) {
        return $request->user()->load(['department', 'completedModules']);
    });

    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // routes for recording the trainee's training courses
    Route::post('/user/progress', [ProgressController::class, 'markComplete']);
    Route::get('/user/progress', [ProgressController::class, 'getUserProgress']);
    Route::get('/user/progress/check/{slug}', [ProgressController::class, 'checkAccess']);
});


// ==========================================
// 2. routes for admin only
// ==========================================
Route::middleware(['auth:sanctum', 'admin'])->group(function () {

    // dashboard
    Route::get('/admin/users-progress', [ProgressController::class, 'getAllUsersProgress']);

    // users management (CRUD)
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::patch('/employees/{id}/toggle-status', [EmployeeController::class, 'toggleStatus']);
});

use App\Http\Controllers\API\EvaluationController;

// routes for profile management
Route::post('/profile/avatar', [App\Http\Controllers\ProfileController::class, 'updateAvatar'])->middleware('auth:sanctum');
Route::put('/profile/password', [App\Http\Controllers\ProfileController::class, 'updatePassword'])->middleware('auth:sanctum');
