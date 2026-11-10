<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class AtomicCacheTest extends TestCase
{
    use RefreshDatabase;

    public function test_updating_product_invalidates_tagged_cache(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $category = Category::create([
            'name' => 'Tablets',
            'slug' => 'tablets',
            'is_active' => true,
        ]);

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'iPad Air',
            'slug' => 'ipad-air',
            'sku' => 'IPAD-AIR-01',
            'base_price' => 70000,
            'description' => 'Apple iPad Air',
            'is_approved' => true,
        ]);

        // Put something in tagged cache
        Cache::tags(['products', 'categories'])->put('test_product_key', 'cached_data', 3600);
        $this->assertEquals('cached_data', Cache::tags(['products', 'categories'])->get('test_product_key'));

        // Update product - AutoClearsCache should fire
        $product->update(['base_price' => 75000]);

        // The cached key should be cleared
        $this->assertNull(Cache::tags(['products', 'categories'])->get('test_product_key'));
    }

    public function test_updating_shop_product_invalidates_shop_products_cache(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Cache Test Shop',
            'slug' => 'cache-test-shop',
            'is_active' => true,
        ]);

        $category = Category::create([
            'name' => 'Audio',
            'slug' => 'audio',
            'is_active' => true,
        ]);

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'AirPods Max',
            'slug' => 'airpods-max',
            'sku' => 'APM-01',
            'base_price' => 60000,
            'description' => 'Over ear headphones',
            'is_approved' => true,
        ]);

        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'stock_quantity' => 15,
            'is_active' => true,
        ]);

        Cache::tags(['shop_products', 'shops'])->put('test_shop_product_key', 'live_inventory', 3600);
        $this->assertEquals('live_inventory', Cache::tags(['shop_products', 'shops'])->get('test_shop_product_key'));

        // Update inventory
        $shopProduct->update(['stock_quantity' => 5]);

        // Key should be evicted
        $this->assertNull(Cache::tags(['shop_products', 'shops'])->get('test_shop_product_key'));
    }
}
