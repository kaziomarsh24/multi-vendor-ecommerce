<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreShopRequest extends FormRequest
{
    // only admin can register new shops
    public function authorize(): bool
    {
        return $this->user()?->isAdmin() ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'address' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_active' => ['nullable', 'boolean'],
            'logo' => ['nullable', 'image', 'max:2048'],
            'banner' => ['nullable', 'image', 'max:4096'],
            'user_id' => ['nullable', 'exists:users,id'],
            'new_owner_name' => ['nullable', 'string', 'max:255', 'required_without:user_id'],
            'new_owner_email' => ['nullable', 'email', 'unique:users,email', 'required_without:user_id'],
            'new_owner_password' => ['nullable', 'string', 'min:6'],
        ];
    }
}
