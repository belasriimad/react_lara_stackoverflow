<?php

namespace App\Policies;

use App\Models\Answer;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AnswerPolicy
{
    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Answer $answer): bool
    {
        //
        return $user->id === $answer->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Answer $answer): bool
    {
        //
        return $user->id === $answer->user_id;
    }

    /**
     * Mark an answer as the best
     */
    public function markAsBest(User $user, Answer $answer): bool
    {
        //
        return $user->id === $answer->question->user->id;
    }
}
