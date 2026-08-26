<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use Inertia\Inertia;
use App\Http\Controllers\DompetController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\HelpController;


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});



Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');



Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dompet', [DompetController::class, 'index'])->name('dompet.index');
    Route::post('/dompet', [DompetController::class, 'store'])->name('dompet.store');
    // TAMBAHKAN BARIS INI:
    Route::post('/dompet/{wallet}', [DompetController::class, 'update'])->name('dompet.update');
    Route::delete('/dompet/{wallet}', [DompetController::class, 'destroy'])->name('dompet.destroy');
});


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// Transaksi


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/transaksi', [TransactionController::class, 'index'])->name('transaksi.index');
    Route::post('/transaksi', [TransactionController::class, 'store'])->name('transaksi.store');
    
    // 2. Ubah TransaksiController menjadi TransactionController
    Route::put('/transaksi/{id}', [TransactionController::class, 'update'])->name('transaksi.update');
    
    Route::delete('/transaksi/{transaction}', [TransactionController::class, 'destroy'])->name('transaksi.destroy');
});




// -------------- SETTTINGS ---------------------
// Di web.php
Route::middleware('auth')->group(function () {
    Route::get('/settings', [ProfileController::class, 'edit'])->name('settings.edit');
    
    // GANTI Route::patch MENJADI Route::post
    Route::post('/settings', [ProfileController::class, 'update'])->name('settings.update');
    
    Route::delete('/settings', [ProfileController::class, 'destroy'])->name('settings.destroy');
});



// --------------------BUDGETING----------------


Route::middleware('auth')->group(function () {
    // Pastikan seperti ini di web.php
Route::get('/budgeting', [BudgetController::class, 'index'])->name('budgeting.index');
    Route::post('/budgeting', [BudgetController::class, 'store'])->name('budgeting.store');
});


// ----------------LAPORAN---------------
Route::middleware(['auth', 'verified'])->group(function () {
    
    // Route Laporan & Evaluasi
    // Kita tambahkan parameter opsional {filter?} dan {date?} 
    // supaya user bisa navigasi ke minggu/bulan sebelumnya melalui URL
    Route::get('/laporan/{filter?}/{date?}', [LaporanController::class, 'index'])
        ->name('laporan.index');

});



// -------------BANTUAN-------------------
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/help', [HelpController::class, 'index'])->name('help.index');
});
require __DIR__.'/auth.php';