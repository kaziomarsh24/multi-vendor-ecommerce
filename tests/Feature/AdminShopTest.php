<?php

namespace Tests\Feature;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminShopTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_view_shops_page(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin)->get('/admin/shops');
        $response->assertStatus(200);
    }

    public function test_non_admin_cannot_access_shops_page(): void
    {
        $shopOwner = User::factory()->create(['role' => 'shop_owner']);

        $response = $this->actingAs($shopOwner)->get('/admin/shops');
        $response->assertStatus(403);
    }

    public function test_admin_can_register_shop_with_existing_owner(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $owner = User::factory()->create(['role' => 'customer']);

        $response = $this->actingAs($admin)->post('/admin/shops', [
            'name' => 'Mirpur Digital Store',
            'user_id' => $owner->id,
            'email' => 'contact@mirpurdigital.com',
            'phone' => '+880 1700-000000',
            'address' => 'Mirpur 10, Dhaka',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('shops', [
            'name' => 'Mirpur Digital Store',
            'slug' => 'mirpur-digital-store',
            'user_id' => $owner->id,
        ]);

        $this->assertSame('shop_owner', $owner->fresh()->role->value);
    }

    public function test_admin_can_update_shop(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Old Shop Name',
            'slug' => 'old-shop-name',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->put("/admin/shops/{$shop->id}", [
            'name' => 'Updated Shop Name',
            'user_id' => $owner->id,
            'email' => 'updated@shop.com',
            'phone' => '+880 1711-111111',
            'is_active' => true,
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('shops', [
            'id' => $shop->id,
            'name' => 'Updated Shop Name',
        ]);
    }

    public function test_admin_can_delete_shop(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $owner = User::factory()->create(['role' => 'shop_owner']);
        $shop = Shop::create([
            'user_id' => $owner->id,
            'name' => 'Shop To Delete',
            'slug' => 'shop-to-delete',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->delete("/admin/shops/{$shop->id}");

        $response->assertSessionHasNoErrors();
        $this->assertSoftDeleted('shops', [
            'id' => $shop->id,
        ]);
    }
}
