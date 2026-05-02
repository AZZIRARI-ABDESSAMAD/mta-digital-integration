<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('user_completed_modules', function (Blueprint $table) {
            $table->longText('signature')->nullable()->after('module_slug');
        });
    }

    public function down()
    {
        Schema::table('user_completed_modules', function (Blueprint $table) {
            $table->dropColumn('signature');
        });
    }
};
