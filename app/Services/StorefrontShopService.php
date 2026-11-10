<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Shop;
use KaziOmar\AtomicCache\Traits\HasAtomicCache;

class StorefrontShopService
{
    use HasAtomicCache;

    // Aggregate shop profile, catalog items with filters, categories, and quick shop switcher
    public function getShopPageData(string $slug, array $filters = []): array
    {
        $shop = $this->getShopBySlug($slug);
        $products = $this->getShopProducts($shop, $filters);
        $categories = $this->getShopCategories($shop);
        $allShops = $this->getAllActiveShops();

        return [
            'shop' => $shop,
            'products' => $products,
            'categories' => $categories,
            'allShops' => $allShops,
            'filters' => [
                'category' => $filters['category'] ?? null,
                'search' => $filters['search'] ?? null,
                'sort' => $filters['sort'] ?? 'latest',
            ],
        ];
    }

    // Retrieve active shop by slug
    public function getShopBySlug(string $slug): Shop
    {
        $callback = fn () => Shop::where('slug', $slug)
            ->where('is_active', true)
            ->withCount('shopProducts')
            ->firstOrFail();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shops']);
    }

    // Paginated products assigned to shop with search, category, and sorting filters
    public function getShopProducts(Shop $shop, array $filters = [])
    {
        $callback = function () use ($shop, $filters) {
            $query = $shop->shopProducts()
                ->where('is_active', true)
                ->with(['product.category']);

            if (! empty($filters['category'])) {
                $query->whereHas('product.category', function ($q) use ($filters) {
                    $q->where('slug', $filters['category']);
                });
            }

            if (! empty($filters['search'])) {
                $search = $filters['search'];
                $query->where(function ($q) use ($search) {
                    $q->where('custom_title', 'like', "%{$search}%")
                        ->orWhereHas('product', fn ($pq) => $pq->where('title', 'like', "%{$search}%"));
                });
            }

            $sort = $filters['sort'] ?? 'latest';
            if ($sort === 'price_low') {
                $query->orderByRaw('COALESCE(custom_price, (SELECT base_price FROM products WHERE products.id = shop_products.product_id)) ASC');
            } elseif ($sort === 'price_high') {
                $query->orderByRaw('COALESCE(custom_price, (SELECT base_price FROM products WHERE products.id = shop_products.product_id)) DESC');
            } else {
                $query->latest('id');
            }

            return $query->paginate(12)->withQueryString();
        };

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shop_products', 'products', 'shops']);
    }

    // Categories that have active products assigned to this shop
    public function getShopCategories(Shop $shop)
    {
        $callback = fn () => Category::whereHas('products.shopProducts', function ($q) use ($shop) {
            $q->where('shop_id', $shop->id)->where('is_active', true);
        })->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['categories', 'shop_products']);
    }

    // All active shops for the storefront shop switcher
    public function getAllActiveShops()
    {
        $callback = fn () => Shop::where('is_active', true)->select('id', 'name', 'slug')->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shops']);
    }
}
