import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import Pagination from '@/components/Pagination';
import EditShopModal from '@/components/admin/EditShopModal';
import {
    Store,
    Plus,
    Search,
    Edit3,
    Trash2,
    ExternalLink,
    ShieldCheck,
} from 'lucide-react';
import type { Shop, User, PaginatedData } from '@/types/ecommerce';

interface ShopsProps {
    shops: PaginatedData<Shop>;
    availableOwners: User[];
    filters: {
        search?: string;
    };
}

export default function AdminShops({
    shops,
    availableOwners,
    filters,
}: ShopsProps) {
    const [editingShop, setEditingShop] = useState<Shop | null>(null);

    const handleDelete = (shop: Shop) => {
        if (
            confirm(
                `Are you sure you want to delete "${shop.name}"? All assigned products will be unlinked.`,
            )
        ) {
            router.delete(`/admin/shops/${shop.id}`);
        }
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get('/admin/shops', { search }, { preserveState: true });
    };

    return (
        <AdminLayout title="Verified Merchant Shops">
            <Head title="Shop Management | Admin Console" />

            {/* Header & Controls */}
            <div className="mb-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-3 bg-white p-4 shadow-2xs md:flex-row">
                <form
                    onSubmit={handleSearch}
                    className="relative flex-1 md:w-80"
                >
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="Search shops by name, address, or owner..."
                        className="w-full rounded-lg border border-gray-3 bg-white py-2 pr-3.5 pl-9 text-xs text-dark transition focus:border-blue focus:outline-none"
                    />
                    <Search className="absolute top-2.5 left-3 h-4 w-4 text-dark-4" />
                </form>

                <Link
                    href="/admin/shops/create"
                    className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-blue px-4 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark md:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    <span>Register New Shop</span>
                </Link>
            </div>

            {/* Shops Table */}
            <div className="overflow-hidden rounded-xl border border-gray-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-3 p-5">
                    <div>
                        <h2 className="text-sm font-bold text-dark">
                            All Registered Stores
                        </h2>
                        <p className="mt-0.5 text-xs text-dark-4">
                            Manage vendor tenant accounts and inventory
                            permissions.
                        </p>
                    </div>
                    <span className="bg-blue-light-5 rounded-full px-2.5 py-1 text-xs font-bold text-blue">
                        {shops.total} Total Shops
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                        <thead>
                            <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold tracking-wider text-dark-4 uppercase">
                                <th className="px-6 py-4">Store Identity</th>
                                <th className="px-6 py-4">Assigned Merchant</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Inventory Size</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-2 text-dark-3">
                            {shops.data.length > 0 ? (
                                shops.data.map((shop) => (
                                    <tr
                                        key={shop.id}
                                        className="transition hover:bg-gray-1/50"
                                    >
                                        {/* Store Name & Logo */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-2 bg-gray-1 p-1">
                                                    {shop.logo_url ? (
                                                        <img
                                                            src={shop.logo_url}
                                                            alt={shop.name}
                                                            className="h-full w-full object-contain"
                                                            onError={(e) => {
                                                                (
                                                                    e.currentTarget as HTMLImageElement
                                                                ).src =
                                                                    '/images/placeholder-product.svg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <Store className="text-dark-5 h-5 w-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-dark">
                                                            {shop.name}
                                                        </span>
                                                        {shop.is_verified && (
                                                            <span title="Verified Merchant">
                                                                <ShieldCheck className="h-3.5 w-3.5 text-blue" />
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-dark-5 mt-0.5 block text-[11px]">
                                                        slug: {shop.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Assigned Merchant Owner */}
                                        <td className="px-6 py-4">
                                            {shop.owner ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-blue-light-5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-blue">
                                                        {shop.owner.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="block leading-snug font-semibold text-dark">
                                                            {shop.owner.name}
                                                        </span>
                                                        <span className="text-dark-5 block text-[11px]">
                                                            {shop.owner.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-dark-5 italic">
                                                    Unassigned
                                                </span>
                                            )}
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4 text-dark-4">
                                            <div>
                                                {shop.phone || 'No phone'}
                                            </div>
                                            <div className="text-dark-5 max-w-xs truncate text-[11px]">
                                                {shop.address || 'No address'}
                                            </div>
                                        </td>

                                        {/* Inventory count */}
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-dark">
                                                {shop.shop_products_count ?? 0}
                                            </span>{' '}
                                            <span className="text-dark-5">
                                                products
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                                    shop.is_active
                                                        ? 'bg-green-light-6 text-green'
                                                        : 'bg-red-light-6 text-red'
                                                }`}
                                            >
                                                <span
                                                    className={`h-1.5 w-1.5 rounded-full ${
                                                        shop.is_active
                                                            ? 'bg-green'
                                                            : 'bg-red'
                                                    }`}
                                                />
                                                {shop.is_active
                                                    ? 'Active'
                                                    : 'Suspended'}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {/* Visit Storefront Shop */}
                                                <a
                                                    href={`/shops/${shop.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="cursor-pointer rounded-lg border border-gray-3 p-1.5 text-dark-3 transition hover:border-blue hover:text-blue"
                                                    title="View Public Storefront"
                                                >
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>

                                                {/* Edit Shop */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setEditingShop(shop)
                                                    }
                                                    className="cursor-pointer rounded-lg border border-gray-3 p-1.5 text-dark-3 transition hover:border-blue hover:text-blue"
                                                    title="Edit Store Information"
                                                >
                                                    <Edit3 className="h-3.5 w-3.5" />
                                                </button>

                                                {/* Delete Shop */}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleDelete(shop)
                                                    }
                                                    className="cursor-pointer rounded-lg border border-red/20 p-1.5 text-red transition hover:bg-red/10"
                                                    title="Delete Store"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-dark-5 px-6 py-12 text-center"
                                    >
                                        No merchant shops found matching
                                        criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <Pagination
                links={shops.links}
                from={shops.from}
                to={shops.to}
                total={shops.total}
                className="mt-6"
            />

            {/* Modular Edit Shop Modal */}
            <EditShopModal
                shop={editingShop}
                availableOwners={availableOwners}
                onClose={() => setEditingShop(null)}
            />
        </AdminLayout>
    );
}
