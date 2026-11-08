<?php

namespace App\Models;

use App\Traits\HasUniqueSlug;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use KaziOmar\AtomicCache\Traits\AutoClearsCache;
use KaziOmar\SmartUpload\Traits\HasUploadPurge;

#[Fillable(['parent_id', 'name', 'slug', 'icon', 'is_active'])]
class Category extends Model
{
    use AutoClearsCache, HasFactory, HasUniqueSlug, HasUploadPurge, SoftDeletes;

    protected string $slugSource = 'name';

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

    /**
     * Autocleaned up on update or deletion
     */
    protected array $purgeableFiles = ['icon'];

    protected $appends = ['icon_url'];

    protected function iconUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => upload_url($this->icon, fallback: '/images/categories/categories-01.png')
        );
    }

    // parent category relationship
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    // sub-categories relationship
    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // products relationship
    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    // scope to get only parent categories
    public function scopeParentsOnly($query)
    {
        return $query->whereNull('parent_id');
    }
}
