import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Plus, ExternalLink, Store } from 'lucide-react';
import type { Shop, Product, User } from '@/types/ecommerce';

interface DashboardShop extends Shop {
    shop_products_count?: number;
}

interface DashboardProduct extends Product {
    shop_products_count?: number;
}

interface DashboardProps {
    stats: {
        total_shops: number;
        active_shops: number;
        total_catalog_products: number;
        total_shop_products: number;
        total_categories: number;
        total_shop_owners: number;
        total_customers: number;
    };
    recentShops: DashboardShop[];
    recentProducts: DashboardProduct[];
    recentUsers: (User & { shop?: Shop; created_at: string })[];
}

export default function Dashboard({
    stats,
    recentShops,
    recentProducts,
    recentUsers,
}: DashboardProps) {
    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    return (
        <AdminLayout title="Platform Dashboard Overview">
            <Head title="Admin Dashboard | CSN Multi-Shop" />

            <div className="space-y-6">
                {/* Header & Quick Actions */}
                <div className="flex flex-col justify-between gap-4 border-b border-gray-3 pb-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-bold text-dark">
                            Dashboard
                        </h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/admin/shops"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue px-3.5 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Create New Shop</span>
                        </Link>
                        <Link
                            href="/admin/catalog/create"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-xs font-semibold text-dark shadow-2xs transition hover:border-dark"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Master Product</span>
                        </Link>
                    </div>
                </div>

                {/* Stat Cards Grid (Authentic Nextmerce Admin Style) */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-gray-3 bg-white p-5 shadow-2xs">
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                            Registered Shops
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">
                                {stats.total_shops}
                            </span>
                            <span className="text-xs font-semibold text-green">
                                {stats.active_shops} Active
                            </span>
                        </div>
                        <Link
                            href="/admin/shops"
                            className="mt-3 block text-[11px] font-semibold text-blue hover:underline"
                        >
                            Manage Shops &rarr;
                        </Link>
                    </div>

                    <div className="rounded-xl border border-gray-3 bg-white p-5 shadow-2xs">
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                            Master Catalog Items
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">
                                {stats.total_catalog_products}
                            </span>
                            <span className="text-xs font-normal text-dark-4">
                                Platform Total
                            </span>
                        </div>
                        <Link
                            href="/admin/catalog"
                            className="mt-3 block text-[11px] font-semibold text-blue hover:underline"
                        >
                            Browse Catalog &rarr;
                        </Link>
                    </div>

                    <div className="rounded-xl border border-gray-3 bg-white p-5 shadow-2xs">
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                            Assigned Shop Stock
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">
                                {stats.total_shop_products}
                            </span>
                            <span className="text-xs font-normal text-dark-4">
                                Active in Stores
                            </span>
                        </div>
                        <Link
                            href="/admin/shops"
                            className="mt-3 block text-[11px] font-semibold text-blue hover:underline"
                        >
                            View Shops & Stock &rarr;
                        </Link>
                    </div>

                    <div className="rounded-xl border border-gray-3 bg-white p-5 shadow-2xs">
                        <span className="mb-1 block text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                            Categories
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">
                                {stats.total_categories}
                            </span>
                            <span className="text-xs font-semibold text-green">
                                Configured
                            </span>
                        </div>
                        <Link
                            href="/admin/categories"
                            className="mt-3 block text-[11px] font-semibold text-blue hover:underline"
                        >
                            Manage Categories &rarr;
                        </Link>
                    </div>
                </div>

                {/* Registered Shops Table Card */}
                <div className="overflow-hidden rounded-xl border border-gray-3 bg-white shadow-2xs">
                    <div className="flex items-center justify-between border-b border-gray-3 p-5">
                        <div>
                            <h2 className="text-sm font-bold text-dark">
                                Registered Shops
                            </h2>
                        </div>
                        <Link
                            href="/admin/shops"
                            className="text-xs font-bold text-blue hover:underline"
                        >
                            View All Shops &rarr;
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-gray-3 bg-gray-1 text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                                    <th className="px-5 py-3">Shop Details</th>
                                    <th className="px-5 py-3">
                                        Assigned Owner
                                    </th>
                                    <th className="px-5 py-3">Location</th>
                                    <th className="px-5 py-3">
                                        Assigned Inventory
                                    </th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-3">
                                {recentShops.map((shop) => (
                                    <tr
                                        key={shop.id}
                                        className="transition hover:bg-gray-1/50"
                                    >
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-2 bg-gray-1 p-1">
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
                                                        <Store className="text-dark-5 h-4 w-4" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-dark">
                                                        {shop.name}
                                                    </span>
                                                    <span className="text-dark-5 block text-[11px]">
                                                        /shops/{shop.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="block font-medium text-dark">
                                                {shop.owner?.name ||
                                                    'Unassigned'}
                                            </span>
                                            <span className="block text-[10px] text-dark-4">
                                                {shop.owner?.email}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-dark-4">
                                            {shop.address ||
                                                'Dhaka, Bangladesh'}
                                        </td>
                                        <td className="px-5 py-3.5 font-semibold text-dark">
                                            <span className="rounded-full bg-blue/10 px-2.5 py-1 text-[11px] font-bold text-blue">
                                                {shop.shop_products_count ?? 0}{' '}
                                                Products Stocked
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-green">
                                                <span className="h-1.5 w-1.5 rounded-full bg-green" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="space-x-3 px-5 py-3.5 text-right text-xs">
                                            <a
                                                href={`/shops/${shop.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="inline-flex items-center gap-1 font-medium text-dark-3 hover:text-blue"
                                            >
                                                <span>Storefront</span>
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                            <Link
                                                href="/admin/shops"
                                                className="font-semibold text-blue hover:underline"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Platform Users & Roles */}
                <div className="overflow-hidden rounded-xl border border-gray-3 bg-white shadow-2xs">
                    <div className="flex items-center justify-between border-b border-gray-3 p-5">
                        <div>
                            <h2 className="text-sm font-bold text-dark">
                                Platform Users & Roles
                            </h2>
                            <p className="text-dark-5 mt-0.5 text-[11px]">
                                Registered accounts across administrator,
                                merchant, and customer roles
                            </p>
                        </div>
                        <span className="text-xs font-semibold text-dark-4">
                            {recentUsers.length} Recent Accounts
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-gray-3 bg-gray-1 text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                                    <th className="px-5 py-3">User</th>
                                    <th className="px-5 py-3">Role</th>
                                    <th className="px-5 py-3">Assigned Shop</th>
                                    <th className="px-5 py-3">Joined Date</th>
                                    <th className="px-5 py-3 text-right">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-3">
                                {recentUsers.map((u) => {
                                    const roleBadge =
                                        u.role === 'admin'
                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                            : u.role === 'shop_owner'
                                              ? 'bg-blue/10 text-blue border-blue/20'
                                              : 'bg-gray-1 text-dark-4 border-gray-3';

                                    const roleLabel =
                                        u.role === 'admin'
                                            ? 'Super Admin'
                                            : u.role === 'shop_owner'
                                              ? 'Shop Owner'
                                              : 'Customer';

                                    const initials = u.name
                                        .split(' ')
                                        .map((w) => w[0])
                                        .slice(0, 2)
                                        .join('')
                                        .toUpperCase();

                                    return (
                                        <tr
                                            key={u.id}
                                            className="transition hover:bg-gray-1/50"
                                        >
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-3 bg-gray-2 text-[11px] font-bold text-dark">
                                                        {initials}
                                                    </span>
                                                    <div>
                                                        <span className="block font-bold text-dark">
                                                            {u.name}
                                                        </span>
                                                        <span className="text-dark-5 block text-[11px]">
                                                            {u.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span
                                                    className={`inline-flex items-center rounded border px-2.5 py-0.5 text-[11px] font-semibold ${roleBadge}`}
                                                >
                                                    {roleLabel}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-dark-3">
                                                {u.shop ? (
                                                    <Link
                                                        href={`/shops/${u.shop.slug}`}
                                                        className="inline-flex items-center gap-1 font-medium text-dark transition hover:text-blue"
                                                    >
                                                        <span>
                                                            {u.shop.name}
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-dark-5 italic">
                                                        Unassigned
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3 text-dark-4">
                                                {new Date(
                                                    u.created_at,
                                                ).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-green">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-green" />
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Master Shared Catalog Overview */}
                <div className="overflow-hidden rounded-xl border border-gray-3 bg-white shadow-2xs">
                    <div className="flex items-center justify-between border-b border-gray-3 p-5">
                        <div>
                            <h2 className="text-sm font-bold text-dark">
                                Master Product Catalog
                            </h2>
                        </div>
                        <Link
                            href="/admin/catalog"
                            className="text-xs font-bold text-blue hover:underline"
                        >
                            Manage All Catalog Items &rarr;
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-3 text-xs">
                        {recentProducts.map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between p-4 transition hover:bg-gray-1"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-3 bg-gray-2 p-1.5">
                                        <img
                                            src={
                                                p.thumb_url ||
                                                p.thumbnail_url ||
                                                '/images/placeholder-product.svg'
                                            }
                                            alt={p.title}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (
                                                    e.currentTarget as HTMLImageElement
                                                ).src =
                                                    '/images/placeholder-product.svg';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <span className="line-clamp-1 block font-semibold text-dark">
                                            {p.title}
                                        </span>
                                        <span className="mt-0.5 flex items-center gap-2 text-[10px] text-dark-4">
                                            <span>
                                                {p.category?.name || 'General'}
                                            </span>
                                            {p.subcategory && (
                                                <>
                                                    <span>&bull;</span>
                                                    <span className="text-dark-3">
                                                        {p.subcategory.name}
                                                    </span>
                                                </>
                                            )}
                                            <span>&bull;</span>
                                            <span>SKU: {p.sku || 'N/A'}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="rounded bg-blue/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue">
                                        Stocked in {p.shop_products_count ?? 0}{' '}
                                        {p.shop_products_count === 1
                                            ? 'Shop'
                                            : 'Shops'}
                                    </span>
                                    <span className="min-w-17.5 text-right text-sm font-bold text-dark">
                                        {formatBDT(p.base_price)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
