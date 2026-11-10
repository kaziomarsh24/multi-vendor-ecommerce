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
    ShoppingBag,
    SlidersHorizontal,
} from 'lucide-react';
import type { Shop, ShopProduct, Category, PaginatedData } from '@/types/ecommerce';

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

export default function ShopShow({ shop, products, categories, filters }: ShopShowProps) {
    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const search = formData.get('search') as string;
        router.get(`/shops/${shop.slug}`, { ...filters, search }, { preserveState: true });
    };

    const handleCategoryFilter = (slug: string | null) => {
        router.get(`/shops/${shop.slug}`, { ...filters, category: slug || undefined }, { preserveState: true });
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        router.get(`/shops/${shop.slug}`, { ...filters, sort: e.target.value }, { preserveState: true });
    };

    return (
        <StorefrontLayout>
            <Head title={`${shop.name} | Storefront`} />

            {/* Shop Header Banner */}
            <div
                className="relative bg-[#1C2434] text-white py-10 sm:py-14 border-b border-gray-800 bg-cover bg-center overflow-hidden"
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
                <div className="max-w-292.5 mx-auto px-4 sm:px-8">
                    {/* Breadcrumb Navigation on Banner */}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-medium">
                        <Link href="/" className="hover:text-white transition">Home</Link>
                        <span>/</span>
                        <span className="text-gray-500">Shops</span>
                        <span>/</span>
                        <span className="text-white font-semibold">{shop.name}</span>
                    </div>

                    {/* Shop Identity */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-6">
                            {/* Logo / Avatar with Link */}
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-xs p-1.5 border border-white/20 flex items-center justify-center shrink-0 shadow-lg hover:border-blue-400 transition"
                                title={shop.name}
                            >
                                {shop.logo_url ? (
                                    <img
                                        src={shop.logo_url}
                                        alt={shop.name}
                                        className="max-h-full max-w-full object-contain rounded-xl"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLElement).style.display = 'none';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-xl bg-blue text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center">
                                        {shop.name.substring(0, 2).toUpperCase()}
                                    </div>
                                )}
                            </Link>

                            <div>
                                <div className="flex items-center gap-2.5 flex-wrap">
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                                        {shop.name}
                                    </h1>
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        Verified Shop
                                    </span>
                                </div>

                                {shop.description && (
                                    <p className="text-xs text-gray-300 mt-1.5 max-w-2xl leading-relaxed">
                                        {shop.description}
                                    </p>
                                )}

                                <div className="flex items-center gap-4 text-xs text-gray-400 mt-3 flex-wrap">
                                    {shop.address && (
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-blue-400" />
                                            {shop.address}
                                        </span>
                                    )}
                                    {shop.phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-3.5 h-3.5 text-blue-400" />
                                            {shop.phone}
                                        </span>
                                    )}
                                    <span className="text-gray-400 font-medium">
                                        {products.total} {products.total === 1 ? 'item' : 'items'} available
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shop Product Catalog Area */}
            <div className="max-w-292.5 mx-auto px-4 sm:px-8 py-8 sm:py-10">
                {/* Search & Filter Toolbar */}
                <div className="bg-white rounded-xl p-3.5 sm:p-4 border border-gray-200/80 shadow-2xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
                        <button
                            type="button"
                            onClick={() => handleCategoryFilter(null)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
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
                                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
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
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <form onSubmit={handleSearch} className="relative flex-1 md:w-56">
                            <input
                                type="text"
                                name="search"
                                defaultValue={filters.search || ''}
                                placeholder="Search products..."
                                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue transition"
                            />
                            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
                        </form>

                        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5">
                            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
                            <select
                                value={filters.sort || 'latest'}
                                onChange={handleSortChange}
                                className="text-xs text-gray-700 bg-transparent border-none focus:ring-0 py-0 pl-1 pr-6 font-medium cursor-pointer"
                            >
                                <option value="latest">Latest</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product Grid */}
                {products.data.length > 0 ? (
                    <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    <div className="bg-white rounded-2xl p-12 text-center border border-gray-200/80 max-w-lg mx-auto shadow-sm">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue flex items-center justify-center mx-auto mb-4">
                            <Store className="w-8 h-8" />
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">No products currently stocked in this shop</h3>
                        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                            {shop.name} has not stocked any products yet, or products are currently out of stock.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <Link
                                href="/"
                                className="bg-blue hover:bg-blue/90 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
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
