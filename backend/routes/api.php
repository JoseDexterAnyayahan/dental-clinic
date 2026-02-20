<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\AdminAuthController;
use App\Http\Controllers\Api\Auth\ClientAuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\AppointmentController as AdminAppointmentController;
use App\Http\Controllers\Api\Admin\ClientController;
use App\Http\Controllers\Api\Admin\DentistController;
use App\Http\Controllers\Api\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Api\Admin\ScheduleController;
use App\Http\Controllers\Api\Client\AppointmentController as ClientAppointmentController;
use App\Http\Controllers\Api\Client\ProfileController;
use App\Http\Controllers\Api\Client\ServiceController as ClientServiceController;

// ── Public Routes ─────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    Route::post('/admin/login',     [AdminAuthController::class,  'login']);
    Route::post('/client/login',    [ClientAuthController::class, 'login']);
    Route::post('/client/register', [ClientAuthController::class, 'register']);
});

Route::get('/services',                 [ClientServiceController::class, 'index']);
Route::get('/services/dentists',        [ClientServiceController::class, 'dentists']);
Route::get('/services/available-slots', [ClientServiceController::class, 'availableSlots']);

// ── Admin Routes ──────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::post('/logout',  [AdminAuthController::class, 'logout']);
    Route::get('/me',       [AdminAuthController::class, 'me']);
    Route::post('/refresh', function (Illuminate\Http\Request $request) {
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token]);
    });

    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::patch('/appointments/{appointment}/status', [AdminAppointmentController::class, 'updateStatus']);
    Route::apiResource('appointments', AdminAppointmentController::class);
    Route::apiResource('clients',      ClientController::class);
    Route::apiResource('dentists',     DentistController::class);
    Route::apiResource('services',     AdminServiceController::class);
    Route::apiResource('schedules',    ScheduleController::class);
});

// ── Client Routes ─────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'client'])->prefix('client')->group(function () {
    Route::post('/logout',  [ClientAuthController::class, 'logout']);
    Route::get('/me',       [ClientAuthController::class, 'me']);
    Route::post('/refresh', function (Illuminate\Http\Request $request) {
        $request->user()->currentAccessToken()->delete();
        $token = $request->user()->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token]);
    });

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    Route::put('/appointments/{appointment}',          [ClientAppointmentController::class, 'update']);
    Route::patch('/appointments/{appointment}/cancel', [ClientAppointmentController::class, 'cancel']);
    Route::apiResource('appointments', ClientAppointmentController::class)->only(['index', 'store', 'show']);
});