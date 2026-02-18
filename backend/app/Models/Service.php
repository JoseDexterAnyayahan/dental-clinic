<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'slug', 'description', 'duration_mins', 'price', 'icon', 'is_active',
    ];

    protected $casts = [
        'is_active'     => 'boolean',
        'price'         => 'decimal:2',
        'duration_mins' => 'integer',
    ];

    public function appointments(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Appointment::class);
    }
}