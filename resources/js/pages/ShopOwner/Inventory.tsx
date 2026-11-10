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
import type {
    Shop,
    ShopProduct,
    Category,
    PaginatedData,
} from '@/types/ecommerce';

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

export default function Inventory({
    shop,
    shopProducts,
    categories,
    filters,
}: InventoryProps) {
    const [editingItem, setEditingItem] = useState<ShopProduct | null>(null);

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleDelete = (item: ShopProduct) => {
        if (
            confirm(
                `Are you sure you want to remove "${item.display_title}" from your shop inventory?`,
            )
        ) {
            router.delete(`/owner/inventory/${item.id}`);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(
            '/owner/inventory',
            { ...filters, search },
            { preserveState: true },
        );
    };

    const handleFilterChange = (key: string, value: string) => {
        router.get(
            '/owner/inventory',
            { ...filters, [key]: value || undefined },
            { preserveState: true },
        );
    };

    return (
        <ShopOwnerLayout title={`${shop.name} | Inventory`}>
            <Head title="Inventory" />

            {/* Top Stat Bar */}
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Assigned Items
                        </span>
                        <span className="mt-0.5 block text-2xl font-extrabold text-gray-900">
                            {shopProducts.total}
                        </span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                        <Boxes className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Active Products
                        </span>
                        <span className="mt-0.5 block text-2xl font-extrabold text-emerald-600">
                            {
                                shopProducts.data.filter((i) => i.is_active)
                                    .length
                            }
                        </span>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-600">
                        <CheckCircle2 className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm">
                    <div>
                        <span className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase">
                            Master Catalog
                        </span>
                        <Link
                            href="/owner/catalog"
                            className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                        >
                            <Plus className="h-4 w-4" />
                            Browse Catalog
                        </Link>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 font-bold text-purple-600">
                        <Layers className="h-6 w-6" />
                    </div>
                </div>
            </div>

            {/* Filter and Action Header */}
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm md:flex-row">
                <div className="flex w-full items-center gap-3 md:w-auto">
                    {/* Search Input */}
                    <form
                        onSubmit={handleSearch}
                        className="relative flex-1 md:w-64"
                    >
                        <input
                            type="text"
                            name="search"
                            defaultValue={filters.search || ''}
                            placeholder="Search by title or SKU..."
                            className="w-full rounded-lg border border-gray-300 py-2 pr-3 pl-9 text-xs outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
                    </form>

                    {/* Category Filter */}
                    <select
                        value={filters.category || ''}
                        onChange={(e) =>
                            handleFilterChange('category', e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none"
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
                        onChange={(e) =>
                            handleFilterChange('status', e.target.value)
                        }
                        className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-700 outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Hidden Only</option>
                    </select>
                </div>

                <Link
                    href="/owner/catalog"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 md:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    <span>Add from Catalog</span>
                </Link>
            </div>

            {/* Inventory Table */}
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-gray-600">
                        <thead className="border-b border-gray-200 bg-[#F8FAFC] text-[11px] font-bold tracking-wider text-gray-700 uppercase">
                            <tr>
                                <th className="px-6 py-4">Product Details</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Base Price</th>
                                <th className="px-6 py-4">Shop Price / MRP</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Storefront Status</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {shopProducts.data.length > 0 ? (
                                shopProducts.data.map((item) => {
                                    const hasCustomPrice =
                                        item.custom_price !== null &&
                                        item.custom_price !== undefined;
                                    const displayPrice = item.display_price;
                                    const displayCompare =
                                        item.display_compare_price;

                                    return (
                                        <tr
                                            key={item.id}
                                            className="transition hover:bg-gray-50/60"
                                        >
                                            {/* Product Details */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-gray-200/80 bg-gray-50 p-1">
                                                        <img
                                                            src={
                                                                item.display_thumbnail_url ||
                                                                '/images/placeholder-product.svg'
                                                            }
                                                            alt={
                                                                item.display_title
                                                            }
                                                            className="h-full w-full object-contain"
                                                            onError={(e) => {
                                                                (
                                                                    e.currentTarget as HTMLImageElement
                                                                ).src =
                                                                    '/images/placeholder-product.svg';
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="line-clamp-1 block font-bold text-gray-900">
                                                            {item.display_title}
                                                        </span>
                                                        <span className="mt-0.5 block text-[11px] text-gray-400">
                                                            SKU:{' '}
                                                            {item.product
                                                                ?.sku || 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-6 py-4 font-medium text-gray-600">
                                                {item.product?.category?.name ||
                                                    'Uncategorized'}
                                            </td>

                                            {/* Base Price */}
                                            <td className="px-6 py-4 font-semibold text-gray-500">
                                                {formatBDT(
                                                    item.product?.base_price,
                                                )}
                                            </td>

                                            {/* Shop Price */}
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span
                                                        className={`font-bold ${hasCustomPrice ? 'text-blue-600' : 'text-gray-900'}`}
                                                    >
                                                        {formatBDT(
                                                            displayPrice,
                                                        )}
                                                    </span>
                                                    {displayCompare && (
                                                        <span className="text-[11px] text-gray-400 line-through">
                                                            {formatBDT(
                                                                displayCompare,
                                                            )}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Stock */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                                        item.stock_quantity > 10
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : item.stock_quantity >
                                                                0
                                                              ? 'bg-amber-50 text-amber-700'
                                                              : 'bg-rose-50 text-rose-700'
                                                    }`}
                                                >
                                                    {item.stock_quantity > 0
                                                        ? `${item.stock_quantity} in stock`
                                                        : 'Out of stock'}
                                                </span>
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                                        item.is_active
                                                            ? 'bg-emerald-50 text-emerald-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-gray-400'}`}
                                                    />
                                                    {item.is_active
                                                        ? 'Active'
                                                        : 'Hidden'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setEditingItem(item)
                                                        }
                                                        className="cursor-pointer rounded-lg p-1.5 text-blue-600 transition hover:bg-blue-50"
                                                        title="Edit Product"
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(item)
                                                        }
                                                        className="cursor-pointer rounded-lg p-1.5 text-rose-600 transition hover:bg-rose-50"
                                                        title="Remove from Shop"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-6 py-12 text-center text-gray-400"
                                    >
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
