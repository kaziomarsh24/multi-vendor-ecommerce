import React, { useState, useMemo } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { ArrowLeft, Save, Image as ImageIcon, X } from 'lucide-react';
import type { Product, Category } from '@/types/ecommerce';

interface ProductEditProps {
    product: Product & { subcategory_id?: number | null };
    categories: (Category & { children?: Category[] })[];
}

export default function ProductEdit({ product, categories }: ProductEditProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(
        product.thumbnail_url || null,
    );

    const initialGallery: string[] = Array.isArray(product.gallery)
        ? product.gallery
        : [];

    const [existingGallery, setExistingGallery] =
        useState<string[]>(initialGallery);
    const [newGalleryFiles, setNewGalleryFiles] = useState<
        { file: File; previewUrl: string }[]
    >([]);

    const { data, setData, processing, errors } = useForm({
        _method: 'PUT',
        category_id: product.category_id as number | string,
        subcategory_id: product.subcategory_id || '',
        title: product.title,
        slug: product.slug,
        sku: product.sku,
        base_price: String(product.base_price),
        compare_price: product.compare_price
            ? String(product.compare_price)
            : '',
        description: product.description || '',
        thumbnail: null as File | null,
        existing_gallery: initialGallery,
        gallery: [] as File[],
        is_approved: product.is_approved,
    });

    const availableSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        const parent = categories.find(
            (c) => String(c.id) === String(data.category_id),
        );
        return parent?.children || [];
    }, [data.category_id, categories]);

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const catId = e.target.value ? Number(e.target.value) : '';
        const parent = categories.find((c) => String(c.id) === String(catId));
        const firstSub = parent?.children?.[0]?.id || '';

        setData((prev) => ({
            ...prev,
            category_id: catId,
            subcategory_id: firstSub,
        }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setData('title', title);
    };

    const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('thumbnail', file);
            const reader = new FileReader();
            reader.onload = (re) => {
                setImagePreview(re.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNewGalleryFilesChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const addedPreviews = files.map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));

            const combinedFiles = [...(data.gallery || []), ...files];
            setData('gallery', combinedFiles);
            setNewGalleryFiles((prev) => [...prev, ...addedPreviews]);
        }
    };

    const removeExistingGalleryImage = (imagePath: string) => {
        const updated = existingGallery.filter((img) => img !== imagePath);
        setExistingGallery(updated);
        setData('existing_gallery', updated);
    };

    const removeNewGalleryImage = (idxToRemove: number) => {
        const updatedFiles = (data.gallery || []).filter(
            (_, i) => i !== idxToRemove,
        );
        const updatedPreviews = newGalleryFiles.filter(
            (_, i) => i !== idxToRemove,
        );
        setData('gallery', updatedFiles);
        setNewGalleryFiles(updatedPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/admin/catalog/${product.id}`, data, {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Edit Master Catalog Product">
            <Head title={`Edit ${product.title} | Admin Console`} />

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header & Breadcrumbs */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="mb-1 text-xs text-dark-4">
                            <Link
                                href="/admin/catalog"
                                className="hover:underline"
                            >
                                Master Catalog
                            </Link>{' '}
                            / <span>Edit Product</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-dark">
                            Edit: {product.title}
                        </h1>
                    </div>
                    <Link
                        href="/admin/catalog"
                        className="flex items-center gap-1.5 rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-xs font-medium text-dark-3 shadow-2xs transition hover:bg-gray-50 hover:text-dark"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Catalog</span>
                    </Link>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-xl border border-gray-3 bg-white p-6 shadow-sm sm:p-8"
                >
                    {/* Category & Subcategory */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-dark">
                                Primary Category{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <select
                                required
                                value={data.category_id}
                                onChange={handleCategoryChange}
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <span className="text-[11px] text-rose-600">
                                    {errors.category_id}
                                </span>
                            )}
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label className="block text-xs font-semibold text-dark">
                                    Subcategory
                                </label>
                                <span className="text-[11px] text-dark-4">
                                    {availableSubcategories.length > 0
                                        ? `${availableSubcategories.length} available`
                                        : 'None for this category'}
                                </span>
                            </div>
                            <select
                                value={data.subcategory_id}
                                onChange={(e) =>
                                    setData(
                                        'subcategory_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    )
                                }
                                disabled={availableSubcategories.length === 0}
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100"
                            >
                                <option value="">
                                    -- Select Subcategory (Optional) --
                                </option>
                                {availableSubcategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subcategory_id && (
                                <span className="text-[11px] text-rose-600">
                                    {errors.subcategory_id}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Product Name & SKU */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <label className="mb-1.5 block text-xs font-semibold text-dark">
                                Product Title{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.title}
                                onChange={handleTitleChange}
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm font-medium text-dark transition focus:border-blue focus:outline-none"
                            />
                            {errors.title && (
                                <span className="text-[11px] text-rose-600">
                                    {errors.title}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-dark">
                                SKU / Serial Code{' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 font-mono text-sm text-dark transition focus:border-blue focus:outline-none"
                            />
                            {errors.sku && (
                                <span className="text-[11px] text-rose-600">
                                    {errors.sku}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-dark">
                            URL Slug <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            className="w-full rounded-lg border border-gray-3 bg-gray-1 px-3.5 py-2 font-mono text-xs text-dark-3 transition focus:border-blue focus:outline-none"
                        />
                        {errors.slug && (
                            <span className="text-[11px] text-rose-600">
                                {errors.slug}
                            </span>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-dark">
                                Reference Base Price (৳){' '}
                                <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                value={data.base_price}
                                onChange={(e) =>
                                    setData('base_price', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                            />
                            {errors.base_price && (
                                <span className="text-[11px] text-rose-600">
                                    {errors.base_price}
                                </span>
                            )}
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-dark">
                                Compare at Price / MRP (৳)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.compare_price}
                                onChange={(e) =>
                                    setData('compare_price', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-dark">
                            Description <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            rows={4}
                            required
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm leading-relaxed text-dark transition focus:border-blue focus:outline-none"
                        />
                        {errors.description && (
                            <span className="text-[11px] text-rose-600">
                                {errors.description}
                            </span>
                        )}
                    </div>

                    {/* Main Thumbnail Image */}
                    <div>
                        <label className="mb-1.5 block text-xs font-semibold text-dark">
                            Main Product Image (Thumbnail)
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-3 bg-[#F6F7FB] p-1 text-xs text-dark-4">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <div className="p-2 text-center">
                                        <ImageIcon className="mx-auto mb-1 h-5 w-5 text-gray-400" />
                                        <span className="text-[10px]">
                                            No image
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    className="block w-full cursor-pointer text-xs text-dark-3 transition file:mr-4 file:rounded-lg file:border-0 file:bg-gray-2 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-dark hover:file:bg-gray-3"
                                />
                                <p className="text-xs text-dark-4">
                                    Upload new file to replace current thumbnail
                                    ({product.thumbnail})
                                </p>
                                {errors.thumbnail && (
                                    <span className="block text-[11px] text-rose-600">
                                        {errors.thumbnail}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Gallery Images Management */}
                    <div className="space-y-3 border-t border-gray-3 pt-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-xs font-semibold text-dark">
                                    Product Media Gallery
                                </label>
                                <p className="text-xs text-dark-4">
                                    Manage existing gallery photos or upload
                                    additional angles.
                                </p>
                            </div>
                            <span className="text-xs font-semibold text-blue">
                                Total:{' '}
                                {existingGallery.length +
                                    newGalleryFiles.length}{' '}
                                photos
                            </span>
                        </div>

                        {/* Existing Gallery Photos */}
                        {existingGallery.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="block text-[11px] font-bold tracking-wider text-dark-3 uppercase">
                                    Saved Gallery Images
                                </span>
                                <div className="grid grid-cols-4 gap-3 rounded-lg border border-gray-3 bg-gray-1 p-3 sm:grid-cols-6">
                                    {existingGallery.map((img, idx) => {
                                        const origIdx = (
                                            product.gallery || []
                                        ).indexOf(img);
                                        const srcUrl =
                                            origIdx !== -1 &&
                                            product.gallery_thumb_urls?.[
                                                origIdx
                                            ]
                                                ? product.gallery_thumb_urls[
                                                      origIdx
                                                  ]
                                                : product.thumb_url ||
                                                  '/images/placeholder-product.svg';

                                        return (
                                            <div
                                                key={idx}
                                                className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-md border border-gray-3 bg-white p-1"
                                            >
                                                <img
                                                    src={srcUrl}
                                                    alt={`Gallery ${idx + 1}`}
                                                    className="h-full w-full object-contain"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeExistingGalleryImage(
                                                            img,
                                                        )
                                                    }
                                                    className="absolute top-1 right-1 cursor-pointer rounded-full bg-rose-600 p-1 text-white opacity-90 shadow-xs transition hover:opacity-100"
                                                    title="Remove this photo from gallery"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Newly Uploaded Gallery Photos */}
                        {newGalleryFiles.length > 0 && (
                            <div className="space-y-1.5">
                                <span className="block text-[11px] font-bold tracking-wider text-emerald-600 uppercase">
                                    New Photos Ready to Upload (
                                    {newGalleryFiles.length})
                                </span>
                                <div className="grid grid-cols-4 gap-3 rounded-lg border border-emerald-200 bg-emerald-50/50 p-3 sm:grid-cols-6">
                                    {newGalleryFiles.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative flex h-20 w-full items-center justify-center overflow-hidden rounded-md border border-emerald-300 bg-white p-1"
                                        >
                                            <img
                                                src={item.previewUrl}
                                                alt={`New Gallery ${idx + 1}`}
                                                className="h-full w-full object-contain"
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeNewGalleryImage(idx)
                                                }
                                                className="absolute top-1 right-1 cursor-pointer rounded-full bg-rose-600 p-1 text-white opacity-90 shadow-xs transition hover:opacity-100"
                                                title="Cancel upload"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleNewGalleryFilesChange}
                                className="block w-full cursor-pointer text-xs text-dark-3 transition file:mr-4 file:rounded-lg file:border-0 file:bg-gray-2 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-dark hover:file:bg-gray-3"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-3 pt-4">
                        <Link
                            href="/admin/catalog"
                            className="rounded-lg border border-gray-3 px-5 py-2.5 text-xs font-medium text-dark-3 transition hover:bg-gray-50 hover:text-dark"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue px-6 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-dark disabled:opacity-70"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
