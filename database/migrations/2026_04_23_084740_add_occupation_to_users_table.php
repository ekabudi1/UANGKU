<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Kita tambah pengecekan agar tidak error jika kolom sudah ada
            if (!Schema::hasColumn('users', 'occupation')) {
                $table->string('occupation')->nullable()->after('email');
            }
            if (!Schema::hasColumn('users', 'profile_photo_path')) {
                $table->string('profile_photo_path', 2048)->nullable()->after('occupation');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Hapus kolom hanya jika kolom itu ada
            $columns = [];
            if (Schema::hasColumn('users', 'occupation')) $columns[] = 'occupation';
            if (Schema::hasColumn('users', 'profile_photo_path')) $columns[] = 'profile_photo_path';
            
            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};