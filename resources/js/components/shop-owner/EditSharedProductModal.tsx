import React, { useState, useEffect, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X, Save, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import type { Product, Category } from '@/types/ecommerce';

interface EditSharedProductModalProps {
    product: Product | null;
    categories: (Category & { children?: Category[] })[];
    onClose: () => void;
}

export default function EditSharedProductModal({
    product,
    categories,
    onClose,
}: EditSharedProductModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingGallery, setExistingGallery] = useState<string[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<
        { file: File; url: string }[]
    >([]);

    const { data, setData, processing, errors, reset } = useForm<{
        _method: string;
        category_id: number | string;
        subcategory_id: number | string;
        title: string;
        sku: string;
        base_price: string;
        compare_price: string;
        description: string;
        image: File | null;
        gallery: File[];
        existing_gallery: string[];
    }>({
        _method: 'PUT',
        category_id: '',
        subcategory_id: '',
        title: '',
        sku: '',
        base_price: '',
        compare_price: '',
        description: '',
        image: null,
        gallery: [],
        existing_gallery: [],
    });

    useEffect(() => {
        if (!product) return;

        const galleryList = product.gallery || [];
        setExistingGallery(galleryList);
        setImagePreview(product.thumbnail_url || null);
        setNewGalleryPreviews([]);

        const cat = categories.find((c) => c.id === product.category_id);
        const isChildCategory =
            !cat &&
            categories.some((c) =>
                c.children?.some((child) => child.id === product.category_id),
            );

        let resolvedCatId: number | string = product.category_id || '';
        let resolvedSubId: number | string = '';

        if (isChildCategory) {
            const parent = categories.find((c) =>
                c.children?.some((child) => child.id === product.category_id),
            );
            if (parent) {
                resolvedCatId = parent.id;
                resolvedSubId = product.category_id;
            }
        }

        setData({
            _method: 'PUT',
            category_id: resolvedCatId,
            subcategory_id: resolvedSubId,
            title: product.title,
            sku: product.sku || '',
            base_price: String(product.base_price),
            compare_price: product.compare_price
                ? String(product.compare_price)
                : '',
            description: product.description || '',
            image: null,
            gallery: [],
            existing_gallery: galleryList,
        });
    }, [product]);

    const availableSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        const parent = categories.find(
            (c) => String(c.id) === String(data.category_id),
        );
        return parent?.children || [];
    }, [data.category_id, categories]);

    if (!product) return null;

    const handleClose = () => {
        reset();
        setImagePreview(null);
        setExistingGallery([]);
        setNewGalleryPreviews([]);
        onClose();
    };

    const handleMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onload = (re) =>
                setImagePreview(re.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPreviews = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setData('gallery', [...data.gallery, ...files]);
            setNewGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeExistingGalleryImage = (path: string) => {
        const updated = existingGallery.filter((p) => p !== path);
        setExistingGallery(updated);
        setData('existing_gallery', updated);
    };

    const removeNewGalleryImage = (idx: number) => {
        const updatedFiles = data.gallery.filter((_, i) => i !== idx);
        const updatedPreviews = newGalleryPreviews.filter((_, i) => i !== idx);
        setData('gallery', updatedFiles);
        setNewGalleryPreviews(updatedPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/owner/catalog/${product.id}`, data, {
            forceFormData: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Edit Product
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Product Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.title && (
                            <span className="text-[11px] text-rose-600">
                                {errors.title}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Category *
                            </label>
                            <select
                                value={data.category_id}
                                onChange={(e) => {
                                    const catId = Number(e.target.value);
                                    const parent = categories.find(
                                        (c) => c.id === catId,
                                    );
                                    setData((prev) => ({
                                        ...prev,
                                        category_id: catId,
                                        subcategory_id:
                                            parent?.children?.[0]?.id || '',
                                    }));
                                }}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Subcategory
                            </label>
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
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                                disabled={availableSubcategories.length === 0}
                            >
                                <option value="">None</option>
                                {availableSubcategories.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Base Price (৳) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={data.base_price}
                                onChange={(e) =>
                                    setData('base_price', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Compare Price / MRP (৳)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.compare_price}
                                onChange={(e) =>
                                    setData('compare_price', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Description *
                        </label>
                        <textarea
                            rows={3}
                            required
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    {/* Main Thumbnail */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Main Thumbnail
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <ImageIcon className="h-6 w-6 text-gray-300" />
                                )}
                            </div>
                            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                                <Upload className="h-3.5 w-3.5" />
                                <span>Change Thumbnail</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImage}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Gallery Photos */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="block font-semibold text-gray-700">
                                Gallery Photos
                            </label>
                            <label className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add More</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGallery}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <div className="grid grid-cols-4 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 sm:grid-cols-5">
                            {/* Existing Gallery Photos */}
                            {existingGallery.map((imgPath, idx) => {
                                const resolvedUrl =
                                    imgPath.startsWith('http') ||
                                    imgPath.startsWith('/')
                                        ? imgPath
                                        : `/storage/${imgPath}`;
                                return (
                                    <div
                                        key={`existing-${idx}`}
                                        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1"
                                    >
                                        <img
                                            src={resolvedUrl}
                                            alt={`Existing ${idx}`}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (
                                                    e.currentTarget as HTMLImageElement
                                                ).src =
                                                    '/images/placeholder-product.svg';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExistingGalleryImage(
                                                    imgPath,
                                                )
                                            }
                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white transition hover:bg-rose-600"
                                            title="Remove photo"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Newly selected gallery photos */}
                            {newGalleryPreviews.map((preview, idx) => (
                                <div
                                    key={`new-${idx}`}
                                    className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-blue-300 bg-blue-50 p-1"
                                >
                                    <img
                                        src={preview.url}
                                        alt={`New ${idx}`}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeNewGalleryImage(idx)
                                        }
                                        className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white transition hover:bg-rose-600"
                                        title="Remove photo"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-sm hover:bg-blue-700"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {processing ? 'Updating...' : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
