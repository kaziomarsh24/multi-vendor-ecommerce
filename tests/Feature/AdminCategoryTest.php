<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_categories_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/categories');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_categories(): void
    {
        $customer = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($customer)->get('/admin/categories');
        $response->assertStatus(403);
    }

    public function test_admin_can_create_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->post('/admin/categories', [
            'name' => 'Laptops & Computers',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', [
            'name' => 'Laptops & Computers',
            'slug' => 'laptops-computers',
        ]);
    }

    public function test_admin_can_update_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Gadgets',
            'slug' => 'gadgets',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->put("/admin/categories/{$category->id}", [
            'name' => 'Smart Gadgets',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Smart Gadgets',
        ]);
    }

    public function test_admin_can_delete_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $category = Category::create([
            'name' => 'Old Category',
            'slug' => 'old-category',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/categories/{$category->id}");

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('categories', [
            'id' => $category->id,
        ]);
    }
}
