<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    protected $fillable = [
    'user_id', 
    'category_name', 
    'limit_amount', 
    'month', 
    'year'
    ];
}