<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShopOwnerTest extends TestCase
{
    use RefreshDatabase;

    private function createShopForOwner(User $owner): Shop
    {
        return Shop::create([
            'user_id' => $owner->id,
            'name' => 'Gadget Hub',
            'slug' => 'gadget-hub-'.uniqid(),
            'is_active' => true,
        ]);
    }

    private function createCategory(): Category
    {
        return Category::create([
            'name' => 'Audio',
            'slug' => 'audio-'.uniqid(),
            'is_active' => true,
        ]);
    }

    public function test_shop_owner_can_view_inventory(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $this->createShopForOwner($owner);

        $response = $this->actingAs($owner)->get(route('owner.inventory.index'));
        $response->assertStatus(200);
    }

    public function test_shop_owner_can_attach_product_from_catalog(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = $this->createShopForOwner($owner);
        $category = $this->createCategory();

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Wireless Headphones',
            'slug' => 'wireless-headphones-'.uniqid(),
            'sku' => 'WH-'.uniqid(),
            'base_price' => 150,
            'description' => 'Noise cancelling headphones',
            'is_approved' => true,
        ]);

        $response = $this->actingAs($owner)->post(route('owner.catalog.attach'), [
            'product_id' => $product->id,
            'custom_price' => 120,
            'stock_quantity' => 15,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'custom_price' => 120,
            'stock_quantity' => 15,
        ]);
    }

    public function test_shop_owner_can_create_new_catalog_product(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = $this->createShopForOwner($owner);
        $category = $this->createCategory();

        $response = $this->actingAs($owner)->post('/owner/catalog', [
            'category_id' => $category->id,
            'title' => 'Brand New Gadget',
            'base_price' => 250,
            'description' => 'Innovative gadget',
            'stock_quantity' => 30,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('products', [
            'title' => 'Brand New Gadget',
        ]);
        $this->assertDatabaseHas('shop_products', [
            'shop_id' => $shop->id,
            'stock_quantity' => 30,
        ]);
    }

    public function test_shop_owner_can_update_inventory_pricing(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = $this->createShopForOwner($owner);
        $category = $this->createCategory();

        $product = Product::create([
            'user_id' => $owner->id,
            'category_id' => $category->id,
            'title' => 'Gaming Mouse',
            'slug' => 'gaming-mouse-'.uniqid(),
            'sku' => 'GM-'.uniqid(),
            'base_price' => 80,
            'description' => 'Precision sensor mouse',
            'is_approved' => true,
        ]);

        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'custom_price' => 100,
            'stock_quantity' => 10,
            'is_active' => true,
        ]);

        $response = $this->actingAs($owner)->put(route('owner.inventory.update', $shopProduct), [
            'custom_price' => 140,
            'stock_quantity' => 20,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('shop_products', [
            'id' => $shopProduct->id,
            'custom_price' => 140,
            'stock_quantity' => 20,
        ]);
    }

    public function test_unauthorized_user_cannot_update_another_shop_inventory(): void
    {
        $owner1 = User::factory()->create(['role' => 'shop_owner']);
        $shop1 = $this->createShopForOwner($owner1);

        $owner2 = User::factory()->create(['role' => 'shop_owner']);
        $this->createShopForOwner($owner2);

        $category = $this->createCategory();
        $product = Product::create([
            'user_id' => $owner1->id,
            'category_id' => $category->id,
            'title' => 'Smart Watch',
            'slug' => 'smart-watch-'.uniqid(),
            'sku' => 'SW-'.uniqid(),
            'base_price' => 200,
            'description' => 'Fitness tracking watch',
            'is_approved' => true,
        ]);

        $shopProduct1 = ShopProduct::create([
            'shop_id' => $shop1->id,
            'product_id' => $product->id,
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $response = $this->actingAs($owner2)->put(route('owner.inventory.update', $shopProduct1), [
            'custom_price' => 250,
            'stock_quantity' => 5,
            'is_active' => true,
        ]);

        $response->assertStatus(403);
    }
}
