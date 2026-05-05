<?php

use App\Http\Controllers\Api\ReadingProgressController;
use App\Http\Controllers\Api\IndonesiaAddressController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $r) => $r->user());
    Route::post('/baca-progress', [ReadingProgressController::class, 'store']);
});

// Public endpoints for Indonesian address (Jabodetabek subset)
Route::get('/indonesia/kabupaten', [IndonesiaAddressController::class, 'kabupaten']);
Route::get('/indonesia/kecamatan', [IndonesiaAddressController::class, 'kecamatan']);
