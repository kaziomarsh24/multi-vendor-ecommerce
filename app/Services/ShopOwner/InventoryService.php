<?php

namespace App\Services\ShopOwner;

use App\Models\Category;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\UploadedFile;
use KaziOmar\SmartUpload\Facades\Upload;

class InventoryService
{
    // Fetch shop inventory items and categories with filter support
    public function getInventory(Shop $shop, array $filters = []): array
    {
        $query = $shop->shopProducts()
            ->with(['product.category', 'product.subcategory']);

        if (! empty($filters['category'])) {
            $query->whereHas('product', function ($q) use ($filters) {
                $q->where('category_id', $filters['category']);
            });
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('custom_title', 'like', "%{$search}%")
                    ->orWhereHas('product', fn ($pq) => $pq->where('title', 'like', "%{$search}%")->orWhere('sku', 'like', "%{$search}%"));
            });
        }

        if (! empty($filters['status'])) {
            if ($filters['status'] === 'active') {
                $query->where('is_active', true);
            } elseif ($filters['status'] === 'inactive') {
                $query->where('is_active', false);
            }
        }

        $shopProducts = $query->latest('id')->paginate(10)->withQueryString();
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return [
            'shopProducts' => $shopProducts,
            'categories' => $categories,
        ];
    }

    // Update shop-specific product details and custom photos
    public function update(ShopProduct $shopProduct, array $data, ?UploadedFile $customImage = null, array $customGallery = []): ShopProduct
    {
        if ($customImage) {
            $uploaded = Upload::file($customImage)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('products/custom');
            $data['custom_thumbnail'] = $uploaded->path;
        }

        $gallery = $data['existing_custom_gallery'] ?? $shopProduct->custom_gallery ?? [];
        if (! is_array($gallery)) {
            $gallery = [];
        }

        if (! empty($customGallery)) {
            $newPaths = Upload::files($customGallery)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('products/custom/gallery')
                ->paths();

            $gallery = array_merge($gallery, $newPaths);
        }

        $data['custom_gallery'] = array_values(array_unique($gallery));
        unset($data['existing_custom_gallery'], $data['custom_image']);

        $shopProduct->update($data);

        return $shopProduct;
    }

    // Soft delete inventory item
    public function delete(ShopProduct $shopProduct): void
    {
        $shopProduct->delete();
    }
}
