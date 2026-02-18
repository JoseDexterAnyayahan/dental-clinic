<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dentist_id')->constrained()->onDelete('cascade');
            $table->tinyInteger('day_of_week')->unsigned()->comment('0=Sun,1=Mon,...,6=Sat');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('slot_duration')->default(30)->comment('in minutes');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};