<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['user_id', 'rating', 'text', 'approved'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
