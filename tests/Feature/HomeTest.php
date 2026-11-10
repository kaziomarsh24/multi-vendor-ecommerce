<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeTest extends TestCase
{
    use RefreshDatabase;

    public function test_home_page_renders_successfully(): void
    {
        $category = Category::create([
            'name' => 'Smartphones',
            'slug' => 'smartphones',
            'is_active' => true,
        ]);

        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Tech Point',
            'slug' => 'tech-point',
            'is_active' => true,
        ]);

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'iPhone 15 Pro',
            'slug' => 'iphone-15-pro',
            'sku' => 'IP-15-PRO',
            'base_price' => 1200,
            'description' => 'Flagship smartphone',
            'is_approved' => true,
        ]);

        ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $response = $this->get(route('home'));
        $response->assertStatus(200);
    }

    public function test_home_page_search_filters_products_by_keyword_and_category(): void
    {
        $category = Category::create([
            'name' => 'Laptops',
            'slug' => 'laptops',
            'is_active' => true,
        ]);

        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Gadget Star',
            'slug' => 'gadget-star',
            'is_active' => true,
        ]);

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'MacBook Pro M3',
            'slug' => 'macbook-pro-m3',
            'sku' => 'MBP-M3',
            'base_price' => 2000,
            'is_approved' => true,
        ]);

        ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        // Matching query
        $response = $this->get('/?search=MacBook');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('searchResults', 1)
            ->where('searchQuery', 'MacBook')
        );

        // Matching category
        $catResponse = $this->get("/?category={$category->id}");
        $catResponse->assertStatus(200);
        $catResponse->assertInertia(fn ($page) => $page
            ->has('searchResults', 1)
        );

        // Non-matching query
        $nonMatchResponse = $this->get('/?search=UnknownGadget');
        $nonMatchResponse->assertStatus(200);
        $nonMatchResponse->assertInertia(fn ($page) => $page
            ->has('searchResults', 0)
        );
    }
}
