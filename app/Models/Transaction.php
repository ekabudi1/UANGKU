<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    protected $fillable = ['user_id', 'wallet_id', 'description', 'amount', 'type', 'category', 'date'];

    public function wallet() {
        return $this->belongsTo(Wallet::class);
    }
}