<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'dentist_id', 'day_of_week', 'start_time', 'end_time', 'slot_duration', 'is_active',
    ];

    protected $casts = [
        'is_active'    => 'boolean',
        'day_of_week'  => 'integer',
        'slot_duration'=> 'integer',
    ];

    // Day name accessor
    public function getDayNameAttribute(): string
    {
        $days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        return $days[$this->day_of_week] ?? 'Unknown';
    }

    public function dentist(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Dentist::class);
    }
}