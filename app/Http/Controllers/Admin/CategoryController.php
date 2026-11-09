<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\Category;
use App\Services\Admin\CategoryService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function __construct(
        protected CategoryService $categoryService
    ) {}

    // list parent categories and subcategories
    public function index(): Response
    {
        $categories = $this->categoryService->getCategoryList();

        return Inertia::render('Admin/Categories', [
            'parentCategories' => $categories['parentCategories'],
            'subcategories' => $categories['subcategories'],
        ]);
    }

    // save category or subcategory
    public function store(CategoryRequest $request): RedirectResponse
    {
        $category = $this->categoryService->createCategory(
            $request->validated(),
            $request->file('icon')
        );

        $message = $category->parent_id
            ? 'Subcategory created successfully.'
            : 'Category created successfully.';

        return back()->with('success', $message);
    }

    // update category details and icon
    public function update(CategoryRequest $request, Category $category): RedirectResponse
    {
        $this->categoryService->updateCategory(
            $category,
            $request->validated(),
            $request->file('icon')
        );

        return back()->with('success', 'Category updated successfully.');
    }

    // delete category if not in use
    public function destroy(Category $category): RedirectResponse
    {
        try {
            $this->categoryService->deleteCategory($category);

            return back()->with('success', 'Category deleted successfully.');
        } catch (\DomainException $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
