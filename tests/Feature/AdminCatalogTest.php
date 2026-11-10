<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminCatalogTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_master_catalog(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/catalog');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_admin_catalog(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer)->get('/admin/catalog');
        $response->assertStatus(403);
    }

    public function test_admin_can_create_catalog_product_with_image(): void
    {
        Storage::fake('public');

        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Audio',
            'slug' => 'audio',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/catalog', [
            'category_id' => $category->id,
            'title' => 'Sony Noise Canceling Headphones',
            'sku' => 'SNY-WH1000',
            'base_price' => 35000,
            'compare_price' => 40000,
            'description' => 'Industry-leading noise canceling',
            'thumbnail' => UploadedFile::fake()->image('headphones.webp', 600, 600),
            'is_approved' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('products', [
            'title' => 'Sony Noise Canceling Headphones',
            'sku' => 'SNY-WH1000',
            'base_price' => 35000,
        ]);
    }

    public function test_admin_can_update_catalog_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Audio',
            'slug' => 'audio',
            'is_active' => true,
        ]);
        $product = Product::create([
            'user_id' => $admin->id,
            'category_id' => $category->id,
            'title' => 'Initial Title',
            'slug' => 'initial-title',
            'sku' => 'INIT-001',
            'base_price' => 10000,
            'description' => 'Initial Description',
            'is_approved' => true,
        ]);

        $response = $this->actingAs($admin)->put("/admin/catalog/{$product->id}", [
            'category_id' => $category->id,
            'title' => 'Updated Master Title',
            'slug' => 'initial-title',
            'sku' => 'INIT-001',
            'base_price' => 12000,
            'compare_price' => 15000,
            'description' => 'Updated Description',
            'is_approved' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Updated Master Title',
            'base_price' => 12000,
        ]);
    }

    public function test_admin_can_delete_catalog_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Audio',
            'slug' => 'audio',
            'is_active' => true,
        ]);
        $product = Product::create([
            'user_id' => $admin->id,
            'category_id' => $category->id,
            'title' => 'Product to Delete',
            'slug' => 'product-to-delete',
            'sku' => 'DEL-001',
            'base_price' => 5000,
            'description' => 'To be deleted',
            'is_approved' => true,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/catalog/{$product->id}");

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('products', [
            'id' => $product->id,
        ]);
    }
}
