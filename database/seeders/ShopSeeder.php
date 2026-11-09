<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use KaziOmar\SmartUpload\Facades\Upload;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $shops = [
            [
                'slug' => 'dhanmondi-gadget-hub',
                'owner_email' => 'owner1@csn.com',
                'name' => 'Dhanmondi Gadget Hub',
                'email' => 'dhanmondi@csn.com',
                'phone' => '+880 1712-345678',
                'address' => 'Dhanmondi 27, Dhaka, Bangladesh',
                'description' => 'Specializing in authentic flagship smartphones, Apple ecosystem accessories, and high-fidelity gaming peripherals.',
                'logo' => 'images/sellers/sellers-01.png',
                'banner' => 'images/promo/promo-01.png',
            ],
            [
                'slug' => 'jamuna-lifestyle-mart',
                'owner_email' => 'owner2@csn.com',
                'name' => 'Jamuna Lifestyle & Mart',
                'email' => 'jamuna@csn.com',
                'phone' => '+880 1819-876543',
                'address' => 'KA-244 Kuril, Pragati Sarani, Dhaka, Bangladesh',
                'description' => 'Lifestyle electronics, wearables & audio equipment. Direct distributor pricing inside Kuril / Jamuna area.',
                'logo' => 'images/sellers/sellers-02.png',
                'banner' => 'images/promo/promo-02.png',
            ],
            [
                'slug' => 'chittagong-digital-zone',
                'owner_email' => 'owner3@csn.com',
                'name' => 'Chittagong Digital Zone',
                'email' => 'chittagong@csn.com',
                'phone' => '+880 1911-223344',
                'address' => 'GEC Circle, Chattogram, Bangladesh',
                'description' => 'Newly registered authorized shop outlet in Chittagong division. Currently configuring shared inventory.',
                'logo' => 'images/sellers/sellers-03.png',
                'banner' => 'images/promo/promo-03.png',
            ],
        ];

        foreach ($shops as $shopData) {
            $user = User::where('email', $shopData['owner_email'])->first();
            if (! $user) {
                continue;
            }

            // Check if user dropped custom logo/banner in seed_assets, otherwise use standard template asset
            $customLogo = "images/seed_assets/shops/{$shopData['slug']}-logo.png";
            $logoSource = file_exists(public_path($customLogo)) ? $customLogo : $shopData['logo'];

            $customBanner = "images/seed_assets/shops/{$shopData['slug']}-banner.jpg";
            $bannerSource = file_exists(public_path($customBanner)) ? $customBanner : $shopData['banner'];

            $logo = $this->uploadAsset($logoSource, 'shops/logos');
            $banner = $this->uploadAsset($bannerSource, 'shops/banners');

            Shop::updateOrCreate(
                ['slug' => $shopData['slug']],
                [
                    'user_id' => $user->id,
                    'name' => $shopData['name'],
                    'email' => $shopData['email'],
                    'phone' => $shopData['phone'],
                    'address' => $shopData['address'],
                    'description' => $shopData['description'],
                    'logo' => $logo,
                    'banner' => $banner,
                    'is_active' => true,
                ]
            );
        }
    }

    protected function uploadAsset(?string $relativePath, string $targetFolder): ?string
    {
        if (! $relativePath || ! file_exists(public_path($relativePath))) {
            return null;
        }

        try {
            return Upload::file(public_path($relativePath))
                ->save($targetFolder)
                ->path;
        } catch (\Throwable) {
            return $relativePath;
        }
    }
}
