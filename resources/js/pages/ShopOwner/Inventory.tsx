import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ShopOwnerLayout from '@/layouts/ShopOwnerLayout';
import Pagination from '@/components/Pagination';
import InventoryEditModal from '@/components/shop-owner/InventoryEditModal';
import {
    Boxes,
    Search,
    Edit3,
    Trash2,
    Plus,
    CheckCircle2,
    Layers,
} from 'lucide-react';
import type { Shop, ShopProduct, Category, PaginatedData } from '@/types/ecommerce';

interface InventoryProps {
    shop: Shop;
    shopProducts: PaginatedData<ShopProduct>;
    categories: (Category & { children?: Category[] })[];
    filters: {
        category?: string;
        search?: string;
        status?: string;
    };
}

export default function Inventory({ shop, shopProducts, categories, filters }: InventoryProps) {
    const [editingItem, setEditingItem] = useState<ShopProduct | null>(null);

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleDelete = (item: ShopProduct) => {
        if (confirm(`Are you sure you want to remove "${item.display_title}" from your shop inventory?`)) {
            router.delete(`/owner/inventory/${item.id}`);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get('/owner/inventory', { ...filters, search }, { preserveState: true });
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get('/owner/inventory', { ...filters, [key]: value || undefined }, { preserveState: true });
    };

    return (
        <ShopOwnerLayout title={`${shop.name} | Inventory`}>
            <Head title="Inventory" />

            {/* Top Stat Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Assigned Items</span>
                        <span className="text-2xl font-extrabold text-gray-900 mt-0.5 block">{shopProducts.total}</span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Boxes className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Active Products</span>
                        <span className="text-2xl font-extrabold text-emerald-600 mt-0.5 block">
                            {shopProducts.data.filter((i) => i.is_active).length}
                        </span>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex items-center justify-between">
                    <div>
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Master Catalog</span>
                        <Link
                            href="/owner/catalog"
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline mt-2"
                        >
                            <Plus className="w-4 h-4" />
                            Browse Catalog
                        </Link>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                        <Layers className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Filter and Action Header */}
            <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* Search Input */}
                    <form onSubmit={handleSearch} className="relative flex-1 md:w-64">
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Search by title or SKU..."
                            className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-600 focus:border-blue-600 outline-none"
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </form>

                    {/* Category Filter */}
                    <select
                        value={filters.category || ''}
                        onChange={(e) => handleFilterChange('category', e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-3 py-2 text-gray-700 outline-none"
                    >
                        <option value="">All Categories</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    {/* Status Filter */}
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="text-xs border border-gray-300 rounded-lg px-3 py-2 text-gray-700 outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Hidden Only</option>
                    </select>
                </div>

                <Link
                    href="/owner/catalog"
                    className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                    <Plus className="w-4 h-4" />
                    <span>Add from Catalog</span>
                </Link>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="bg-[#F8FAFC] text-gray-700 text-[11px] uppercase tracking-wider font-bold border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Base Price</th>
                                <th className="px-6 py-4">Shop Price / MRP</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Storefront Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {shopProducts.data.length > 0 ? (
                                shopProducts.data.map((item) => {
                                    const hasCustomPrice = item.custom_price !== null && item.custom_price !== undefined;
                                    const displayPrice = item.display_price;
                                    const displayCompare = item.display_compare_price;

                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50/60 transition">
                                            {/* Product Details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200/80 flex items-center justify-center shrink-0 p-1">
                                                        <img
                                                            src={item.display_thumbnail_url || '/images/placeholder-product.svg'}
                                                            alt={item.display_title}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 block line-clamp-1">
                                                            {item.display_title}
                                                        </span>
                                                        <span className="text-[11px] text-gray-400 block mt-0.5">
                                                            SKU: {item.product?.sku || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4 font-medium text-gray-600">
                                                {item.product?.category?.name || 'Uncategorized'}
                                            </td>

                                            {/* Base Price */}
                                            <td className="px-6 py-4 font-semibold text-gray-500">
                                                {formatBDT(item.product?.base_price)}
                                            </td>

                                            {/* Shop Price */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className={`font-bold ${hasCustomPrice ? 'text-blue-600' : 'text-gray-900'}`}>
                                                        {formatBDT(displayPrice)}
                                                    </span>
                                                    {displayCompare && (
                                                        <span className="text-[11px] text-gray-400 line-through">
                                                            {formatBDT(displayCompare)}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                                        item.stock_quantity > 10
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : item.stock_quantity > 0
                                                            ? 'bg-amber-50 text-amber-700'
                                                            : 'bg-rose-50 text-rose-700'
                                                    }`}
                                                >
                                                    {item.stock_quantity > 0 ? `${item.stock_quantity} in stock` : 'Out of stock'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                                        item.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                                                    {item.is_active ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditingItem(item)}
                                                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition cursor-pointer"
                                                        title="Edit Product"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item)}
                                                        className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                                        title="Remove from Shop"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        No products found in this inventory.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                links={shopProducts.links}
                from={shopProducts.from}
                to={shopProducts.to}
                total={shopProducts.total}
                className="mt-4"
            />

            {/* Modular Edit Modal */}
            <InventoryEditModal
                item={editingItem}
                onClose={() => setEditingItem(null)}
            />
        </ShopOwnerLayout>
    );
}
