<?php

namespace App\Services;

use App\Models\Product;
use App\Models\ShopProduct;
use KaziOmar\AtomicCache\Traits\HasAtomicCache;

class ProductService
{
    use HasAtomicCache;

    // Aggregate product, stocking shops, active shop selection, and related items
    public function getProductPageData(string $slug, ?string $selectedShopSlug = null): array
    {
        $product = $this->getProductBySlug($slug);
        $stockingShops = $this->getStockingShops($product->id);

        $selectedShopProduct = null;
        if ($selectedShopSlug) {
            $selectedShopProduct = $stockingShops->firstWhere('shop.slug', $selectedShopSlug);
        }

        if (! $selectedShopProduct && $stockingShops->count() === 1) {
            $selectedShopProduct = $stockingShops->first();
        }

        $relatedProducts = $this->getRelatedProducts($product->category_id, $product->id);

        return [
            'product' => $product,
            'stockingShops' => $stockingShops,
            'selectedShopProduct' => $selectedShopProduct,
            'relatedProducts' => $relatedProducts,
        ];
    }

    // Master product stocked by at least one active shop
    public function getProductBySlug(string $slug): Product
    {
        $callback = fn () => Product::where('slug', $slug)
            ->whereHas('shopProducts', function ($q) {
                $q->where('is_active', true)
                    ->where('stock_quantity', '>', 0)
                    ->whereHas('shop', fn ($sq) => $sq->where('is_active', true));
            })
            ->with(['category', 'subcategory', 'creator'])
            ->firstOrFail();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['products', 'shop_products', 'shops']);
    }

    // Active shops currently stocking this product
    public function getStockingShops(int $productId)
    {
        $callback = fn () => ShopProduct::query()
            ->where('product_id', $productId)
            ->where('is_active', true)
            ->where('stock_quantity', '>', 0)
            ->whereHas('shop', fn ($q) => $q->where('is_active', true))
            ->with('shop')
            ->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['shop_products', 'shops']);
    }

    // Related active products in the same category
    public function getRelatedProducts(int $categoryId, int $currentProductId)
    {
        $callback = fn () => Product::where('category_id', $categoryId)
            ->where('id', '!=', $currentProductId)
            ->whereHas('shopProducts', function ($q) {
                $q->where('is_active', true)
                    ->where('stock_quantity', '>', 0)
                    ->whereHas('shop', fn ($sq) => $sq->where('is_active', true));
            })
            ->with(['category', 'shopProducts.shop'])
            ->take(4)
            ->get();

        return $this->cache(__FUNCTION__, func_get_args(), $callback, ttl: 3600, perUserOrTags: ['products', 'shop_products', 'categories', 'shops']);
    }
}
