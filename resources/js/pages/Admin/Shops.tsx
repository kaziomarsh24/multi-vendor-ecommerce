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
    CheckCircle2,
    XCircle,
    User as UserIcon,
} from 'lucide-react';
import type { Shop, User, PaginatedData } from '@/types/ecommerce';

interface ShopsProps {
    shops: PaginatedData<Shop>;
    availableOwners: User[];
    filters: {
        search?: string;
    };
}

export default function AdminShops({ shops, availableOwners, filters }: ShopsProps) {
    const [editingShop, setEditingShop] = useState<Shop | null>(null);

    const handleDelete = (shop: Shop) => {
        if (confirm(`Are you sure you want to delete "${shop.name}"? All assigned products will be unlinked.`)) {
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
            <div className="bg-white rounded-xl p-4 border border-gray-3 shadow-2xs mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <form onSubmit={handleSearch} className="relative flex-1 md:w-80">
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters.search || ''}
                        placeholder="Search shops by name, address, or owner..."
                        className="w-full pl-9 pr-3.5 py-2 text-xs border border-gray-3 rounded-lg focus:outline-none focus:border-blue text-dark bg-white transition"
                    />
                    <Search className="w-4 h-4 text-dark-4 absolute left-3 top-2.5" />
                </form>

                <Link
                    href="/admin/shops/create"
                    className="w-full md:w-auto bg-blue hover:bg-blue-dark text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                    <Plus className="w-4 h-4" />
                    <span>Register New Shop</span>
                </Link>
            </div>

            {/* Shops Table */}
            <div className="bg-white rounded-xl border border-gray-3 shadow-2xs overflow-hidden">
                <div className="p-5 border-b border-gray-3 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-bold text-dark">All Registered Stores</h2>
                        <p className="text-xs text-dark-4 mt-0.5">Manage vendor tenant accounts and inventory permissions.</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-light-5 text-blue">
                        {shops.total} Total Shops
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-gray-2 bg-gray-1 text-[11px] font-bold text-dark-4 uppercase tracking-wider">
                                <th className="px-6 py-4">Store Identity</th>
                                <th className="px-6 py-4">Assigned Merchant</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4">Inventory Size</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-2 text-dark-3">
                            {shops.data.length > 0 ? (
                                shops.data.map((shop) => (
                                    <tr key={shop.id} className="hover:bg-gray-1/50 transition">
                                        {/* Store Name & Logo */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-xl bg-gray-1 border border-gray-2 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                                    {shop.logo_url ? (
                                                        <img
                                                            src={shop.logo_url}
                                                            alt={shop.name}
                                                            className="w-full h-full object-contain"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                                            }}
                                                        />
                                                    ) : (
                                                        <Store className="w-5 h-5 text-dark-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="font-bold text-dark">{shop.name}</span>
                                                        {shop.is_verified && (
                                                            <ShieldCheck className="w-3.5 h-3.5 text-blue" title="Verified Merchant" />
                                                        )}
                                                    </div>
                                                    <span className="text-[11px] text-dark-5 block mt-0.5">
                                                        slug: {shop.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Assigned Merchant Owner */}
                                        <td className="px-6 py-4">
                                            {shop.owner ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-blue-light-5 text-blue flex items-center justify-center font-bold text-xs shrink-0">
                                                        {shop.owner.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-dark block leading-snug">
                                                            {shop.owner.name}
                                                        </span>
                                                        <span className="text-[11px] text-dark-5 block">
                                                            {shop.owner.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-dark-5 italic">Unassigned</span>
                                            )}
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4 text-dark-4">
                                            <div>{shop.phone || 'No phone'}</div>
                                            <div className="text-[11px] text-dark-5 truncate max-w-xs">{shop.address || 'No address'}</div>
                                        </td>

                                        {/* Inventory count */}
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-dark">
                                                {shop.shop_products_count ?? 0}
                                            </span>{' '}
                                            <span className="text-dark-5">products</span>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                                                    shop.is_active
                                                        ? 'bg-green-light-6 text-green'
                                                        : 'bg-red-light-6 text-red'
                                                }`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${
                                                        shop.is_active ? 'bg-green' : 'bg-red'
                                                    }`}
                                                />
                                                {shop.is_active ? 'Active' : 'Suspended'}
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
                                                    className="p-1.5 rounded-lg border border-gray-3 text-dark-3 hover:border-blue hover:text-blue transition cursor-pointer"
                                                    title="View Public Storefront"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </a>

                                                {/* Edit Shop */}
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingShop(shop)}
                                                    className="p-1.5 rounded-lg border border-gray-3 text-dark-3 hover:border-blue hover:text-blue transition cursor-pointer"
                                                    title="Edit Store Information"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                {/* Delete Shop */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(shop)}
                                                    className="p-1.5 rounded-lg border border-red/20 text-red hover:bg-red/10 transition cursor-pointer"
                                                    title="Delete Store"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-dark-5">
                                        No merchant shops found matching criteria.
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
