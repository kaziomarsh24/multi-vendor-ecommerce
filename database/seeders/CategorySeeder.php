<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use KaziOmar\SmartUpload\Facades\Upload;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Smartphones & Tablets',
                'slug' => 'smartphones-tablets',
                'image' => 'images/categories/categories-01.png',
                'children' => [
                    [
                        'name' => 'Flagship Smartphones',
                        'slug' => 'flagship-smartphones',
                        'image' => 'images/categories/categories-01.png',
                    ],
                    [
                        'name' => 'Tablets & iPads',
                        'slug' => 'tablets-ipads',
                        'image' => 'images/categories/categories-02.png',
                    ],
                ],
            ],
            [
                'name' => 'Laptops & Computers',
                'slug' => 'laptops-computers',
                'image' => 'images/categories/categories-02.png',
                'children' => [
                    [
                        'name' => 'MacBooks',
                        'slug' => 'macbooks',
                        'image' => 'images/categories/categories-02.png',
                    ],
                    [
                        'name' => 'Desktops & All-in-Ones',
                        'slug' => 'desktops',
                        'image' => 'images/categories/categories-05.png',
                    ],
                    [
                        'name' => 'Keyboards & Mice',
                        'slug' => 'keyboards-mice',
                        'image' => 'images/categories/categories-06.png',
                    ],
                ],
            ],
            [
                'name' => 'Audio & Sound',
                'slug' => 'audio-sound',
                'image' => 'images/categories/categories-03.png',
                'children' => [
                    [
                        'name' => 'Wireless Headphones',
                        'slug' => 'wireless-headphones',
                        'image' => 'images/categories/categories-03.png',
                    ],
                    [
                        'name' => 'Bluetooth Speakers',
                        'slug' => 'bluetooth-speakers',
                        'image' => 'images/categories/categories-04.png',
                    ],
                ],
            ],
            [
                'name' => 'Wearables & Gadgets',
                'slug' => 'wearables',
                'image' => 'images/categories/categories-04.png',
                'children' => [
                    [
                        'name' => 'Smartwatches',
                        'slug' => 'smartwatches',
                        'image' => 'images/categories/categories-04.png',
                    ],
                ],
            ],
        ];

        foreach ($categories as $catData) {
            $children = $catData['children'] ?? [];
            $iconPath = $this->uploadImage($catData['image']);

            $parent = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                [
                    'name' => $catData['name'],
                    'icon' => $iconPath,
                    'parent_id' => null,
                ]
            );

            foreach ($children as $childData) {
                $childIcon = $this->uploadImage($childData['image']);

                Category::updateOrCreate(
                    ['slug' => $childData['slug']],
                    [
                        'name' => $childData['name'],
                        'icon' => $childIcon,
                        'parent_id' => $parent->id,
                    ]
                );
            }
        }
    }

    protected function uploadImage(string $relativePath): ?string
    {
        $fullPath = public_path($relativePath);
        if (! file_exists($fullPath)) {
            return null;
        }

        try {
            return Upload::file($fullPath)
                ->scaleDown(400)
                ->save('categories')
                ->path;
        } catch (\Throwable) {
            return $relativePath;
        }
    }
}
