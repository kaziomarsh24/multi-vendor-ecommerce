<?php

namespace App\Http\Requests\ShopOwner;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $shop = $this->user()?->shop;
        $shopProduct = $this->route('shopProduct');

        return $shop && $shopProduct && $shopProduct->shop_id === $shop->id;
    }

    public function rules(): array
    {
        return [
            'custom_price' => ['nullable', 'numeric', 'min:0'],
            'custom_compare_price' => ['nullable', 'numeric', 'min:0'],
            'custom_title' => ['nullable', 'string', 'max:255'],
            'custom_description' => ['nullable', 'string'],
            'custom_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'custom_gallery.*' => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'existing_custom_gallery' => ['nullable', 'array'],
            'stock_quantity' => ['required', 'integer', 'min:0'],
            'is_active' => ['required', 'boolean'],
        ];
    }
}
