<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = [
        'body', 'score', 'question_id', 'user_id', 'best_answer'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function question()
    {
        return $this->belongsTo(Question::class)->with('user');
    }

    public function votes() : MorphMany
    {
        return $this->morphMany(Vote::class, 'votable');
    }
}
