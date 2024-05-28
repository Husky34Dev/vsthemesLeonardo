<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    use HasFactory;

    // Define la tabla asociada al modelo (opcional si el nombre es el plural del modelo)
    protected $table = 'themes';

    // Los campos que pueden ser asignados en masa
    protected $fillable = [
        'name',
        'type',
        'theme_data',
    ];

    // Los campos que deben ser convertidos a un formato específico
    protected $casts = [
        'theme_data' => 'array', // Convertir el campo JSON en un arreglo
    ];
}
