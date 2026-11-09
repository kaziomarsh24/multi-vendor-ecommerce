<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreShopRequest;
use App\Http\Requests\Admin\UpdateShopRequest;
use App\Models\Shop;
use App\Services\Admin\ShopService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function __construct(
        protected ShopService $shopService
    ) {}

    // list shops
    public function index(Request $request): Response
    {
        $shops = $this->shopService->getPaginatedShops($request);
        $availableOwners = $this->shopService->getAvailableOwners();

        return Inertia::render('Admin/Shops', [
            'shops' => $shops,
            'availableOwners' => $availableOwners,
            'filters' => [
                'search' => $request->query('search'),
            ],
        ]);
    }

    // create shop form
    public function create(): Response
    {
        $availableOwners = $this->shopService->getAvailableOwners();

        return Inertia::render('Admin/ShopCreate', [
            'availableOwners' => $availableOwners,
        ]);
    }

    // store new shop
    public function store(StoreShopRequest $request): RedirectResponse
    {
        $this->shopService->createShop(
            $request->validated(),
            $request->file('logo'),
            $request->file('banner')
        );

        return redirect()->route('admin.shops.index')->with('success', 'Merchant shop registered successfully.');
    }

    // update shop details
    public function update(UpdateShopRequest $request, Shop $shop): RedirectResponse
    {
        $this->shopService->updateShop(
            $shop,
            $request->validated(),
            $request->file('logo'),
            $request->file('banner')
        );

        return back()->with('success', 'Shop updated successfully.');
    }

    // delete shop
    public function destroy(Shop $shop): RedirectResponse
    {
        $this->shopService->deleteShop($shop);

        return back()->with('success', 'Shop deleted successfully.');
    }
}
