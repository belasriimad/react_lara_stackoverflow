<?php

namespace App\Http\Resources;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnswerResource extends JsonResource
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
            'body' => $this->body,
            'score' => $this->score.' '.Str::plural("vote", $this->score),
            'best_answer' => $this->best_answer,
            'created_at' => $this->created_at->diffForHumans(),
            'user' => UserResource::make($this->whenLoaded('user')),
            'question' => QuestionResource::make($this->whenLoaded('question')),
        ];;
    }
}
