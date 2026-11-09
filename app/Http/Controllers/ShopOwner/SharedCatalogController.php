<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\AttachProductRequest;
use App\Http\Requests\ShopOwner\StoreSharedProductRequest;
use App\Http\Requests\ShopOwner\UpdateSharedProductRequest;
use App\Models\Product;
use App\Services\ShopOwner\SharedCatalogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SharedCatalogController extends Controller
{
    public function __construct(
        protected SharedCatalogService $catalogService
    ) {}

    // Browse master catalog and view which products are already attached
    public function index(Request $request): Response|RedirectResponse
    {
        $shop = $request->user()->shop;

        if (! $shop) {
            return redirect()->route('home')->with('error', 'No shop assigned to your account yet.');
        }

        $filters = $request->only(['category', 'search']);
        $catalogData = $this->catalogService->getCatalog($shop, $filters);

        return Inertia::render('ShopOwner/SharedCatalog', [
            'shop' => $shop,
            'products' => $catalogData['products'],
            'existingProductIds' => $catalogData['existingProductIds'],
            'categories' => $catalogData['categories'],
            'filters' => $filters,
        ]);
    }

    // Attach master catalog product to shop inventory
    public function attach(AttachProductRequest $request): RedirectResponse
    {
        $shop = $request->user()->shop;
        $this->catalogService->attachProduct($shop, $request->validated());

        return back()->with('success', 'Product has been added to your shop inventory.');
    }

    // Create a new master catalog product and attach it to shop
    public function storeNew(StoreSharedProductRequest $request): RedirectResponse
    {
        $shop = $request->user()->shop;

        $this->catalogService->storeProduct(
            $shop,
            $request->user(),
            $request->validated(),
            $request->file('image'),
            $request->file('gallery', [])
        );

        return back()->with('success', 'Product created and added to your shop inventory.');
    }

    // Edit master catalog product owned by current shop owner
    public function updateMaster(UpdateSharedProductRequest $request, Product $product): RedirectResponse
    {
        $this->catalogService->updateProduct(
            $product,
            $request->validated(),
            $request->file('image'),
            $request->file('gallery', [])
        );

        return back()->with('success', 'Product updated successfully.');
    }
}
