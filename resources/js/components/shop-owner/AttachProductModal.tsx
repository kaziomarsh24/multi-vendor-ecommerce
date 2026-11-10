import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';
import type { Product } from '@/types/ecommerce';

interface AttachProductModalProps {
    shopName: string;
    product: Product | null;
    onClose: () => void;
}

export default function AttachProductModal({ shopName, product, onClose }: AttachProductModalProps) {
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
            custom_compare_price: product.compare_price ? String(product.compare_price) : '',
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Add Product to Shop</h3>
                        <p className="text-xs text-gray-500">{shopName}</p>
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
                    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                        <img
                            src={product.thumbnail_url || '/images/placeholder-product.svg'}
                            alt="Product"
                            className="w-12 h-12 object-contain"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                            }}
                        />
                        <div>
                            <span className="font-bold text-gray-900 block">{product.title}</span>
                            <span className="text-[11px] text-gray-500">
                                Base Price: {formatBDT(product.base_price)}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                            Selling Price (৳) *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={data.custom_price}
                            onChange={(e) => setData('custom_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">
                            Compare Price / MRP (৳) (Optional)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 140000"
                            value={data.custom_compare_price}
                            onChange={(e) => setData('custom_compare_price', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-600 outline-none"
                        />
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Stock Quantity *</label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={data.stock_quantity}
                            onChange={(e) => setData('stock_quantity', Number(e.target.value))}
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
                            <Plus className="w-4 h-4" />
                            <span>{processing ? 'Adding...' : 'Add to Inventory'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
