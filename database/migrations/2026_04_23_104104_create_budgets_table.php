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
            Schema::create('budgets', function (Blueprint $table) {
                $table->id();
                // Menghubungkan ke user yang login
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                // Nama kategori (Makan, Bensin, dll)
                $table->string('category_name'); 
                // Nominal limit yang diatur user
                $table->decimal('limit_amount', 15, 2); 
                // Disimpan per bulan dan tahun agar data tahun lalu tidak tercampur
                $table->integer('month'); 
                $table->year('year');
                $table->timestamps();
            });
        }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};