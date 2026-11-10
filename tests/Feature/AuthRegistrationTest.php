<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_user_can_register_as_customer_and_redirect_home(): void
    {
        $response = $this->post('/register', [
            'name' => 'Demo Customer',
            'email' => 'customer_new@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertRedirect('/dashboard');
        $this->assertAuthenticated();

        $user = User::where('email', 'customer_new@example.com')->first();
        $this->assertNotNull($user);
        $this->assertSame('customer', $user->role->value);

        // Dashboard redirects customer to storefront home
        $dashResponse = $this->actingAs($user)->get('/dashboard');
        $dashResponse->assertRedirect(route('home'));
    }

    public function test_shop_owner_without_assigned_shop_redirects_safely_to_home(): void
    {
        $owner = User::factory()->create(['role' => 'shop_owner']);

        $response = $this->actingAs($owner)->get('/dashboard');
        $response->assertRedirect(route('home'));

        $invResponse = $this->actingAs($owner)->get('/owner/inventory');
        $invResponse->assertRedirect(route('home'));
    }
}
