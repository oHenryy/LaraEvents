<?php

use App\Http\Controllers\Api\EventApiController;
use App\Http\Controllers\Api\AuthApiController;
use Illuminate\Support\Facades\Route;

// Login de token
Route::post('token/login', [AuthApiController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('events', [EventApiController::class, 'index']);
    Route::post('events', [EventApiController::class, 'store']);
    Route::get('events/{event}', [EventApiController::class, 'show']);
    Route::put('events/{event}', [EventApiController::class, 'update']);
    Route::delete('events/{event}', [EventApiController::class, 'destroy']);

    // Logout (revogação do token atual)
    Route::post('token/logout', [AuthApiController::class, 'logout']);
});


