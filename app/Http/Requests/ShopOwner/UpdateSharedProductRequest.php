<?php

namespace App\Http\Requests\ShopOwner;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSharedProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        $shop = $this->user()?->shop;
        $product = $this->route('product');

        return $shop && $product && $product->user_id === $this->user()->id;
    }

    public function rules(): array
    {
        $productId = $this->route('product')?->id;

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'sku' => ['nullable', 'string', 'max:50', 'unique:products,sku,'.$productId],
            'base_price' => ['required', 'numeric', 'min:0'],
            'compare_price' => ['nullable', 'numeric', 'min:0'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'gallery.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'existing_gallery' => ['nullable', 'array'],
        ];
    }
}
