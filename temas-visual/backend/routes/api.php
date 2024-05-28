<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThemeController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('themes', [ThemeController::class, 'index']);
Route::post('/theme', [ThemeController::class, 'store']);
Route::get('themes/{id}', [ThemeController::class, 'show']);
Route::delete('themes/{id}', [ThemeController::class, 'destroy']);
