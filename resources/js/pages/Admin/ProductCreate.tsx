import React, { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { ArrowLeft, Save, Upload, Image as ImageIcon, X } from 'lucide-react';
import type { Category } from '@/types/ecommerce';

interface ProductCreateProps {
    categories: (Category & { children?: Category[] })[];
}

export default function ProductCreate({ categories }: ProductCreateProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<{ file: File; previewUrl: string }[]>([]);

    const initialCategory = categories[0] || null;
    const initialSubcategory = initialCategory?.children?.[0] || null;

    const { data, setData, post, processing, errors } = useForm({
        category_id: initialCategory ? initialCategory.id : '',
        subcategory_id: initialSubcategory ? initialSubcategory.id : '',
        title: '',
        slug: '',
        sku: '',
        base_price: '',
        compare_price: '',
        description: '',
        thumbnail: null as File | null,
        gallery: [] as File[],
        is_approved: true,
    });

    // Compute subcategories based on currently selected parent category
    const availableSubcategories = useMemo(() => {
        if (!data.category_id) return [];
        const parent = categories.find((c) => String(c.id) === String(data.category_id));
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
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
        setData({
            ...data,
            title,
            slug,
        });
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

    const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newPreviews = files.map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));

            const updatedGalleryFiles = [...(data.gallery || []), ...files];
            setData('gallery', updatedGalleryFiles);
            setGalleryPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (indexToRemove: number) => {
        const updatedFiles = (data.gallery || []).filter((_, i) => i !== indexToRemove);
        const updatedPreviews = galleryPreviews.filter((_, i) => i !== indexToRemove);
        setData('gallery', updatedFiles);
        setGalleryPreviews(updatedPreviews);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/catalog', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Add Product to Master Catalog">
            <Head title="Add New Product | Admin Console" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header & Breadcrumbs */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-xs text-dark-4 mb-1">
                            <Link href="/admin/catalog" className="hover:underline">
                                Master Catalog
                            </Link>{' '}
                            / <span>New Product</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-dark">Create Catalog Product</h1>
                    </div>
                    <Link
                        href="/admin/catalog"
                        className="px-3.5 py-2 rounded-lg border border-gray-3 bg-white text-dark-3 hover:text-dark hover:bg-gray-50 text-xs font-medium transition flex items-center gap-1.5 shadow-2xs"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Catalog</span>
                    </Link>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-3 p-6 sm:p-8 space-y-6 shadow-sm">
                    {/* Category & Subcategory Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-dark mb-1.5">
                                Primary Category <span className="text-rose-600">*</span>
                            </label>
                            <select
                                required
                                value={data.category_id}
                                onChange={handleCategoryChange}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                            >
                                <option value="">-- Select Category --</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && <span className="text-rose-600 text-[11px]">{errors.category_id}</span>}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-dark">
                                    Subcategory
                                </label>
                                <span className="text-[11px] text-dark-4">
                                    {availableSubcategories.length > 0 ? `${availableSubcategories.length} available` : 'None for this category'}
                                </span>
                            </div>
                            <select
                                value={data.subcategory_id}
                                onChange={(e) => setData('subcategory_id', e.target.value ? Number(e.target.value) : '')}
                                disabled={availableSubcategories.length === 0}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">-- Select Subcategory (Optional) --</option>
                                {availableSubcategories.map((sub) => (
                                    <option key={sub.id} value={sub.id}>
                                        {sub.name}
                                    </option>
                                ))}
                            </select>
                            {errors.subcategory_id && <span className="text-rose-600 text-[11px]">{errors.subcategory_id}</span>}
                        </div>
                    </div>

                    {/* Product Name & SKU */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-dark mb-1.5">
                                Product Title <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Apple MacBook Air 13-inch M3 (8/256GB)"
                                value={data.title}
                                onChange={handleTitleChange}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition font-medium"
                            />
                            {errors.title && <span className="text-rose-600 text-[11px]">{errors.title}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark mb-1.5">
                                SKU / Serial Code <span className="text-dark-4 font-normal">(optional)</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. MBA-M3-256"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition font-mono"
                            />
                            {errors.sku && <span className="text-rose-600 text-[11px]">{errors.sku}</span>}
                        </div>
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs font-semibold text-dark mb-1.5">
                            URL Slug <span className="text-rose-600">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            value={data.slug}
                            onChange={(e) => setData('slug', e.target.value)}
                            placeholder="apple-macbook-air-13-inch-m3"
                            className="w-full bg-gray-1 border border-gray-3 rounded-lg px-3.5 py-2 text-dark-3 text-xs font-mono focus:outline-none focus:border-blue transition"
                        />
                        {errors.slug && <span className="text-rose-600 text-[11px]">{errors.slug}</span>}
                    </div>

                    {/* Pricing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-xs font-semibold text-dark mb-1.5">
                                Reference Base Price (৳) <span className="text-rose-600">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                required
                                placeholder="125000.00"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                            />
                            {errors.base_price && <span className="text-rose-600 text-[11px]">{errors.base_price}</span>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-dark mb-1.5">
                                Compare at Price / MRP (৳) <span className="text-dark-4 font-normal">(optional)</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder="135000.00"
                                value={data.compare_price}
                                onChange={(e) => setData('compare_price', e.target.value)}
                                className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                            />
                            {errors.compare_price && <span className="text-rose-600 text-[11px]">{errors.compare_price}</span>}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-dark mb-1.5">
                            Product Description <span className="text-rose-600">*</span>
                        </label>
                        <textarea
                            rows={4}
                            required
                            placeholder="Provide detailed specifications, features, warranty terms, and box contents..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition leading-relaxed"
                        />
                        {errors.description && <span className="text-rose-600 text-[11px]">{errors.description}</span>}
                    </div>

                    {/* Main Thumbnail Image */}
                    <div>
                        <label className="block text-xs font-semibold text-dark mb-1.5">
                            Main Product Image (Thumbnail) <span className="text-rose-600">*</span>
                        </label>
                        <div className="flex items-start gap-4">
                            <div className="w-24 h-24 rounded-lg bg-[#F6F7FB] border border-gray-3 flex items-center justify-center overflow-hidden shrink-0 text-dark-4 text-xs p-1">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                                ) : (
                                    <div className="text-center p-2">
                                        <ImageIcon className="w-5 h-5 mx-auto mb-1 text-gray-400" />
                                        <span className="text-[10px]">No image</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-1.5">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleMainImageChange}
                                    className="block w-full text-xs text-dark-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-2 file:text-dark hover:file:bg-gray-3 transition cursor-pointer"
                                />
                                <p className="text-xs text-dark-4">
                                    Supports JPG, PNG, WebP up to 4MB. Square aspect ratio on clean white/transparent background is recommended.
                                </p>
                                {errors.thumbnail && <span className="text-rose-600 text-[11px]">{errors.thumbnail}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Product Gallery Images */}
                    <div className="pt-4 border-t border-gray-3 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-xs font-semibold text-dark">
                                    Product Gallery Photos
                                </label>
                                <p className="text-xs text-dark-4">
                                    Upload additional product angles for the storefront gallery slider.
                                </p>
                            </div>
                            {galleryPreviews.length > 0 && (
                                <span className="text-xs text-blue font-semibold">
                                    {galleryPreviews.length} photos selected
                                </span>
                            )}
                        </div>

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGalleryImagesChange}
                            className="block w-full text-xs text-dark-3 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-2 file:text-dark hover:file:bg-gray-3 transition cursor-pointer"
                        />

                        {galleryPreviews.length > 0 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 p-3 bg-gray-1 rounded-lg border border-gray-3">
                                {galleryPreviews.map((g, idx) => (
                                    <div key={idx} className="relative group w-full h-20 rounded-md bg-white border border-gray-3 p-1 flex items-center justify-center overflow-hidden">
                                        <img src={g.previewUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryImage(idx)}
                                            className="absolute top-1 right-1 p-1 rounded-full bg-rose-600 text-white opacity-90 hover:opacity-100 transition shadow-xs cursor-pointer"
                                            title="Remove photo"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-3 flex items-center justify-end gap-3">
                        <Link
                            href="/admin/catalog"
                            className="px-5 py-2.5 rounded-lg border border-gray-3 text-dark-3 hover:text-dark hover:bg-gray-50 text-xs font-medium transition"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-lg bg-blue text-white text-xs font-semibold hover:bg-blue-dark shadow-sm transition flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? 'Publishing...' : 'Save Product to Catalog'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
