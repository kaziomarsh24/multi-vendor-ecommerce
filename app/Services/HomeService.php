<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Shop;
use App\Models\ShopProduct;
use KaziOmar\AtomicCache\Traits\HasAtomicCache;

class HomeService
{
    use HasAtomicCache;

    // Retrieve home page data composed of individual cached sections
    public function getHomeData(?string $search = null, ?string $categoryId = null): array
    {
        $heroDeals = $this->getHeroDeals();

        $data = [
            'heroFeatured' => $heroDeals['featured'] ?? null,
            'heroPromos' => $heroDeals['promos'] ?? [],
            'categories' => $this->getAllCategories(),
            'shops' => $this->getFeaturedShops(),
            'newArrivals' => $this->getNewArrivals(),
            'bestSellers' => $this->getBestSellers(),
        ];

        if ($search !== null || ($categoryId && $categoryId !== '0')) {
            $data['searchResults'] = $this->searchProducts($search, $categoryId);
            $data['searchQuery'] = $search;
        }

        return $data;
    }

    // Search active shop products purely by title/keyword and category
    public function searchProducts(?string $search, ?string $categoryId = null)
    {
        return ShopProduct::query()
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereHas('shop', fn ($q) => $q->where('is_active', true))
            ->whereHas('product')
            ->when($search, function ($q, $search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('title', 'like', "%{$search}%")
                        ->orWhereHas('product', fn ($pq) => $pq->where('title', 'like', "%{$search}%"));
                });
            })
            ->when($categoryId && $categoryId !== '0', function ($q, $categoryId) {
                $q->whereHas('product', function ($pq) use ($categoryId) {
                    $pq->where('category_id', $categoryId)
                        ->orWhereHas('category', fn ($cq) => $cq->where('parent_id', $categoryId));
                });
            })
            ->with(['product.category', 'shop'])
            ->latest()
            ->get();
    }

    // Top discount deals for hero showcase banner
    public function getHeroDeals(): array
    {
        $callback = function () {
            $items = ShopProduct::query()
                ->where('is_active', true)
                ->where('stock_quantity', '>', 0)
                ->whereHas('shop', fn ($q) => $q->where('is_active', true))
                ->whereHas('product')
                ->with(['product.category', 'shop'])
                ->get();

            $discounted = $items->filter(fn ($sp) => $sp->display_compare_price && $sp->display_compare_price > $sp->display_price)
                ->sortByDesc(fn ($sp) => (($sp->display_compare_price - $sp->display_price) / $sp->display_compare_price))
                ->values();

            $pool = $discounted->concat($items->reject(fn ($sp) => $discounted->contains('id', $sp->id)))->values();

            return [
                'featured' => $pool->first(),
                'promos' => $pool->slice(1, 2)->values(),
            ];
        };

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shop_products', 'products', 'shops']);
    }

    // Active categories with products count
    public function getAllCategories()
    {
        $callback = fn () => Category::withCount('products')
            ->where('is_active', true)
            ->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['categories']);
    }

    // Active shops with assigned products count
    public function getFeaturedShops()
    {
        $callback = fn () => Shop::where('is_active', true)
            ->withCount('shopProducts')
            ->orderBy('id')
            ->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shops']);
    }

    // Latest active stock products from active shops
    public function getNewArrivals()
    {
        $callback = fn () => ShopProduct::query()
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereHas('shop', fn ($q) => $q->where('is_active', true))
            ->whereHas('product')
            ->with(['product.category', 'shop'])
            ->latest('id')
            ->take(8)
            ->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shop_products', 'products', 'shops']);
    }

    // Top selling active stock products from active shops
    public function getBestSellers()
    {
        $callback = fn () => ShopProduct::query()
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereHas('shop', fn ($q) => $q->where('is_active', true))
            ->whereHas('product')
            ->with(['product.category', 'shop'])
            ->orderBy('id', 'asc')
            ->take(6)
            ->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shop_products', 'products', 'shops']);
    }
}
