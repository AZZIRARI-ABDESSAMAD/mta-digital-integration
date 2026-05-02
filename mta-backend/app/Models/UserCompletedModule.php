<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserCompletedModule extends Model
{
    protected $fillable = [
        'user_id',
        'module_slug',
        'signature',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
