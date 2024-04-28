<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\Vote;
use App\Models\Question;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Resources\QuestionResource;
use Illuminate\Database\Eloquent\Builder;
use App\Http\Requests\StoreQuestionRequest;
use App\Http\Requests\UpdateQuestionRequest;
use Illuminate\Validation\ValidationException;

class QuestionController extends Controller
{
    /**
     * Get all the questions
     */
    public function index()
    {
        return QuestionResource::collection(Question::with(['answers', 'user'])
                ->latest()->paginate(3));
    }

    /**
     * Get the logged in user questions
     */
    public function authUserQuestions(Request $request)
    {
        return QuestionResource::collection($request->user()->questions()
                ->latest()->get());
    }

    /**
     * Get the questions by a given user 
     */
    public function questionsByUser(Request $request)
    {
        $user = User::find($request->user_id);
        return QuestionResource::collection($user->questions()
                ->with(['answers', 'user'])->latest()->paginate(3));
    }

    /**
     * Get the questions by a given tag 
     */
    public function questionsByTag($tag)
    {
        $questions = Question::where('tags', 'LIKE', '%'.$tag.'%')
            ->with(['answers', 'user'])->latest()->paginate(3);
        return QuestionResource::collection($questions);
    }

    /**
     * Get the question by slug
     */
    public function show(Question $question)
    {
        if(!$question) {
            abort(404);
        }
        $question->increment("viewCount");
        return QuestionResource::make($question->load(['answers', 'user']));
    }

    /**
     * Store question
     */
    public function store(StoreQuestionRequest $request)
    {
        if($request->validated()) {
            $body = strip_tags($request->body);
            if(empty($body)) {
                throw ValidationException::withMessages([
                    'body' => 'The body field is required'
                ]);
            }
            $data = $request->validated();
            $data['slug'] = Str::slug($request->title);
            $data['tags'] = $request->tags;
            $question = $request->user()->questions()
                ->create($data);
            return QuestionResource::make($question)->additional([
                'message' => 'Question added successfully'
            ]);
        }
    }

    /**
     * Update question
     */
    public function update(UpdateQuestionRequest $request, Question $question)
    {
        if($request->user()->cannot('update', $question)) {
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
                $data['slug'] = Str::slug($request->title);
                $data['tags'] = $request->tags;
                $question->update($data);
                return QuestionResource::make($question)->additional([
                    'user' => UserResource::make($request->user()),
                    'message' => 'Question updated successfully'
                ]);
            }
        }
    }

    /**
     * Delete question
     */
    public function destroy(Request $request, Question $question)
    {
        if($request->user()->cannot('delete', $question)) {
            return response()->json([
                'error' => 'Something went wrong try again later'
            ]);
        }else {
            $question->delete();
            return response()->json([
                'questions' => QuestionResource::collection($request->user()->questions),
                'message' => 'Question deleted successfully'
            ]);
        }
    }

    /**
     * Vote up a question
     */
    public function voteUp(Request $request, Question $question)
    {
        //check if the user already voted for this question
        $votes = Vote::whereHasMorph(
            'votable',
            [Question::class],
            function (Builder $query) use ($question) {
                $query->where('votable_id', $question->id);
            }
        )->get();
        if($votes->contains('user_id', $request->user()->id)) {
            return response()->json([
                'error' => 'You have already voted for this question'
            ]);
        }else {
            $question->increment('score');
            $vote = Vote::make([
                'user_id' => $request->user()->id
            ]);
            $vote->votable()->associate($question)->save();
            return QuestionResource::make($question->load(['answers', 'user']))->additional([
                'message' => 'Vote added successfully'
            ]);
        }
    }

    /**
     * Vote down a question
     */
    public function voteDown(Request $request, Question $question)
    {
        //check if the user already voted for this question
        $votes = Vote::whereHasMorph(
            'votable',
            [Question::class],
            function (Builder $query) use ($question) {
                $query->where('votable_id', $question->id);
            }
        )->get();
        if($votes->contains('user_id', $request->user()->id)) {
            return response()->json([
                'error' => 'You have already voted for this question'
            ]);
        }else {
            $question->decrement('score');
            $vote = Vote::make([
                'user_id' => $request->user()->id
            ]);
            $vote->votable()->associate($question)->save();
            return QuestionResource::make($question->load(['answers', 'user']))->additional([
                'message' => 'Vote added successfully'
            ]);
        }
    }
}
