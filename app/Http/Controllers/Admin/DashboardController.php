<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_shops' => Shop::count(),
            'active_shops' => Shop::where('is_active', true)->count(),
            'total_catalog_products' => Product::count(),
            'total_shop_products' => ShopProduct::count(),
            'total_categories' => Category::count(),
            'total_shop_owners' => User::where('role', UserRole::SHOP_OWNER)->count(),
            'total_customers' => User::where('role', UserRole::CUSTOMER)->count(),
        ];

        $recentShops = Shop::with('owner')->withCount('shopProducts')->latest('id')->take(5)->get();
        $recentProducts = Product::with(['category', 'subcategory', 'creator'])->withCount('shopProducts')->latest('id')->take(5)->get();
        $recentUsers = User::with('shop')->latest('id')->take(8)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentShops' => $recentShops,
            'recentProducts' => $recentProducts,
            'recentUsers' => $recentUsers,
        ]);
    }
}
