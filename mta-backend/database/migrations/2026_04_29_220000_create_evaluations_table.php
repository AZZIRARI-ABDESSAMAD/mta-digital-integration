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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();

            // The operator being evaluated
            $table->foreignId('operator_id')->constrained('users')->onDelete('cascade');

            // The engineer performing the audit
            $table->foreignId('engineer_id')->constrained('users')->onDelete('cascade');

            // Category of the audit
            $table->enum('category', ['HSE', 'Traceability', 'Production']);

            // JSON checklist: [{item: "...", checked: true/false}, ...]
            $table->json('criteria');

            // Has the operator passed?
            $table->boolean('overall_status')->default(false);

            // Engineer's written comments
            $table->text('comments')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
