<?php

namespace App\Http\Controllers\ShopOwner;

use App\Http\Controllers\Controller;
use App\Http\Requests\ShopOwner\UpdateInventoryRequest;
use App\Models\ShopProduct;
use App\Services\ShopOwner\InventoryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InventoryController extends Controller
{
    public function __construct(
        protected InventoryService $inventoryService
    ) {}

    // List inventory products belonging to authenticated shop owner
    public function index(Request $request): Response|RedirectResponse
    {
        $shop = $request->user()->shop;

        if (! $shop) {
            return redirect()->route('home')->with('error', 'No shop assigned to your account yet.');
        }

        $filters = $request->only(['category', 'search', 'status']);
        $inventoryData = $this->inventoryService->getInventory($shop, $filters);

        return Inertia::render('ShopOwner/Inventory', [
            'shop' => $shop,
            'shopProducts' => $inventoryData['shopProducts'],
            'categories' => $inventoryData['categories'],
            'filters' => $filters,
        ]);
    }

    // Update custom pricing, stock, and photos for shop product
    public function update(UpdateInventoryRequest $request, ShopProduct $shopProduct): RedirectResponse
    {
        $this->inventoryService->update(
            $shopProduct,
            $request->validated(),
            $request->file('custom_image'),
            $request->file('custom_gallery', [])
        );

        return back()->with('success', 'Product updated successfully.');
    }

    // Remove product from shop inventory
    public function destroy(Request $request, ShopProduct $shopProduct): RedirectResponse
    {
        $shop = $request->user()->shop;

        if (! $shop || $shopProduct->shop_id !== $shop->id) {
            abort(403, 'Unauthorized action for this inventory item.');
        }

        $this->inventoryService->delete($shopProduct);

        return back()->with('success', 'Product removed from your shop inventory.');
    }
}
