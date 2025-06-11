<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\TableController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\CommentController;

use Illuminate\Support\Facades\Route;

// Rutas públicas (sin autenticación)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/categories', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'show']);
Route::post('/logout', [AuthController::class, 'logout']);

// Rutas protegidas por auth:sanctum
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [AuthController::class, 'show']);
    Route::put('/users/{user}', [AuthController::class, 'update']);
    Route::post('/products', [ProductController::class, 'store']);
    Route::get('/products/{id}', [ProductController::class, 'showOne']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    Route::get('/tables', [TableController::class, 'index']);
    Route::post('/tables', [TableController::class, 'store']);
    Route::get('/tables/{id}', [TableController::class, 'show']);
    Route::put('/tables/{id}', [TableController::class, 'update']);
    Route::delete('/tables/{id}', [TableController::class, 'destroy']);
    Route::put('/reservations/{reservation}/edit', [ReservationController::class, 'edit']);
    Route::put('/reservations/{reservation}/cancel', [ReservationController::class, 'cancel']);
    Route::put('/reservations/{reservation}/confirm', [ReservationController::class, 'confirm']);
    Route::get('/reservations', [ReservationController::class, 'index']);
    Route::post('/reservations', [ReservationController::class, 'store']);
    Route::get('/reservations/{id}', [ReservationController::class, 'show']);
    Route::put('/reservations/{id}', [ReservationController::class, 'update']);
    Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);
    Route::post('/reservations/check', [ReservationController::class, 'checkConflict']);
});