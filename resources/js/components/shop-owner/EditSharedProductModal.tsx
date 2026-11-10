import React, { useState, useEffect, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X, Save, Upload, Plus, Image as ImageIcon } from 'lucide-react';
import type { Product, Category } from '@/types/ecommerce';

interface EditSharedProductModalProps {
    product: Product | null;
    categories: (Category & { children?: Category[] })[];
    onClose: () => void;
}

export default function EditSharedProductModal({ product, categories, onClose }: EditSharedProductModalProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [existingGallery, setExistingGallery] = useState<string[]>([]);
    const [newGalleryPreviews, setNewGalleryPreviews] = useState<{ file: File; url: string }[]>([]);

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
        const isChildCategory = !cat && categories.some((c) => c.children?.some((child) => child.id === product.category_id));

        let resolvedCatId: number | string = product.category_id || '';
        let resolvedSubId: number | string = '';

        if (isChildCategory) {
            const parent = categories.find((c) => c.children?.some((child) => child.id === product.category_id));
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
            compare_price: product.compare_price ? String(product.compare_price) : '',
            description: product.description || '',
            image: null,
            gallery: [],
            existing_gallery: galleryList,
        });
    }, [product]);

    const availableSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        const parent = categories.find((c) => String(c.id) === String(data.category_id));
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
            reader.onload = (re) => setImagePreview(re.target?.result as string);
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Edit Product</h3>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Product Title *</label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                        {errors.title && <span className="text-rose-600 text-[11px]">{errors.title}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                            <select
                                value={data.category_id}
                                onChange={(e) => {
                                    const catId = Number(e.target.value);
                                    const parent = categories.find((c) => c.id === catId);
                                    setData((prev) => ({
                                        ...prev,
                                        category_id: catId,
                                        subcategory_id: parent?.children?.[0]?.id || '',
                                    }));
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            >
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Subcategory</label>
                            <select
                                value={data.subcategory_id}
                                onChange={(e) => setData('subcategory_id', e.target.value ? Number(e.target.value) : '')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
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
                            <label className="block font-semibold text-gray-700 mb-1">Base Price (৳) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Compare Price / MRP (৳)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={data.compare_price}
                                onChange={(e) => setData('compare_price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Description *</label>
                        <textarea
                            rows={3}
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Main Thumbnail */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                            Main Thumbnail
                        </label>
                        <div className="flex items-center gap-3">
                            <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <ImageIcon className="w-6 h-6 text-gray-300" />
                                )}
                            </div>
                            <label className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5">
                                <Upload className="w-3.5 h-3.5" />
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
                        <div className="flex items-center justify-between mb-1">
                            <label className="block font-semibold text-gray-700">
                                Gallery Photos
                            </label>
                            <label className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" />
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

                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                            {/* Existing Gallery Photos */}
                            {existingGallery.map((imgPath, idx) => {
                                const resolvedUrl = imgPath.startsWith('http') || imgPath.startsWith('/')
                                    ? imgPath
                                    : `/storage/${imgPath}`;
                                return (
                                    <div key={`existing-${idx}`} className="relative aspect-square bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-center overflow-hidden">
                                        <img
                                            src={resolvedUrl}
                                            alt={`Existing ${idx}`}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingGalleryImage(imgPath)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600 transition"
                                            title="Remove photo"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                );
                            })}

                            {/* Newly selected gallery photos */}
                            {newGalleryPreviews.map((preview, idx) => (
                                <div key={`new-${idx}`} className="relative aspect-square bg-blue-50 border border-blue-300 rounded-lg p-1 flex items-center justify-center overflow-hidden">
                                    <img src={preview.url} alt={`New ${idx}`} className="max-h-full max-w-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewGalleryImage(idx)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600 transition"
                                        title="Remove photo"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Updating...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
