<?php

namespace App\Http\Controllers;

use App\Services\ProductService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function __construct(
        protected ProductService $productService
    ) {}

    // Display product details, active stocking shops, and related items
    public function show(Request $request, string $slug): Response
    {
        $data = $this->productService->getProductPageData($slug, $request->query('shop'));

        return Inertia::render('Product/Show', $data);
    }
}
