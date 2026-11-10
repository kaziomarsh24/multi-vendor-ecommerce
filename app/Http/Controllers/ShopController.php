<?php

namespace App\Http\Controllers;

use App\Services\StorefrontShopService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShopController extends Controller
{
    public function __construct(
        protected StorefrontShopService $shopService
    ) {}

    // Display shop profile, assigned inventory with filters, and category lists
    public function show(Request $request, string $slug): Response
    {
        $filters = $request->only(['category', 'search', 'sort']);
        $data = $this->shopService->getShopPageData($slug, $filters);

        return Inertia::render('Shop/Show', $data);
    }
}
