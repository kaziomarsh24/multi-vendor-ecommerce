<?php

namespace App\Models;

use App\Traits\HasUniqueSlug;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use KaziOmar\AtomicCache\Traits\AutoClearsCache;
use KaziOmar\SmartUpload\Traits\HasUploadPurge;

#[Fillable(['user_id', 'category_id', 'subcategory_id', 'title', 'slug', 'sku', 'base_price', 'compare_price', 'description', 'thumbnail', 'gallery', 'is_approved'])]
class Product extends Model
{
    use AutoClearsCache, HasFactory, HasUniqueSlug, HasUploadPurge, SoftDeletes;

    protected array $cacheParents = ['category'];

    protected string $slugSource = 'title';

    /**
     * Boot model events for automatic sku generation.
     */
    protected static function booted(): void
    {
        static::creating(function (Product $product) {
            if (empty($product->sku)) {
                $product->sku = 'SKU-'.strtoupper(Str::random(6));
            }
        });
    }

    /**
     * Autocleaned up on update or deletion
     */
    protected array $purgeableFiles = ['thumbnail', 'gallery'];

    protected $appends = [
        'thumbnail_url',
        'thumb_url',
        'gallery_urls',
        'gallery_thumb_urls',
    ];

    protected function thumbnailUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->thumbnail, fallback: '/images/placeholder-product.svg')
        );
    }

    protected function thumbUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->thumbnail, variant: 'thumb', fallback: '/images/placeholder-product.svg')
        );
    }

    protected function galleryUrls(): Attribute
    {
        return Attribute::make(
            get: fn () => array_values(array_map(
                fn ($p) => upload_url($p, fallback: '/images/placeholder-product.svg'),
                $this->gallery ?? []
            ))
        );
    }

    protected function galleryThumbUrls(): Attribute
    {
        return Attribute::make(
            get: fn () => array_values(array_map(
                fn ($p) => upload_url($p, variant: 'thumb', fallback: '/images/placeholder-product.svg'),
                $this->gallery ?? []
            ))
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
            'base_price' => 'decimal:2',
            'compare_price' => 'decimal:2',
            'is_approved' => 'boolean',
            'gallery' => 'array',
        ];
    }

    // product owner relationship
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // main category relationship
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    // subcategory relationship
    public function subcategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'subcategory_id');
    }

    // which shops have this product relationship
    public function shopProducts(): HasMany
    {
        return $this->hasMany(ShopProduct::class);
    }

    public function shops(): BelongsToMany
    {
        return $this->belongsToMany(Shop::class, 'shop_products')
            ->withPivot([
                'custom_price',
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
