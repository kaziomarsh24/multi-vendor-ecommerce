<?php

namespace App\Http\Requests\ShopOwner;

use Illuminate\Foundation\Http\FormRequest;

class AttachProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->shop;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['required', 'exists:products,id'],
            'custom_price' => ['nullable', 'numeric', 'min:0'],
            'custom_compare_price' => ['nullable', 'numeric', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
