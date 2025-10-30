<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'all_day' => ['boolean'],
            'location' => ['nullable', 'string', 'max:255'],
            'status' => ['in:scheduled,cancelled,done'],
            'visibility' => ['in:private,public'],
            'color' => ['nullable', 'string', 'max:32'],
            'capacity' => ['nullable', 'integer', 'min:1'],
            'meta' => ['nullable', 'array'],
        ];
    }
}


