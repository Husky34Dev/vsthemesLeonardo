<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'type',
        'theme_data',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
