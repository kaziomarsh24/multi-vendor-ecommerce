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
                compare_price: product.compare_price
                    ? String(product.compare_price)
                    : '',
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            {mode === 'create'
                                ? 'Quick Add to Catalog'
                                : 'Edit Catalog Product'}
                        </h3>
                        {mode === 'edit' && product && (
                            <p className="text-xs text-gray-500">
                                {product.title}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="cursor-pointer rounded-lg p-1 text-gray-400 hover:text-gray-600"
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
                            placeholder="e.g. Apple MacBook Pro 16 M3 Max"
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
                                onChange={(e) =>
                                    setData(
                                        'category_id',
                                        Number(e.target.value),
                                    )
                                }
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
                                {mode === 'create' ? 'SKU (Optional)' : 'SKU *'}
                            </label>
                            <input
                                type="text"
                                required={mode === 'edit'}
                                placeholder="e.g. MBP-16-M3"
                                value={data.sku}
                                onChange={(e) => setData('sku', e.target.value)}
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Reference Base Price (৳) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                required
                                placeholder="e.g. 185000"
                                value={data.base_price}
                                onChange={(e) =>
                                    setData('base_price', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Original MRP / Compare (৳)
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                placeholder="e.g. 210000"
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
                            Technical Specs & Description
                        </label>
                        <textarea
                            rows={3}
                            placeholder="Key features, specifications, and warranty details..."
                            value={data.description}
                            onChange={(e) =>
                                setData('description', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        />
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
