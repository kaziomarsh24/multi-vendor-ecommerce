import React, { useState, useMemo } from 'react';
import { useForm, router } from '@inertiajs/react';
import { X, Save, Upload, Plus } from 'lucide-react';
import type { Category } from '@/types/ecommerce';

interface CreateSharedProductModalProps {
    isOpen: boolean;
    categories: (Category & { children?: Category[] })[];
    onClose: () => void;
}

export default function CreateSharedProductModal({ isOpen, categories, onClose }: CreateSharedProductModalProps) {
    const initialCat = categories[0] || null;
    const initialSub = initialCat?.children?.[0] || null;

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<{ file: File; url: string }[]>([]);

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
        const parent = categories.find((c) => String(c.id) === String(data.category_id));
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
            reader.onload = (re) => setImagePreview(re.target?.result as string);
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Create New Product</h3>
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
                            placeholder="e.g. Wireless Noise Canceling Headphones"
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
                            <label className="block font-semibold text-gray-700 mb-1">SKU (Optional)</label>
                            <input
                                type="text"
                                placeholder="e.g. WH-1000XM5"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Initial Stock Units *</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Base Price (৳) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="e.g. 35000"
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
                                placeholder="e.g. 40000"
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
                            placeholder="Product specifications, features, warranty..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    {/* Main Product Image */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                            Main Thumbnail (JPG, PNG, WebP)
                        </label>
                        {imagePreview ? (
                            <div className="flex items-center gap-3">
                                <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-200 p-1 flex items-center justify-center relative">
                                    <img src={imagePreview} alt="Thumbnail preview" className="max-h-full max-w-full object-contain" />
                                    <button
                                        type="button"
                                        onClick={removeMainImage}
                                        className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow-sm hover:bg-rose-700"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <label className="border border-dashed border-gray-300 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50 hover:bg-blue-50/30 transition">
                                <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                <span className="text-xs text-gray-600 font-medium">Click to upload main image</span>
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
                        <div className="flex items-center justify-between mb-1">
                            <label className="block font-semibold text-gray-700">
                                Gallery Photos (Optional)
                            </label>
                            <label className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                                <Plus className="w-3.5 h-3.5" />
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
                            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 p-2 bg-gray-50 rounded-xl border border-gray-200">
                                {galleryPreviews.map((preview, idx) => (
                                    <div key={idx} className="relative aspect-square bg-white border border-gray-200 rounded-lg p-1 flex items-center justify-center overflow-hidden">
                                        <img src={preview.url} alt={`Gallery ${idx}`} className="max-h-full max-w-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(idx)}
                                            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-rose-600 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-[11px] text-gray-400">No additional gallery photos selected.</p>
                        )}
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
                            <span>{processing ? 'Saving...' : 'Create Product'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
