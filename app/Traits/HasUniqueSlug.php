<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

trait HasUniqueSlug
{
    /**
     * Boot the unique slug trait for the model.
     */
    protected static function bootHasUniqueSlug(): void
    {
        static::creating(function (Model $model) {
            $sourceField = $model->slugSourceColumn();
            $source = $model->slug ?: $model->{$sourceField};

            if (! empty($source)) {
                $model->slug = static::generateUniqueSlug($source);
            }
        });

        static::updating(function (Model $model) {
            $sourceField = $model->slugSourceColumn();

            if ($model->isDirty('slug') || ($model->isDirty($sourceField) && empty($model->slug))) {
                $source = $model->slug ?: $model->{$sourceField};
                if (! empty($source)) {
                    $model->slug = static::generateUniqueSlug($source, $model->getKey());
                }
            }
        });
    }

    /**
     * Define the source column for slug generation.
     */
    public function slugSourceColumn(): string
    {
        return property_exists($this, 'slugSource') ? $this->slugSource : 'name';
    }

    /**
     * Generate an auto-incrementing unique slug.
     */
    public static function generateUniqueSlug(string $titleOrSlug, int|string|null $ignoreId = null): string
    {
        $baseSlug = Str::slug($titleOrSlug);
        $slug = $baseSlug;
        $counter = 1;

        while (static::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where((new static)->getKeyName(), '!=', $ignoreId))->exists()) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }
}
