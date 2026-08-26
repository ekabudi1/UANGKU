<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            // Menghubungkan dompet ke user yang login
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Nama dompet (Gopay, BNI, dll)
            $table->string('type'); // E-wallet atau Mobile Bank
            $table->bigInteger('balance')->default(0);
            $table->string('norek'); // Nomor rekening atau nomor HP
            $table->string('logo')->nullable(); // Path foto logo
            // Tambahkan baris ini di dalam Schema::create
            $table->string('account_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};