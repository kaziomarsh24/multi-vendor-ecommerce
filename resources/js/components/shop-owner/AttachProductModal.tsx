import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import type { Product } from '@/types/ecommerce';

interface AttachProductModalProps {
    shopName: string;
    product: Product | null;
    onClose: () => void;
}

export default function AttachProductModal({
    shopName,
    product,
    onClose,
}: AttachProductModalProps) {
    const { data, setData, post, processing, reset } = useForm({
        product_id: 0,
        custom_price: '',
        custom_compare_price: '',
        stock_quantity: 50,
    });

    useEffect(() => {
        if (!product) return;
        setData({
            product_id: product.id,
            custom_price: String(product.base_price),
            custom_compare_price: product.compare_price
                ? String(product.compare_price)
                : '',
            stock_quantity: 50,
        });
    }, [product]);

    if (!product) return null;

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/owner/catalog/attach', {
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Add Product to Shop
                        </h3>
                        <p className="text-xs text-gray-500">{shopName}</p>
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
                    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                        <img
                            src={
                                product.thumbnail_url ||
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
                            <span className="block font-bold text-gray-900">
                                {product.title}
                            </span>
                            <span className="text-[11px] text-gray-500">
                                Base Price: {formatBDT(product.base_price)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Selling Price (৳) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={data.custom_price}
                            onChange={(e) =>
                                setData('custom_price', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Compare Price / MRP (৳) (Optional)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 140000"
                            value={data.custom_compare_price}
                            onChange={(e) =>
                                setData('custom_compare_price', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue-600"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Stock Quantity *
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
                            <Plus className="h-4 w-4" />
                            <span>
                                {processing ? 'Adding...' : 'Add to Inventory'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
