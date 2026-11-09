<?php

namespace App\Services\ShopOwner;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use KaziOmar\SmartUpload\Facades\Upload;

class SharedCatalogService
{
    // Retrieve shared catalog products, categories, and shop attached IDs
    public function getCatalog(Shop $shop, array $filters = []): array
    {
        $query = Product::with(['category', 'subcategory', 'creator'])
            ->where('is_approved', true);

        if (! empty($filters['category'])) {
            $query->where('category_id', $filters['category']);
        }

        if (! empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $existingProductIds = $shop->shopProducts()->pluck('product_id')->toArray();
        $products = $query->latest('id')->paginate(12)->withQueryString();
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return [
            'products' => $products,
            'existingProductIds' => $existingProductIds,
            'categories' => $categories,
        ];
    }

    // Attach existing master catalog product into shop inventory
    public function attachProduct(Shop $shop, array $data): ShopProduct
    {
        return ShopProduct::updateOrCreate(
            [
                'shop_id' => $shop->id,
                'product_id' => $data['product_id'],
            ],
            [
                'custom_price' => $data['custom_price'] ?? null,
                'custom_compare_price' => $data['custom_compare_price'] ?? null,
                'stock_quantity' => $data['stock_quantity'] ?? 50,
                'is_active' => true,
            ]
        );
    }

    // Create a new product in master catalog and add it directly to shop inventory
    public function storeProduct(Shop $shop, User $user, array $data, ?UploadedFile $image = null, array $galleryFiles = []): Product
    {
        $thumbnailPath = null;
        if ($image) {
            $thumbnailPath = Upload::file($image)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('products')
                ->path;
        }

        $gallery = [];
        if (! empty($galleryFiles)) {
            $gallery = Upload::files($galleryFiles)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('products/gallery')
                ->paths();
        }

        $product = Product::create([
            'user_id' => $user->id,
            'category_id' => $data['category_id'],
            'subcategory_id' => $data['subcategory_id'] ?? null,
            'title' => $data['title'],
            'sku' => $data['sku'] ?? null,
            'base_price' => $data['base_price'],
            'compare_price' => $data['compare_price'] ?? null,
            'description' => $data['description'],
            'thumbnail' => $thumbnailPath,
            'gallery' => $gallery,
            'is_approved' => true,
        ]);

        ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'custom_price' => ! empty($data['custom_price']) ? $data['custom_price'] : $data['base_price'],
            'custom_thumbnail' => $thumbnailPath,
            'custom_gallery' => $gallery,
            'stock_quantity' => $data['stock_quantity'],
            'is_active' => true,
        ]);

        return $product;
    }

    // Update master catalog product owned by this shop owner
    public function updateProduct(Product $product, array $data, ?UploadedFile $image = null, array $galleryFiles = []): Product
    {
        if ($image) {
            $data['thumbnail'] = Upload::file($image)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('products')
                ->path;
        }

        $gallery = $data['existing_gallery'] ?? $product->gallery ?? [];
        if (! is_array($gallery)) {
            $gallery = [];
        }

        if (! empty($galleryFiles)) {
            $newPaths = Upload::files($galleryFiles)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('products/gallery')
                ->paths();

            $gallery = array_merge($gallery, $newPaths);
        }

        $data['gallery'] = array_values(array_unique($gallery));
        unset($data['existing_gallery'], $data['image']);

        $product->update($data);

        return $product;
    }
}
