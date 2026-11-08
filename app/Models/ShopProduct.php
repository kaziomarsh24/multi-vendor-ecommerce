<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use KaziOmar\AtomicCache\Traits\AutoClearsCache;
use KaziOmar\SmartUpload\Traits\HasUploadPurge;

#[Fillable(['shop_id', 'product_id', 'custom_price', 'custom_compare_price', 'custom_title', 'custom_description', 'custom_thumbnail', 'custom_gallery', 'stock_quantity', 'is_active'])]
class ShopProduct extends Model
{
    use AutoClearsCache, HasFactory, HasUploadPurge, SoftDeletes;

    protected array $cacheParents = ['shop', 'product'];

    /**
     * Autocleaned up on update or deletion
     */
    protected array $purgeableFiles = ['custom_thumbnail', 'custom_gallery'];

    protected function casts(): array
    {
        return [
            'custom_price' => 'decimal:2',
            'custom_compare_price' => 'decimal:2',
            'is_active' => 'boolean',
            'custom_gallery' => 'array',
            'stock_quantity' => 'integer',
        ];
    }

    protected $appends = [
        'display_price',
        'display_compare_price',
        'display_title',
        'display_description',
        'display_thumbnail',
        'display_gallery',
        'display_thumbnail_url',
        'display_thumb_url',
        'display_gallery_urls',
        'display_gallery_thumb_urls',
        'custom_thumbnail_url',
    ];

    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    protected function displayPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_price ?? $this->product?->base_price
        );
    }

    protected function displayTitle(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_title ?? $this->product?->title
        );
    }

    protected function displayDescription(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_description ?? $this->product?->description
        );
    }

    protected function displayThumbnail(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_thumbnail ?? $this->product?->thumbnail
        );
    }

    protected function displayThumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->display_thumbnail, fallback: '/images/placeholder-product.svg')
        );
    }

    protected function displayThumbUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->display_thumbnail, variant: 'thumb', fallback: '/images/placeholder-product.svg')
        );
    }

    protected function displayGallery(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_gallery ?? $this->product?->gallery ?? []
        );
    }

    protected function displayGalleryUrls(): Attribute
    {
        return Attribute::make(
            get: fn () => array_values(array_map(
                fn ($p) => upload_url($p, fallback: '/images/placeholder-product.svg'),
                $this->display_gallery ?? []
            ))
        );
    }

    protected function displayGalleryThumbUrls(): Attribute
    {
        return Attribute::make(
            get: fn () => array_values(array_map(
                fn ($p) => upload_url($p, variant: 'thumb', fallback: '/images/placeholder-product.svg'),
                $this->display_gallery ?? []
            ))
        );
    }

    protected function displayComparePrice(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_compare_price ?? $this->product?->compare_price
        );
    }

    protected function customThumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->custom_thumbnail ? upload_url($this->custom_thumbnail, fallback: '/images/placeholder-product.svg') : null
        );
    }
}
