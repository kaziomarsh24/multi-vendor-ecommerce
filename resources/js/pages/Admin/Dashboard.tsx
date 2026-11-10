import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { Plus, ExternalLink, ShieldCheck, Store } from 'lucide-react';
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

export default function Dashboard({ stats, recentShops, recentProducts, recentUsers }: DashboardProps) {
    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    return (
        <AdminLayout title="Platform Dashboard Overview">
            <Head title="Admin Dashboard | CSN Multi-Shop" />

            <div className="space-y-6">
                {/* Header & Quick Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-3">
                    <div>
                        <h1 className="text-xl font-bold text-dark">Dashboard</h1>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/admin/shops"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue text-white rounded-lg text-xs font-semibold hover:bg-blue-dark transition shadow-2xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Create New Shop</span>
                        </Link>
                        <Link
                            href="/admin/catalog/create"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-gray-3 bg-white text-dark rounded-lg text-xs font-semibold hover:border-dark transition shadow-2xs"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Master Product</span>
                        </Link>
                    </div>
                </div>

                {/* Stat Cards Grid (Authentic Nextmerce Admin Style) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-xl border border-gray-3 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dark-4 block mb-1">
                            Registered Shops
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">{stats.total_shops}</span>
                            <span className="text-xs text-green font-semibold">{stats.active_shops} Active</span>
                        </div>
                        <Link href="/admin/shops" className="text-[11px] text-blue font-semibold hover:underline mt-3 block">
                            Manage Shops &rarr;
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-3 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dark-4 block mb-1">
                            Master Catalog Items
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">{stats.total_catalog_products}</span>
                            <span className="text-xs text-dark-4 font-normal">Platform Total</span>
                        </div>
                        <Link href="/admin/catalog" className="text-[11px] text-blue font-semibold hover:underline mt-3 block">
                            Browse Catalog &rarr;
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-3 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dark-4 block mb-1">
                            Assigned Shop Stock
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">{stats.total_shop_products}</span>
                            <span className="text-xs text-dark-4 font-normal">Active in Stores</span>
                        </div>
                        <Link href="/admin/shops" className="text-[11px] text-blue font-semibold hover:underline mt-3 block">
                            View Shops & Stock &rarr;
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-gray-3 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-dark-4 block mb-1">
                            Categories
                        </span>
                        <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-dark">{stats.total_categories}</span>
                            <span className="text-xs text-green font-semibold">Configured</span>
                        </div>
                        <Link href="/admin/categories" className="text-[11px] text-blue font-semibold hover:underline mt-3 block">
                            Manage Categories &rarr;
                        </Link>
                    </div>
                </div>

                {/* Registered Shops Table Card */}
                <div className="bg-white rounded-xl border border-gray-3 overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-gray-3 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-sm text-dark">Registered Shops</h2>
                        </div>
                        <Link href="/admin/shops" className="text-xs font-bold text-blue hover:underline">
                            View All Shops &rarr;
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-1 border-b border-gray-3 text-dark-4 uppercase font-bold text-[10px] tracking-wider">
                                    <th className="py-3 px-5">Shop Details</th>
                                    <th className="py-3 px-5">Assigned Owner</th>
                                    <th className="py-3 px-5">Location</th>
                                    <th className="py-3 px-5">Assigned Inventory</th>
                                    <th className="py-3 px-5">Status</th>
                                    <th className="py-3 px-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-3">
                                {recentShops.map((shop) => (
                                    <tr key={shop.id} className="hover:bg-gray-1/50 transition">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg bg-gray-1 border border-gray-2 p-1 flex items-center justify-center shrink-0 overflow-hidden">
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
                                                        <Store className="w-4 h-4 text-dark-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <span className="font-bold text-dark block">{shop.name}</span>
                                                    <span className="text-[11px] text-dark-5 block">
                                                        /shops/{shop.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="font-medium text-dark block">{shop.owner?.name || 'Unassigned'}</span>
                                            <span className="text-[10px] text-dark-4 block">{shop.owner?.email}</span>
                                        </td>
                                        <td className="py-3.5 px-5 text-dark-4">
                                            {shop.address || 'Dhaka, Bangladesh'}
                                        </td>
                                        <td className="py-3.5 px-5 font-semibold text-dark">
                                            <span className="px-2.5 py-1 rounded-full bg-blue/10 text-blue font-bold text-[11px]">
                                                {shop.shop_products_count ?? 0} Products Stocked
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <span className="inline-flex items-center gap-1.5 text-green text-xs font-semibold">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-right space-x-3 text-xs">
                                            <a
                                                href={`/shops/${shop.slug}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-medium text-dark-3 hover:text-blue inline-flex items-center gap-1"
                                            >
                                                <span>Storefront</span>
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                            <Link href="/admin/shops" className="font-semibold text-blue hover:underline">
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
                <div className="bg-white rounded-xl border border-gray-3 overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-gray-3 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-sm text-dark">Platform Users & Roles</h2>
                            <p className="text-[11px] text-dark-5 mt-0.5">Registered accounts across administrator, merchant, and customer roles</p>
                        </div>
                        <span className="text-xs font-semibold text-dark-4">
                            {recentUsers.length} Recent Accounts
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                            <thead>
                                <tr className="bg-gray-1 border-b border-gray-3 text-dark-4 uppercase font-bold text-[10px] tracking-wider">
                                    <th className="py-3 px-5">User</th>
                                    <th className="py-3 px-5">Role</th>
                                    <th className="py-3 px-5">Assigned Shop</th>
                                    <th className="py-3 px-5">Joined Date</th>
                                    <th className="py-3 px-5 text-right">Status</th>
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
                                        <tr key={u.id} className="hover:bg-gray-1/50 transition">
                                            <td className="py-3 px-5">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-full bg-gray-2 text-dark font-bold text-[11px] flex items-center justify-center shrink-0 border border-gray-3">
                                                        {initials}
                                                    </span>
                                                    <div>
                                                        <span className="font-bold text-dark block">{u.name}</span>
                                                        <span className="text-[11px] text-dark-5 block">{u.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-semibold border ${roleBadge}`}>
                                                    {roleLabel}
                                                </span>
                                            </td>
                                            <td className="py-3 px-5 text-dark-3">
                                                {u.shop ? (
                                                    <Link
                                                        href={`/shops/${u.shop.slug}`}
                                                        className="font-medium text-dark hover:text-blue transition inline-flex items-center gap-1"
                                                    >
                                                        <span>{u.shop.name}</span>
                                                    </Link>
                                                ) : (
                                                    <span className="text-dark-5 italic">Unassigned</span>
                                                )}
                                            </td>
                                            <td className="py-3 px-5 text-dark-4">
                                                {new Date(u.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="py-3 px-5 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-green text-[11px] font-semibold">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green" />
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
                <div className="bg-white rounded-xl border border-gray-3 overflow-hidden shadow-2xs">
                    <div className="p-5 border-b border-gray-3 flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-sm text-dark">Master Product Catalog</h2>
                        </div>
                        <Link href="/admin/catalog" className="text-xs font-bold text-blue hover:underline">
                            Manage All Catalog Items &rarr;
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-3 text-xs">
                        {recentProducts.map((p) => (
                            <div key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-1 transition">
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-lg bg-gray-2 p-1.5 flex items-center justify-center shrink-0 border border-gray-3 overflow-hidden">
                                        <img
                                            src={p.thumb_url || p.thumbnail_url || '/images/placeholder-product.svg'}
                                            alt={p.title}
                                            className="max-h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <span className="font-semibold text-dark block line-clamp-1">{p.title}</span>
                                        <span className="text-[10px] text-dark-4 flex items-center gap-2 mt-0.5">
                                            <span>{p.category?.name || 'General'}</span>
                                            {p.subcategory && (
                                                <>
                                                    <span>&bull;</span>
                                                    <span className="text-dark-3">{p.subcategory.name}</span>
                                                </>
                                            )}
                                            <span>&bull;</span>
                                            <span>SKU: {p.sku || 'N/A'}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[11px] text-blue font-semibold bg-blue/10 px-2.5 py-0.5 rounded">
                                        Stocked in {p.shop_products_count ?? 0} {p.shop_products_count === 1 ? 'Shop' : 'Shops'}
                                    </span>
                                    <span className="text-dark font-bold text-sm min-w-17.5 text-right">
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
