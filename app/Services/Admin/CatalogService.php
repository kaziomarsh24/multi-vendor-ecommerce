<?php

namespace App\Services\Admin;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use KaziOmar\SmartUpload\Facades\Upload;

class CatalogService
{
    // thumb size for product cards
    protected array $imageVariants = [
        'thumb' => ['fit' => [150, 150]],
    ];

    // get catalog products and categories for admin list
    public function getPaginatedCatalog(Request $request): array
    {
        $query = Product::with(['category', 'subcategory', 'creator'])
            ->withCount('shopProducts');

        if ($request->filled('category')) {
            $query->where('category_id', $request->query('category'));
        }

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return [
            'products' => $query->latest('id')->paginate(10)->withQueryString(),
            'categories' => Category::whereNull('parent_id')->with('children')->get(),
        ];
    }

    // save new product with thumbnail and gallery
    public function store(array $validated, UploadedFile $thumbnail, array $galleryFiles = [], int $userId = 1): Product
    {
        $validated['user_id'] = $userId;

        // upload product thumbnail
        $upload = Upload::file($thumbnail)
            ->variants($this->imageVariants)
            ->save('products');

        $validated['thumbnail'] = $upload->path;

        // upload extra gallery photos if exists
        if (! empty($galleryFiles)) {
            $galleryCollection = Upload::files($galleryFiles)
                ->variants($this->imageVariants)
                ->save('products/gallery');

            $validated['gallery'] = $galleryCollection->paths();
        } else {
            $validated['gallery'] = [];
        }

        return Product::create([
            'user_id' => $userId,
            'category_id' => $validated['category_id'],
            'subcategory_id' => $validated['subcategory_id'] ?? null,
            'title' => $validated['title'],
            'slug' => $validated['slug'] ?? null,
            'sku' => $validated['sku'] ?? null,
            'base_price' => $validated['base_price'],
            'compare_price' => $validated['compare_price'] ?? null,
            'description' => $validated['description'],
            'thumbnail' => $validated['thumbnail'],
            'gallery' => $validated['gallery'],
            'is_approved' => $validated['is_approved'] ?? true,
        ]);
    }

    // update product details and images
    public function update(Product $product, array $validated, ?UploadedFile $thumbnail = null, array $galleryFiles = []): Product
    {
        // upload new thumbnail if selected
        if ($thumbnail) {
            $validated['thumbnail'] = Upload::file($thumbnail)
                ->variants($this->imageVariants)
                ->save('products')->path;
        }

        // keep existing selected gallery images
        $gallery = $validated['existing_gallery'] ?? $product->gallery ?? [];

        // upload new gallery photos if selected
        if (! empty($galleryFiles)) {
            $uploaded = Upload::files($galleryFiles)
                ->variants($this->imageVariants)
                ->save('products/gallery');

            $gallery = array_merge($gallery, $uploaded->paths());
        }

        $validated['gallery'] = array_values($gallery);

        // HasUploadPurge automatically diffs and deletes removed gallery images & variants
        $product->update($validated);

        return $product;
    }

    // delete product from catalog
    public function delete(Product $product): bool
    {
        return (bool) $product->delete();
    }
}
