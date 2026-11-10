<?php

use App\Http\Controllers\Admin\CatalogController as AdminCatalogController;
use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ShopController as AdminShopController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopController;
use App\Http\Controllers\ShopOwner\InventoryController as OwnerInventoryController;
use App\Http\Controllers\ShopOwner\SharedCatalogController as OwnerSharedCatalogController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Storefront Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shops/{slug}', [ShopController::class, 'show'])->name('shops.show');
Route::get('/products/{slug}', [ProductController::class, 'show'])->name('products.show');

/*
|--------------------------------------------------------------------------
| Authenticated Redirection
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', function (Request $request) {
        $user = $request->user();
        if ($user->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }
        if ($user->isShopOwner()) {
            if ($user->shop) {
                return redirect()->route('owner.inventory.index');
            }

            return redirect()->route('home')->with('info', 'Your shop owner account is awaiting shop assignment by an administrator.');
        }

        return redirect()->route('home');
    })->name('dashboard');
});

/*
|--------------------------------------------------------------------------
| Shop Owner Portal Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:shop_owner'])
    ->prefix('owner')
    ->name('owner.')
    ->group(function () {
        // Inventory Management
        Route::get('/inventory', [OwnerInventoryController::class, 'index'])->name('inventory.index');
        Route::match(['put', 'post'], '/inventory/{shopProduct}', [OwnerInventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{shopProduct}', [OwnerInventoryController::class, 'destroy'])->name('inventory.destroy');

        // Shared Catalog & Add to Shop
        Route::get('/catalog', [OwnerSharedCatalogController::class, 'index'])->name('catalog.index');
        Route::post('/catalog/attach', [OwnerSharedCatalogController::class, 'attach'])->name('catalog.attach');
        Route::post('/products/create', [OwnerSharedCatalogController::class, 'storeNew'])->name('products.storeNew');
        Route::match(['put', 'post'], '/products/{product}', [OwnerSharedCatalogController::class, 'updateMaster'])->name('products.updateMaster');
    });

/*
|--------------------------------------------------------------------------
| Admin Portal Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        // Shop Management
        Route::resource('shops', AdminShopController::class)->except(['show', 'edit']);

        // Master Catalog Management
        Route::resource('catalog', AdminCatalogController::class)
            ->except(['show'])
            ->parameters(['catalog' => 'product']);

        // Category Management
        Route::resource('categories', AdminCategoryController::class)->except(['create', 'show', 'edit']);
    });

require __DIR__.'/settings.php';
