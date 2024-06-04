<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


//Autenticación
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    

    //Usuarios
    Route::get('user', [UserController::class, 'getUser']);
    Route::put('user', [UserController::class, 'updateUser']);

    //Visualización de temas
    Route::get('themes', [ThemeController::class, 'index']);
    Route::get('themes/{id}', [ThemeController::class, 'show']);
    Route::delete('themes/{id}', [ThemeController::class, 'destroy']);
    
    Route::post('/theme', [ThemeController::class, 'store']);
    //Gestión de usuarios
    Route::get('user/themes', [ThemeController::class, 'getUserThemes']);
    Route::get('theme/{id}/download', [ThemeController::class, 'downloadTheme']);
    Route::post('theme/download', [ThemeController::class, 'generateAndDownloadTheme']);
    Route::get('/theme/download/leonardo', [ThemeController::class, 'downloadLeonardoTheme']);
});
