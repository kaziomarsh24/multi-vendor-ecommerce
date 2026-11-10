import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import Pagination from '@/components/Pagination';
import ProductCard from '@/components/storefront/ProductCard';
import {
    Store,
    ShieldCheck,
    Phone,
    MapPin,
    Search,
    SlidersHorizontal,
} from 'lucide-react';
import type {
    Shop,
    ShopProduct,
    Category,
    PaginatedData,
} from '@/types/ecommerce';

interface ShopShowProps {
    shop: Shop;
    products: PaginatedData<ShopProduct>;
    categories: Category[];
    allShops: { id: number; name: string; slug: string }[];
    filters: {
        category?: string;
        search?: string;
        sort?: string;
    };
}

export default function ShopShow({
    shop,
    products,
    categories,
    filters,
}: ShopShowProps) {
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(
            `/shops/${shop.slug}`,
            { ...filters, search },
            { preserveState: true },
        );
    };

    const handleCategoryFilter = (slug: string | null) => {
        router.get(
            `/shops/${shop.slug}`,
            { ...filters, category: slug || undefined },
            { preserveState: true },
        );
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(
            `/shops/${shop.slug}`,
            { ...filters, sort: e.target.value },
            { preserveState: true },
        );
    };

    return (
        <StorefrontLayout>
            <Head title={`${shop.name} | Storefront`} />

            {/* Shop Header Banner */}
            <div
                className="relative overflow-hidden border-b border-gray-800 bg-[#1C2434] bg-cover bg-center py-10 text-white sm:py-14"
                style={
                    shop.banner_url
                        ? {
                              backgroundImage: `linear-gradient(rgba(28, 36, 52, 0.78), rgba(28, 36, 52, 0.90)), url(${shop.banner_url})`,
                          }
                        : {
                              backgroundImage: `linear-gradient(135deg, #1C2434 0%, #2D3A4F 60%, #1C2434 100%)`,
                          }
                }
            >
                <div className="mx-auto max-w-292.5 px-4 sm:px-8">
                    {/* Breadcrumb Navigation on Banner */}
                    <div className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-400">
                        <Link href="/" className="transition hover:text-white">
                            Home
                        </Link>
                        <span>/</span>
                        <span className="text-gray-500">Shops</span>
                        <span>/</span>
                        <span className="font-semibold text-white">
                            {shop.name}
                        </span>
                    </div>

                    {/* Shop Identity */}
                    <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Logo / Avatar with Link */}
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-lg backdrop-blur-xs transition hover:border-blue-400 sm:h-20 sm:w-20"
                                title={shop.name}
                            >
                                {shop.logo_url ? (
                                    <img
                                        src={shop.logo_url}
                                        alt={shop.name}
                                        className="max-h-full max-w-full rounded-xl object-contain"
                                        onError={(e) => {
                                            (
                                                e.currentTarget as HTMLElement
                                            ).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center rounded-xl bg-blue text-2xl font-extrabold text-white sm:text-3xl">
                                        {shop.name
                                            .substring(0, 2)
                                            .toUpperCase()}
                                    </div>
                                )}
                            </Link>

                            <div>
                                <div className="flex flex-wrap items-center gap-2.5">
                                    <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl lg:text-3xl">
                                        {shop.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        Verified Shop
                                    </span>
                                </div>

                                {shop.description && (
                                    <p className="mt-1.5 max-w-2xl text-xs leading-relaxed text-gray-300">
                                        {shop.description}
                                    </p>
                                )}

                                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                    {shop.address && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="h-3.5 w-3.5 text-blue-400" />
                                            {shop.address}
                                        </span>
                                    )}
                                    {shop.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="h-3.5 w-3.5 text-blue-400" />
                                            {shop.phone}
                                        </span>
                                    )}
                                    <span className="font-medium text-gray-400">
                                        {products.total}{' '}
                                        {products.total === 1
                                            ? 'item'
                                            : 'items'}{' '}
                                        available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Product Catalog Area */}
            <div className="mx-auto max-w-292.5 px-4 py-8 sm:px-8 sm:py-10">
                {/* Search & Filter Toolbar */}
                <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gray-200/80 bg-white p-3.5 shadow-2xs sm:p-4 md:flex-row">
                    {/* Category Filter Pills */}
                    <div className="flex w-full scrollbar-none items-center gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter(null)}
                            className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                                !filters.category
                                    ? 'bg-blue text-white shadow-2xs'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All ({products.total})
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                type="button"
                                onClick={() => handleCategoryFilter(cat.slug)}
                                className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition ${
                                    filters.category === cat.slug
                                        ? 'bg-blue text-white shadow-2xs'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Search & Sort Controls */}
                    <div className="flex w-full items-center gap-3 md:w-auto">
                        <form
                            onSubmit={handleSearch}
                            className="relative flex-1 md:w-56"
                        >
                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search || ''}
                                placeholder="Search products..."
                                className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pr-3 pl-8 text-xs transition focus:border-blue focus:outline-none"
                            />
                            <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-gray-400" />
                        </form>

                        <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5">
                            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
                            <select
                                value={filters.sort || 'latest'}
                                onChange={handleSortChange}
                                className="cursor-pointer border-none bg-transparent py-0 pr-6 pl-1 text-xs font-medium text-gray-700 focus:ring-0"
                            >
                                <option value="latest">Latest</option>
                                <option value="price_low">
                                    Price: Low to High
                                </option>
                                <option value="price_high">
                                    Price: High to Low
                                </option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {products.data.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
                            {products.data.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    shopSlug={shop.slug}
                                    showShop={false}
                                    showStock={true}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            links={products.links}
                            from={products.from}
                            to={products.to}
                            total={products.total}
                            className="mt-8"
                        />
                    </>
                ) : (
                    /* Clean Empty State */
                    <div className="mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue">
                            <Store className="h-8 w-8" />
                        </div>
                        <h3 className="mb-1 text-base font-bold text-gray-900">
                            No products currently stocked in this shop
                        </h3>
                        <p className="mb-6 text-xs leading-relaxed text-gray-500">
                            {shop.name} has not stocked any products yet, or
                            products are currently out of stock.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link
                                href="/"
                                className="rounded-lg bg-blue px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue/90"
                            >
                                Browse All Products
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </StorefrontLayout>
    );
}
