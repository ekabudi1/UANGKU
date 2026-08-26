<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wallet extends Model
{
    protected $fillable = [
        'user_id', 'name', 'type', 'balance', 'norek', 'logo', 'account_name'
    ];
    protected $casts = [
    'balance' => 'integer', // Pastikan bukan tipe yang aneh-aneh
    ];

    public function transactions() {
    return $this->hasMany(Transaction::class);
    }
}