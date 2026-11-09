<?php

namespace App\Services\Admin;

use App\Models\Category;
use Illuminate\Http\UploadedFile;
use KaziOmar\SmartUpload\Facades\Upload;

class CategoryService
{
    // list parent categories and subcategories
    public function getCategoryList(): array
    {
        $parentCategories = Category::whereNull('parent_id')
            ->withCount(['products', 'children'])
            ->with(['children' => fn ($q) => $q->withCount('products')])
            ->get();

        $subcategories = Category::whereNotNull('parent_id')
            ->with('parent')
            ->withCount('products')
            ->latest('id')
            ->get();

        return [
            'parentCategories' => $parentCategories,
            'subcategories' => $subcategories,
        ];
    }

    // create new category or subcategory
    public function createCategory(array $data, ?UploadedFile $iconFile = null): Category
    {
        if ($iconFile) {
            $data['icon'] = Upload::file($iconFile)
                ->scaleDown(400)
                ->save('categories')
                ->path;
        }

        return Category::create([
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? null,
            'icon' => $data['icon'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    // update category and replace icon
    public function updateCategory(Category $category, array $data, ?UploadedFile $iconFile = null): Category
    {
        if ($iconFile) {
            $data['icon'] = Upload::file($iconFile)
                ->scaleDown(400)
                ->save('categories')
                ->path;
        } else {
            unset($data['icon']);
        }

        $category->update([
            'parent_id' => $data['parent_id'] ?? null,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? null,
            'icon' => $data['icon'] ?? $category->icon,
            'is_active' => $data['is_active'] ?? $category->is_active,
        ]);

        return $category;
    }

    // delete category if no products or subcategories exist
    public function deleteCategory(Category $category): void
    {
        if ($category->products()->exists()) {
            throw new \DomainException('Cannot delete this category because it contains active products.');
        }

        if ($category->children()->exists()) {
            throw new \DomainException('Cannot delete a parent category that has subcategories. Remove the subcategories first.');
        }

        $category->delete();
    }
}
