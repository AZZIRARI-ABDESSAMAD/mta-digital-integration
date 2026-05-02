<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            // names
            $table->string('first_name');
            $table->string('last_name');

            // login info
            $table->string('cin')->unique()->nullable();
            $table->string('email')->unique()->nullable();
            $table->string('password')->nullable();

            // roles and types
            $table->string('role')->default('employee'); // admin, employee
            $table->string('user_type')->default('operator'); // visitor, operator, intern

            // department and position
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            $table->string('position')->nullable();

            // dates and status
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->integer('onboarding_step')->default(1);
            $table->boolean('is_active')->default(true);

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
