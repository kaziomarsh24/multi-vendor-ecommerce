import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X, Save, Upload, Plus } from 'lucide-react';
import type { ShopProduct } from '@/types/ecommerce';

interface InventoryEditModalProps {
    item: ShopProduct | null;
    onClose: () => void;
}

export default function InventoryEditModal({
    item,
    onClose,
}: InventoryEditModalProps) {
    const [customImagePreview, setCustomImagePreview] = useState<string | null>(
        null,
    );
    const [existingGallery, setExistingGallery] = useState<string[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<
        { file: File; url: string }[]
    >([]);

    const { data, setData, processing, errors, reset } = useForm<{
        _method: string;
        custom_price: string;
        custom_compare_price: string;
        custom_title: string;
        custom_description: string;
        stock_quantity: number;
        is_active: boolean;
        custom_image: File | null;
        custom_gallery: File[];
        existing_custom_gallery: string[];
    }>({
        _method: 'PUT',
        custom_price: '',
        custom_compare_price: '',
        custom_title: '',
        custom_description: '',
        stock_quantity: 50,
        is_active: true,
        custom_image: null,
        custom_gallery: [],
        existing_custom_gallery: [],
    });

    useEffect(() => {
        if (!item) return;

        setCustomImagePreview(item.custom_thumbnail_url || null);
        const galleryList = item.custom_gallery || item.product?.gallery || [];
        setExistingGallery(galleryList);
        setNewGalleryPreviews([]);

        setData({
            _method: 'PUT',
            custom_price:
                item.custom_price !== null && item.custom_price !== undefined
                    ? String(item.custom_price)
                    : '',
            custom_compare_price:
                item.custom_compare_price !== null &&
                item.custom_compare_price !== undefined
                    ? String(item.custom_compare_price)
                    : '',
            custom_title: item.custom_title || '',
            custom_description:
                item.custom_description || item.product?.description || '',
            stock_quantity: item.stock_quantity,
            is_active: item.is_active,
            custom_image: null,
            custom_gallery: [],
            existing_custom_gallery: galleryList,
        });
    }, [item]);

    if (!item) return null;

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleCustomImageChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('custom_image', file);
            const reader = new FileReader();
            reader.onload = (re) =>
                setCustomImagePreview(re.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleCustomGalleryChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPreviews = files.map((file) => ({
                file,
                url: URL.createObjectURL(file),
            }));
            setData('custom_gallery', [...data.custom_gallery, ...files]);
            setNewGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeExistingGalleryImage = (path: string) => {
        const updated = existingGallery.filter((p) => p !== path);
        setExistingGallery(updated);
        setData('existing_custom_gallery', updated);
    };

    const removeNewGalleryImage = (idx: number) => {
        const updatedFiles = data.custom_gallery.filter((_, i) => i !== idx);
        const updatedPreviews = newGalleryPreviews.filter((_, i) => i !== idx);
        setData('custom_gallery', updatedFiles);
        setNewGalleryPreviews(updatedPreviews);
    };

    const handleClose = () => {
        reset();
        setCustomImagePreview(null);
        setExistingGallery([]);
        setNewGalleryPreviews([]);
        onClose();
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        router.post(`/owner/inventory/${item.id}`, data, {
            forceFormData: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-4">
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

                <form onSubmit={handleUpdate} className="space-y-4 text-xs">
                    {/* Product Reference */}
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                        <img
                            src={
                                item.product?.thumbnail_url ||
                                '/images/placeholder-product.svg'
                            }
                            alt="Product"
                            className="h-12 w-12 object-contain"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                    '/images/placeholder-product.svg';
                            }}
                        />
                        <div>
                            <span className="block font-bold text-gray-800">
                                {item.product?.title}
                            </span>
                            <span className="text-[11px] text-gray-500">
                                Base Price:{' '}
                                {formatBDT(item.product?.base_price)}
                            </span>
                        </div>
                    </div>

                    {/* Custom Price */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Selling Price (৳)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder={String(item.product?.base_price || '')}
                            value={data.custom_price}
                            onChange={(e) =>
                                setData('custom_price', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.custom_price && (
                            <span className="text-[11px] text-rose-600">
                                {errors.custom_price}
                            </span>
                        )}
                    </div>

                    {/* Custom Compare Price */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Compare Price / MRP (৳) (Optional)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 135000"
                            value={data.custom_compare_price}
                            onChange={(e) =>
                                setData('custom_compare_price', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    {/* Stock Quantity */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            required
                            min="0"
                            value={data.stock_quantity}
                            onChange={(e) =>
                                setData(
                                    'stock_quantity',
                                    Number(e.target.value),
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        {errors.stock_quantity && (
                            <span className="text-[11px] text-rose-600">
                                {errors.stock_quantity}
                            </span>
                        )}
                    </div>

                    {/* Custom Title */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Custom Title (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder={item.product?.title}
                            value={data.custom_title}
                            onChange={(e) =>
                                setData('custom_title', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    {/* Custom Description */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Custom Description (Optional)
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Add custom warranty, bundle offers, or specific shop terms..."
                            value={data.custom_description}
                            onChange={(e) =>
                                setData('custom_description', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    {/* Custom Main Thumbnail */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Main Thumbnail
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1">
                                {customImagePreview ? (
                                    <img
                                        src={customImagePreview}
                                        alt="Preview"
                                        className="h-full w-full object-contain"
                                    />
                                ) : (
                                    <img
                                        src={
                                            item.display_thumbnail_url ||
                                            '/images/placeholder-product.svg'
                                        }
                                        alt="Default"
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            (
                                                e.currentTarget as HTMLImageElement
                                            ).src =
                                                '/images/placeholder-product.svg';
                                        }}
                                    />
                                )}
                            </div>
                            <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                                <Upload className="h-3.5 w-3.5" />
                                <span>Change Thumbnail</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleCustomImageChange}
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
                                <span>Add Photos</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleCustomGalleryChange}
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
                                            alt={`Gallery ${idx}`}
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

                    {/* Status */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="is_active_toggle"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                            htmlFor="is_active_toggle"
                            className="cursor-pointer font-semibold text-gray-800"
                        >
                            Active (visible in storefront)
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {processing ? 'Saving...' : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
