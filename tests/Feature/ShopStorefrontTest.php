<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopStorefrontTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_active_shop_page(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Gadget Galaxy',
            'slug' => 'gadget-galaxy',
            'is_active' => true,
        ]);

        $category = Category::create(['name' => 'Wearables', 'slug' => 'wearables', 'is_active' => true]);
        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Fitness Band',
            'slug' => 'fitness-band',
            'sku' => 'FB-01',
            'base_price' => 50,
            'description' => 'Fitness smart band',
            'is_approved' => true,
        ]);

        ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'stock_quantity' => 12,
            'is_active' => true,
        ]);

        $response = $this->get(route('shops.show', $shop->slug));
        $response->assertStatus(200);
    }

    public function test_cannot_view_inactive_shop(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Closed Store',
            'slug' => 'closed-store',
            'is_active' => false,
        ]);

        $response = $this->get(route('shops.show', $shop->slug));
        $response->assertStatus(404);
    }
}
