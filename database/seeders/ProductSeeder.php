<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use KaziOmar\SmartUpload\Facades\Upload;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        if (! $admin) {
            return;
        }

        $products = [
            [
                'sku' => 'SAM-S24U-256-BLU',
                'category_slug' => 'flagship-smartphones',
                'title' => 'Samsung Galaxy S24 Ultra (12/256GB - Titanium Blue)',
                'base_price' => 125000.00,
                'compare_price' => 135000.00,
                'description' => 'Equipped with Galaxy AI, titanium frame, Snapdragon 8 Gen 3 processor, and 200MP quad telephoto camera system.',
                'image' => 'images/products/Samsung-Galaxy-S24-Ultra-price-in-Bangladesh-Titanium-Blue.webp',
                'gallery' => [
                    'images/products/Samsung-Galaxy-S24-Ultra-price-in-Bangladesh-Titanium-Green.webp',
                    'images/products/Samsung-Galaxy-S24-Ultra-price-in-Bangladesh-Titanium-Orange.webp',
                ],
            ],
            [
                'sku' => 'APL-IP15PM-256-NAT',
                'category_slug' => 'flagship-smartphones',
                'title' => 'Apple iPhone 18 Pro Max (256GB - Natural Titanium)',
                'base_price' => 239990.00,
                'compare_price' => 299990.00,
                'description' => 'A17 Pro chip, aerospace-grade titanium design, Action button, USB-C 3 connectivity, and 5x optical telephoto zoom.',
                'image' => 'images/products/iphone-18-pro-max.png',
                'gallery' => [
                    'images/products/apple-iphone-18-pro-max-full-display-side-image.webp',
                    'images/products/apple-iphone-18-pro-max-burgundy-official-color-image.webp',
                ],
            ],
            [
                'sku' => 'APL-IP14P-128-MID',
                'category_slug' => 'flagship-smartphones',
                'title' => 'Apple iPhone 14 Plus (6/128GB - Midnight)',
                'base_price' => 99000.00,
                'compare_price' => 115000.00,
                'description' => 'A15 Bionic with 5-core GPU, 6.7-inch Super Retina XDR display, dual-camera system, and all-day battery life.',
                'image' => 'images/products/product-2-bg-1.png',
                'gallery' => [
                    'images/products/product-2-bg-2.png',
                    'images/products/product-1-bg-1.png',
                ],
            ],
            [
                'sku' => 'APL-MBA13-M3-256',
                'category_slug' => 'macbooks',
                'title' => 'Apple MacBook Air 13-inch (M3 chip, 8GB / 256GB SSD)',
                'base_price' => 135000.00,
                'compare_price' => 145000.00,
                'description' => 'Supercharged by the M3 chip with 8-core CPU and up to 10-core GPU. Liquid Retina display and up to 18 hours of battery life.',
                'image' => 'images/products/m3-macbook-air-13-inch-pp-header_fMkTcmVW3Iz6.webp',
                'gallery' => [
                    'images/products/product-4-bg-1.png',
                    'images/products/product-4-bg-2.png',
                ],
            ],
            [
                'sku' => 'APL-IMC24-M1-8GPU',
                'category_slug' => 'desktops',
                'title' => 'Apple iMac M1 24-inch (2021) 8-Core GPU',
                'base_price' => 155000.00,
                'compare_price' => 175000.00,
                'description' => 'Immersive 24-inch 4.5K Retina display with P3 wide color, 1080p FaceTime HD camera, studio-quality mics, and 6-speaker sound.',
                'image' => 'images/products/product-3-bg-1.png',
                'gallery' => [
                    'images/products/product-3-bg-2.png',
                ],
            ],
            [
                'sku' => 'LOG-MX3S-GRAPHITE',
                'category_slug' => 'keyboards-mice',
                'title' => 'Logitech MX Master 3S Wireless Performance Mouse',
                'base_price' => 12500.00,
                'compare_price' => 14000.00,
                'description' => 'Quiet Clicks, 8K DPI track-on-glass sensor, MagSpeed electromagnetic scrolling, and ergonomic silhouette in graphite finish.',
                'image' => 'images/products/mx-master-3s-bluetooth-edition-top-view-black-new-1.webp',
                'gallery' => [
                    'images/products/mx-master-3s-bluetooth-edition-rear-view-black-new-7.webp',
                    'images/products/mx-master-3s-bluetooth-edition-left-profile-view-black-new-4.webp',
                ],
            ],
            [
                'sku' => 'KEY-K2-V2-BROWN',
                'category_slug' => 'keyboards-mice',
                'title' => 'Keychron K2 Wireless Mechanical Keyboard (Version 2)',
                'base_price' => 9500.00,
                'compare_price' => 11000.00,
                'description' => 'Compact 84-key Mac/Windows wireless mechanical keyboard with Gateron Brown tactile switches and RGB white backlighting.',
                'image' => 'images/products/Keychron-K2-wireless-mechanical-keyboard-for-Mac-Windows-iOS-Gateron-switch-brown-with-type-C-RGB-white-backlight_53059406-af50-40d8-8566-c3b5f1e85a62.webp',
                'gallery' => [
                    'images/products/Keychron-K2-wireless-mechanical-keyboard-for-Mac-Windows-iOS-Gateron-switch-red-with-type-C-RGB-white-backlight_9cb9d3e6-a5ac-4ac5-becb-079c7103ed2f.webp',
                ],
            ],
            [
                'sku' => 'SNY-WH1000XM5-BLK',
                'category_slug' => 'wireless-headphones',
                'title' => 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
                'base_price' => 38500.00,
                'compare_price' => 42000.00,
                'description' => 'Industry-leading noise cancellation with two processors and 8 microphones, exceptional hands-free calling, and up to 30 hours battery.',
                'image' => 'images/products/product-8-bg-1.png',
                'gallery' => [
                    'images/products/product-8-sm-1.png',
                    'images/products/product-8-sm-2.png',
                ],
            ],
            [
                'sku' => 'JBL-CHG5-RED',
                'category_slug' => 'bluetooth-speakers',
                'title' => 'JBL Charge 5 Portable Waterproof Bluetooth Speaker',
                'base_price' => 17500.00,
                'compare_price' => 19500.00,
                'description' => 'Delivers bold JBL Original Pro Sound with long excursion driver, separate tweeter and dual pumping JBL bass radiators. IP67 waterproof.',
                'image' => 'images/products/JBL_CHARGE5_FRONT_RED_0080_x2.png',
                'gallery' => [
                    'images/products/JBL_CHARGE5_HERO_RED_0029_x2.png',
                    'images/products/JBL_CHARGE5_HERO_BLUE_01.webp',
                ],
            ],
            [
                'sku' => 'APL-WTC-ULT2-49',
                'category_slug' => 'smartwatches',
                'title' => 'Apple Watch Ultra 2 (49mm Titanium Case)',
                'base_price' => 105000.00,
                'compare_price' => 115000.00,
                'description' => 'The ultimate sports and adventure watch. Powered by S9 SiP with 3000 nits display, precision dual-frequency GPS, and up to 36 hours life.',
                'image' => 'images/products/product-5-bg-1.png',
                'gallery' => [
                    'images/products/product-5-bg-2.png',
                ],
            ],
        ];

        $createdProducts = [];

        foreach ($products as $pData) {
            $cat = Category::where('slug', $pData['category_slug'])->first();
            $thumbnailPath = $this->processImage($pData['image'], 'products');
            $galleryPaths = [];
            foreach ($pData['gallery'] as $galleryImg) {
                $savedPath = $this->processImage($galleryImg, 'products/gallery');
                if ($savedPath) {
                    $galleryPaths[] = $savedPath;
                }
            }

            $product = Product::updateOrCreate(
                ['sku' => $pData['sku']],
                [
                    'user_id' => $admin->id,
                    'category_id' => $cat?->parent_id ?: ($cat?->id ?: 1),
                    'subcategory_id' => $cat?->parent_id ? $cat->id : null,
                    'title' => $pData['title'],
                    'slug' => Str::slug($pData['title']),
                    'base_price' => $pData['base_price'],
                    'compare_price' => $pData['compare_price'],
                    'description' => $pData['description'],
                    'thumbnail' => $thumbnailPath,
                    'gallery' => $galleryPaths,
                    'is_approved' => true,
                ]
            );

            $createdProducts[$product->sku] = $product;
        }

        $this->seedShopInventories($createdProducts);
    }

    /**
     * Process an image using SmartUpload pipeline so real WebP and _thumb variants exist.
     */
    protected function processImage(string $relativePath, string $targetFolder): ?string
    {
        $fullPath = public_path($relativePath);
        if (! file_exists($fullPath)) {
            return null;
        }

        try {
            return Upload::file($fullPath)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save($targetFolder)
                ->path;
        } catch (\Throwable) {
            return $relativePath;
        }
    }

    /**
     * Assign inventory to shops with realistic stock and customized pricing.
     */
    protected function seedShopInventories(array $products): void
    {
        $dhanmondi = Shop::where('slug', 'dhanmondi-gadget-hub')->first();
        $jamuna = Shop::where('slug', 'jamuna-lifestyle-mart')->first();
        $chittagong = Shop::where('slug', 'chittagong-digital-zone')->first();

        // 1. Dhanmondi Gadget Hub stocks flagship phones, macbooks & peripherals
        if ($dhanmondi) {
            $dhanmondiItems = [
                ['sku' => 'SAM-S24U-256-BLU', 'price' => 123000.00, 'stock' => 12],
                ['sku' => 'APL-IP15PM-256-NAT', 'price' => 239990.00, 'stock' => 8],
                ['sku' => 'APL-IP14P-128-MID', 'price' => 97000.00, 'stock' => 15],
                ['sku' => 'APL-MBA13-M3-256', 'price' => 132000.00, 'stock' => 6],
                ['sku' => 'LOG-MX3S-GRAPHITE', 'price' => 11900.00, 'stock' => 25],
                ['sku' => 'KEY-K2-V2-BROWN', 'price' => 9200.00, 'stock' => 18],
            ];

            foreach ($dhanmondiItems as $item) {
                if (isset($products[$item['sku']])) {
                    ShopProduct::updateOrCreate(
                        ['shop_id' => $dhanmondi->id, 'product_id' => $products[$item['sku']]->id],
                        [
                            'custom_price' => $item['price'],
                            'stock_quantity' => $item['stock'],
                            'is_active' => true,
                        ]
                    );
                }
            }
        }

        // 2. Jamuna Lifestyle Mart stocks audio, wearables & select flagship phones
        if ($jamuna) {
            $jamunaItems = [
                ['sku' => 'SNY-WH1000XM5-BLK', 'price' => 37000.00, 'stock' => 20],
                ['sku' => 'JBL-CHG5-RED', 'price' => 16500.00, 'stock' => 30],
                ['sku' => 'APL-WTC-ULT2-49', 'price' => 102000.00, 'stock' => 9],
                ['sku' => 'APL-IP15PM-256-NAT', 'price' => 270000.00, 'stock' => 5],
            ];

            foreach ($jamunaItems as $item) {
                if (isset($products[$item['sku']])) {
                    ShopProduct::updateOrCreate(
                        ['shop_id' => $jamuna->id, 'product_id' => $products[$item['sku']]->id],
                        [
                            'custom_price' => $item['price'],
                            'stock_quantity' => $item['stock'],
                            'is_active' => true,
                        ]
                    );
                }
            }
        }

        // 3. Chittagong Digital Zone stocks desktops, accessories & audio
        if ($chittagong) {
            $chittagongItems = [
                ['sku' => 'APL-IMC24-M1-8GPU', 'price' => 150000.00, 'stock' => 4],
                ['sku' => 'LOG-MX3S-GRAPHITE', 'price' => 12000.00, 'stock' => 14],
                ['sku' => 'SNY-WH1000XM5-BLK', 'price' => 37500.00, 'stock' => 10],
            ];

            foreach ($chittagongItems as $item) {
                if (isset($products[$item['sku']])) {
                    ShopProduct::updateOrCreate(
                        ['shop_id' => $chittagong->id, 'product_id' => $products[$item['sku']]->id],
                        [
                            'custom_price' => $item['price'],
                            'stock_quantity' => $item['stock'],
                            'is_active' => true,
                        ]
                    );
                }
            }
        }
    }
}
