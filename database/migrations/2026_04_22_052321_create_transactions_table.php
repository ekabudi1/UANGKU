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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('wallet_id')->constrained()->onDelete('cascade'); // Terhubung ke dompet mana
            $table->string('description'); // Contoh: "Uang Narik Shift 1" atau "Beli Bensin"
            $table->decimal('amount', 15, 2);
            $table->enum('type', ['income', 'expense']); // Pemasukan atau Pengeluaran
            $table->string('category'); // Contoh: Transportasi, Makanan, Gaji
            $table->date('date');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};