import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X, Save, Upload, Plus } from 'lucide-react';
import type { Category } from '@/types/ecommerce';

interface CreateSharedProductModalProps {
    isOpen: boolean;
    categories: (Category & { children?: Category[] })[];
    onClose: () => void;
}

export default function CreateSharedProductModal({
    isOpen,
    categories,
    onClose,
}: CreateSharedProductModalProps) {
    const initialCat = categories[0] || null;
    const initialSub = initialCat?.children?.[0] || null;

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<
        { file: File; url: string }[]
    >([]);

    const { data, setData, processing, errors, reset } = useForm<{
        category_id: number | string;
        subcategory_id: number | string;
        title: string;
        sku: string;
        base_price: string;
        compare_price: string;
        custom_price: string;
        description: string;
        stock_quantity: number;
        image: File | null;
        gallery: File[];
    }>({
        category_id: initialCat ? initialCat.id : '',
        subcategory_id: initialSub ? initialSub.id : '',
        title: '',
        sku: '',
        base_price: '',
        compare_price: '',
        custom_price: '',
        description: '',
        stock_quantity: 50,
        image: null,
        gallery: [],
    });

    const availableSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        const parent = categories.find(
            (c) => String(c.id) === String(data.category_id),
        );
        return parent?.children || [];
    }, [data.category_id, categories]);

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        setImagePreview(null);
        setGalleryPreviews([]);
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

    const removeMainImage = () => {
        setData('image', null);
        setImagePreview(null);
    };

    const handleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPreviews = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setData('gallery', [...data.gallery, ...files]);
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (idx: number) => {
        const updatedFiles = data.gallery.filter((_, i) => i !== idx);
        const updatedPreviews = galleryPreviews.filter((_, i) => i !== idx);
        setData('gallery', updatedFiles);
        setGalleryPreviews(updatedPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.post('/owner/catalog', data, {
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
                            Create New Product
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
                            placeholder="e.g. Wireless Noise Canceling Headphones"
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
                                SKU (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. WH-1000XM5"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Initial Stock Units *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={data.stock_quantity}
                                onChange={(e) =>
                                    setData(
                                        'stock_quantity',
                                        Number(e.target.value),
                                    )
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            />
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
                                placeholder="e.g. 35000"
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
                                placeholder="e.g. 40000"
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
                            placeholder="Product specifications, features, warranty..."
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    {/* Main Product Image */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Main Thumbnail (JPG, PNG, WebP)
                        </label>
                        {imagePreview ? (
                            <div className="flex items-center gap-3">
                                <div className="relative flex h-20 w-20 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-1">
                                    <img
                                        src={imagePreview}
                                        alt="Thumbnail preview"
                                        className="max-h-full max-w-full object-contain"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeMainImage}
                                        className="absolute -top-2 -right-2 rounded-full bg-rose-600 p-1 text-white shadow-sm hover:bg-rose-700"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4 transition hover:border-blue-500 hover:bg-blue-50/30">
                                <Upload className="mb-1 h-5 w-5 text-gray-400" />
                                <span className="text-xs font-medium text-gray-600">
                                    Click to upload main image
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImage}
                                    className="hidden"
                                />
                            </label>
                        )}
                    </div>

                    {/* Gallery Images */}
                    <div>
                        <div className="mb-1 flex items-center justify-between">
                            <label className="block font-semibold text-gray-700">
                                Gallery Photos (Optional)
                            </label>
                            <label className="flex cursor-pointer items-center gap-1 text-xs font-semibold text-blue-600 hover:underline">
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add Photos</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleGallery}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        {galleryPreviews.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 sm:grid-cols-5">
                                {galleryPreviews.map((preview, idx) => (
                                    <div
                                        key={idx}
                                        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white p-1"
                                    >
                                        <img
                                            src={preview.url}
                                            alt={`Gallery ${idx}`}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeGalleryImage(idx)
                                            }
                                            className="absolute top-1 right-1 rounded-full bg-black/60 p-0.5 text-white transition hover:bg-rose-600"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[11px] text-gray-400">
                                No additional gallery photos selected.
                            </p>
                        )}
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
                                {processing ? 'Saving...' : 'Create Product'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
