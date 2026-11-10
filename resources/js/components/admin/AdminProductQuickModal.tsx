import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save } from 'lucide-react';
import type { Product, Category } from '@/types/ecommerce';

interface AdminProductQuickModalProps {
    isOpen: boolean;
    mode: 'create' | 'edit';
    product: Product | null;
    categories: Category[];
    onClose: () => void;
}

export default function AdminProductQuickModal({
    isOpen,
    mode,
    product,
    categories,
    onClose,
}: AdminProductQuickModalProps) {
    const { data, setData, post, put, processing, reset, errors } = useForm({
        category_id: categories[0]?.id || 1,
        title: '',
        sku: '',
        base_price: '',
        compare_price: '',
        description: '',
        is_approved: true,
    });

    useEffect(() => {
        if (!isOpen) return;

        if (mode === 'create') {
            setData({
                category_id: categories[0]?.id || 1,
                title: '',
                sku: '',
                base_price: '',
                compare_price: '',
                description: '',
                is_approved: true,
            });
        } else if (product) {
            setData({
                category_id: product.category_id,
                title: product.title,
                sku: product.sku,
                base_price: String(product.base_price),
                compare_price: product.compare_price ? String(product.compare_price) : '',
                description: product.description || '',
                is_approved: product.is_approved,
            });
        }
    }, [isOpen, mode, product]);

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create') {
            post('/admin/catalog', {
                onSuccess: handleClose,
            });
        } else if (product) {
            put(`/admin/catalog/${product.id}`, {
                onSuccess: handleClose,
            });
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            {mode === 'create' ? 'Quick Add to Catalog' : 'Edit Catalog Product'}
                        </h3>
                        {mode === 'edit' && product && (
                            <p className="text-xs text-gray-500">{product.title}</p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg cursor-pointer"
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
                            placeholder="e.g. Apple MacBook Pro 16 M3 Max"
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
                                onChange={(e) => setData('category_id', Number(e.target.value))}
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
                            <label className="block font-semibold text-gray-700 mb-1">
                                {mode === 'create' ? 'SKU (Optional)' : 'SKU *'}
                            </label>
                            <input
                                type="text"
                                required={mode === 'edit'}
                                placeholder="e.g. MBP-16-M3"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Reference Base Price (৳) *</label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="e.g. 185000"
                                value={data.base_price}
                                onChange={(e) => setData('base_price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Original MRP / Compare (৳)</label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 210000"
                                value={data.compare_price}
                                onChange={(e) => setData('compare_price', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Technical Specs & Description</label>
                        <textarea
                            rows={3}
                            placeholder="Key features, specifications, and warranty details..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
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
                            <span>
                                {processing
                                    ? 'Saving...'
                                    : mode === 'create'
                                    ? 'Publish to Catalog'
                                    : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
