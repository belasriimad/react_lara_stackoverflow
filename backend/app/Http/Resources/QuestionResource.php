<?php

namespace App\Http\Resources;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuestionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {   
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'body' => $this->body,
            'viewCount' => $this->viewCount.' '.Str::plural("view", $this->viewCount),
            'score' => $this->score.' '.Str::plural("vote", $this->score),
            'answerCount' => $this->answers()->count().' '.Str::plural("answer", $this->answers()->count()),
            'answers' => AnswerResource::collection($this->whenLoaded('answers')),
            'created_at' => $this->created_at->diffForHumans(),
            'user' => UserResource::make($this->whenLoaded('user')),
            'tags' => $this->tags
        ];
    }
}
