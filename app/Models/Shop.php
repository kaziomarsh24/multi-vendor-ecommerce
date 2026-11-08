<?php

namespace App\Models;

use App\Traits\HasUniqueSlug;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use KaziOmar\AtomicCache\Traits\AutoClearsCache;
use KaziOmar\SmartUpload\Traits\HasUploadPurge;

#[Fillable(['user_id', 'name', 'slug', 'email', 'description', 'logo', 'banner', 'phone', 'address', 'is_active'])]
class Shop extends Model
{
    use AutoClearsCache, HasUniqueSlug, HasUploadPurge, SoftDeletes;

    protected string $slugSource = 'name';

    /**
     * Autocleaned up on update or deletion
     */
    protected array $purgeableFiles = ['logo', 'banner'];

    protected $appends = ['logo_url', 'banner_url'];

    protected function logoUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->logo, fallback: '/images/sellers/sellers-01.png')
        );
    }

    protected function bannerUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->banner, fallback: '/images/promo/promo-01.png')
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    // shop owner relationship
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // shop inventory relationship
    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    // shop products relationship
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'shop_products')
            ->withPivot([
                'id',
                'custom_price',
                'custom_compare_price',
                'custom_title',
                'custom_description',
                'custom_thumbnail',
                'custom_gallery',
                'stock_quantity',
                'is_active',
            ])
            ->withTimestamps();
    }
}
