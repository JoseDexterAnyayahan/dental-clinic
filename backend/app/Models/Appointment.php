<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Appointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'appointment_no', 'client_id', 'dentist_id', 'service_id',
        'appointment_date', 'start_time', 'end_time', 'status',
        'notes', 'admin_notes', 'cancelled_by', 'cancel_reason',
    ];

    protected $casts = [
        'appointment_date' => 'date',
    ];

    // Statuses
    const STATUS_PENDING     = 'pending';
    const STATUS_CONFIRMED   = 'confirmed';
    const STATUS_IN_PROGRESS = 'in_progress';
    const STATUS_COMPLETED   = 'completed';
    const STATUS_CANCELLED   = 'cancelled';
    const STATUS_NO_SHOW     = 'no_show';

    // Relationships
    public function client(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function dentist(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Dentist::class);
    }

    public function service(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    // Auto-generate appointment number
    protected static function booted(): void
    {
        static::creating(function (Appointment $appointment) {
            $year  = now()->format('Y');
            $count = self::whereYear('created_at', $year)->count() + 1;
            $appointment->appointment_no = 'DC-' . $year . '-' . str_pad($count, 5, '0', STR_PAD_LEFT);
        });
    }
}