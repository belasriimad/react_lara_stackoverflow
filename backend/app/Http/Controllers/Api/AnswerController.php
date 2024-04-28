<?php

namespace App\Http\Controllers\Api;

use App\Models\Vote;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnswerResource;
use App\Http\Resources\QuestionResource;
use App\Http\Requests\StoreAnswerRequest;
use App\Http\Requests\UpdateAnswerRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Validation\ValidationException;

class AnswerController extends Controller
{
    /**
     * Get the answer by slug
     */
    public function show(Answer $answer)
    {
        if(!$answer) {
            abort(404);
        }
        return AnswerResource::make($answer->load('question'));
    }

    /**
     * Store answer
     */
    public function store(StoreAnswerRequest $request, Question $question)
    {
        if($request->validated()) {
            $body = strip_tags($request->body);
            if(empty($body)) {
                throw ValidationException::withMessages([
                    'body' => 'The body field is required'
                ]);
            }
            $data = $request->validated();
            $data['question_id'] = $question->id;
            $request->user()->answers()
                ->create($data);
            return QuestionResource::make($question->load(['user', 'answers']))->additional([
                'message' => 'Answer added successfully'
            ]);
        }
    }

    /**
     * Update answer
     */
    public function update(UpdateAnswerRequest $request, Question $question, Answer $answer)
    {
        if($request->user()->cannot('update', $answer)) {
            return response()->json([
                'error' => 'Something went wrong try again later'
            ]);
        }else {
            if($request->validated()) {
                $body = strip_tags($request->body);
                if(empty($body)) {
                    throw ValidationException::withMessages([
                        'body' => 'The body field is required'
                    ]);
                }
                $data = $request->validated();
                $data['user_id'] = $request->user()->id;
                $data['question_id'] = $question->id;
                $answer->update($data);
                return QuestionResource::make($question)->additional([
                    'message' => 'Answer updated successfully'
                ]);
            }
        }
    }

     /**
     * Delete answer
     */
    public function destroy(Request $request, Question $question, Answer $answer)
    {
        if($request->user()->cannot('delete', $answer)) {
            return response()->json([
                'error' => 'Something went wrong try again later'
            ]);
        }else {
            $answer->delete();
            return QuestionResource::make($question->load(['user', 'answers']))->additional([
                'message' => 'Answer deleted successfully'
            ]);
        }
    }

    /**
     * Vote up an answer
     */
    public function voteUp(Request $request, Answer $answer)
    {
        //check if the user already voted for this answer
        $votes = Vote::whereHasMorph(
            'votable',
            [Answer::class],
            function (Builder $query) use ($answer) {
                $query->where('votable_id', $answer->id);
            }
        )->get();
        if($votes->contains('user_id', $request->user()->id)) {
            return response()->json([
                'error' => 'You have already voted for this answer'
            ]);
        }else {
            $answer->increment('score');
            $vote = Vote::make([
                'user_id' => $request->user()->id
            ]);
            $vote->votable()->associate($answer)->save();
            return QuestionResource::make(Question::find($answer->question_id)->load(['answers', 'user']))->additional([
                'message' => 'Vote added successfully'
            ]);
        }
    }

    /**
     * Vote down an answer
     */
    public function voteDown(Request $request, Answer $answer)
    {
        //check if the user already voted for this answer
        $votes = Vote::whereHasMorph(
            'votable',
            [Answer::class],
            function (Builder $query) use ($answer) {
                $query->where('votable_id', $answer->id);
            }
        )->get();
        if($votes->contains('user_id', $request->user()->id)) {
            return response()->json([
                'error' => 'You have already voted for this answer'
            ]);
        }else {
            $answer->decrement('score');
            $vote = Vote::make([
                'user_id' => $request->user()->id
            ]);
            $vote->votable()->associate($answer)->save();
            return QuestionResource::make(Question::find($answer->question_id)->load(['answers', 'user']))->additional([
                'message' => 'Vote added successfully'
            ]);
        }
    }

    /**
     * Mark an answer as the best
     */
    public function markAsBest(Request $request, Answer $answer)
    {
        if($request->user()->cannot('markAsBest', $answer)) {
            return response()->json([
                'error' => 'Something went wrong try again later'
            ]);
        }else {
            //remove the previous best answer if exists
            $prevBestAnswer = Answer::where(['best_answer' => 1, 'question_id' => $answer->question->id])
                ->first();
            if($prevBestAnswer) {
                $prevBestAnswer->update([
                    'best_answer' => 0
                ]);
            }
            //mark the new answer as the best
            $answer->update([
                'best_answer' => 1
            ]);
            return QuestionResource::make($answer->question->load(['answers', 'user']))->additional([
                'message' => 'Answer marked as the best'
            ]);
        }
    }
}
