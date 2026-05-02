<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    protected $fillable = [
        'operator_id',
        'engineer_id',
        'category',
        'criteria',
        'overall_status',
        'comments',
    ];

    protected function casts(): array
    {
        return [
            'criteria'       => 'array',
            'overall_status' => 'boolean',
        ];
    }

    public function operator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function engineer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'engineer_id');
    }
}
