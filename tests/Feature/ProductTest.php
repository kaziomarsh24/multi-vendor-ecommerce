<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_view_stocked_product(): void
    {
        $category = Category::create(['name' => 'Audio', 'slug' => 'audio', 'is_active' => true]);
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Sound Hub',
            'slug' => 'sound-hub',
            'is_active' => true,
        ]);

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Studio Headphones',
            'slug' => 'studio-headphones',
            'sku' => 'SH-100',
            'base_price' => 300,
            'description' => 'Pro audio headphones',
            'is_approved' => true,
        ]);

        ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'custom_price' => 280,
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $response = $this->get(route('products.show', $product->slug));
        $response->assertStatus(200);
    }

    public function test_cannot_view_unassigned_product_on_storefront(): void
    {
        $category = Category::create(['name' => 'Audio', 'slug' => 'audio', 'is_active' => true]);
        $owner = User::factory()->create(['role' => 'shop_owner']);

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Draft Headset',
            'slug' => 'draft-headset',
            'sku' => 'DH-100',
            'base_price' => 200,
            'description' => 'Unassigned product',
            'is_approved' => true,
        ]);

        $response = $this->get(route('products.show', $product->slug));
        $response->assertStatus(404);
    }
}
