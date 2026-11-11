<?php

namespace App\Services\Admin;

use App\Enums\UserRole;
use App\Enums\UserStatus;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use KaziOmar\SmartUpload\Facades\Upload;

class ShopService
{
    // list shops with search filter
    public function getPaginatedShops(Request $request): LengthAwarePaginator
    {
        $query = Shop::with('owner')->withCount('shopProducts');

        if ($request->filled('search')) {
            $search = $request->query('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhere('address', 'like', "%{$search}%")
                    ->orWhereHas('owner', fn ($ownerQ) => $ownerQ->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%"));
            });
        }

        return $query->latest('id')->paginate(10)->withQueryString();
    }

    // available users who do not own a shop yet (excluding admins)
    public function getAvailableOwners(): Collection
    {
        return User::where('role', '!=', UserRole::ADMIN)
            ->whereDoesntHave('shop')
            ->select('id', 'name', 'email', 'role')
            ->get();
    }

    // create new shop and optionally create owner account
    public function createShop(array $data, ?UploadedFile $logoFile = null, ?UploadedFile $bannerFile = null): Shop
    {
        $userId = $data['user_id'] ?? null;

        // promote existing user to shop owner if needed
        if ($userId) {
            $user = User::find($userId);
            if ($user && $user->role !== UserRole::SHOP_OWNER) {
                $user->update(['role' => UserRole::SHOP_OWNER]);
            }
        }

        // create new shop owner account if details provided
        if (! $userId && ! empty($data['new_owner_email'])) {
            $owner = User::create([
                'name' => $data['new_owner_name'],
                'email' => $data['new_owner_email'],
                'password' => Hash::make($data['new_owner_password'] ?? 'password'),
                'role' => UserRole::SHOP_OWNER,
                'status' => UserStatus::ACTIVE,
            ]);
            $userId = $owner->id;
        }

        // upload logo
        if ($logoFile) {
            $data['logo'] = Upload::file($logoFile)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('shops/logos')
                ->path;
        }

        // upload banner
        if ($bannerFile) {
            $data['banner'] = Upload::file($bannerFile)
                ->scaleDown(1200)
                ->save('shops/banners')
                ->path;
        }

        return Shop::create([
            'user_id' => $userId,
            'name' => $data['name'],
            'slug' => $data['slug'] ?? null,
            'email' => $data['email'] ?? null,
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'description' => $data['description'] ?? null,
            'logo' => $data['logo'] ?? null,
            'banner' => $data['banner'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);
    }

    // update shop details and files (HasUploadPurge auto-purges old files)
    public function updateShop(Shop $shop, array $data, ?UploadedFile $logoFile = null, ?UploadedFile $bannerFile = null): Shop
    {
        // upload new logo if provided
        if ($logoFile) {
            $data['logo'] = Upload::file($logoFile)
                ->variants(['thumb' => ['fit' => [150, 150]]])
                ->save('shops/logos')
                ->path;
        } else {
            unset($data['logo']);
        }

        // upload new banner if provided
        if ($bannerFile) {
            $data['banner'] = Upload::file($bannerFile)
                ->scaleDown(1200)
                ->save('shops/banners')
                ->path;
        } else {
            unset($data['banner']);
        }

        // promote user to shop owner if reassigned
        if (! empty($data['user_id'])) {
            $user = User::find($data['user_id']);
            if ($user && $user->role !== UserRole::SHOP_OWNER) {
                $user->update(['role' => UserRole::SHOP_OWNER]);
            }
        }

        $shop->update($data);

        return $shop;
    }

    // SoftDelete shop
    public function deleteShop(Shop $shop): void
    {
        $shop->delete();
    }
}
