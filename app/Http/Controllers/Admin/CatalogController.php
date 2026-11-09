<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\Admin\CatalogService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function __construct(
        protected CatalogService $catalogService
    ) {}

    // list catalog products
    public function index(Request $request): Response
    {
        $data = $this->catalogService->getPaginatedCatalog($request);

        return Inertia::render('Admin/Catalog', [
            'products' => $data['products'],
            'categories' => $data['categories'],
            'filters' => [
                'category' => $request->query('category'),
                'search' => $request->query('search'),
            ],
        ]);
    }

    // create product form
    public function create(): Response
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return Inertia::render('Admin/ProductCreate', [
            'categories' => $categories,
        ]);
    }

    // store product with images
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $this->catalogService->store(
            $request->validated(),
            $request->file('thumbnail'),
            $request->file('gallery', []),
            $request->user()->id
        );

        return redirect()->route('admin.catalog.index')->with('success', 'Master catalog product created successfully with gallery.');
    }

    // edit product form
    public function edit(Product $product): Response
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->get();

        return Inertia::render('Admin/ProductEdit', [
            'product' => $product->load(['category', 'subcategory']),
            'categories' => $categories,
        ]);
    }

    // update product
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $this->catalogService->update(
            $product,
            $request->validated(),
            $request->file('thumbnail'),
            $request->file('gallery', [])
        );

        return redirect()->route('admin.catalog.index')->with('success', 'Master catalog product updated successfully.');
    }

    // delete product
    public function destroy(Product $product): RedirectResponse
    {
        $this->catalogService->delete($product);

        return back()->with('success', 'Product deleted from master catalog.');
    }
}
