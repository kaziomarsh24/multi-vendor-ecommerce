import React from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import HeroSection from '@/components/storefront/HeroSection';
import CategoryCard from '@/components/storefront/CategoryCard';
import ShopCard from '@/components/storefront/ShopCard';
import ProductCard from '@/components/storefront/ProductCard';
import type { Category, Shop, ShopProduct } from '@/types/ecommerce';

interface HomeProps {
    heroFeatured?: ShopProduct | null;
    heroPromos?: ShopProduct[];
    categories: Category[];
    shops: Shop[];
    newArrivals: ShopProduct[];
    bestSellers: ShopProduct[];
    searchResults?: ShopProduct[];
    searchQuery?: string;
}

export default function Home({
    heroFeatured,
    heroPromos,
    categories,
    shops,
    newArrivals,
    searchResults,
    searchQuery,
}: HomeProps) {
    const isSearching = searchResults !== undefined;

    return (
        <StorefrontLayout>
            <Head title="CSN Multi-Shop Platform — Authentic Tech from Bangladesh's Best Local Shops" />

            {/* Category / Keyword Search Results */}
            {isSearching ? (
                <section className="bg-gray-1 pt-8 pb-16">
                    <div className="mx-auto w-full max-w-292.5 px-4 sm:px-8 xl:px-0">
                        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <span className="mb-1 block text-xs font-bold tracking-wider text-blue uppercase">
                                    Products
                                </span>
                                <h2 className="text-2xl font-bold text-dark">
                                    {searchQuery
                                        ? `Results for "${searchQuery}"`
                                        : 'Filtered Products'}
                                    <span className="ml-2 text-sm font-normal text-dark-4">
                                        ({searchResults.length}{' '}
                                        {searchResults.length === 1
                                            ? 'product'
                                            : 'products'}{' '}
                                        found)
                                    </span>
                                </h2>
                            </div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 self-start rounded-lg border border-gray-3 bg-white px-4 py-2 text-xs font-semibold text-dark shadow-2xs transition hover:border-blue hover:text-blue sm:self-auto"
                            >
                                &larr; Clear Filter
                            </Link>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {searchResults.map((item) => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="mx-auto max-w-lg rounded-xl border border-gray-3 bg-white p-12 text-center">
                                <p className="mb-1 text-sm font-bold text-dark">
                                    No products found
                                </p>
                                <p className="mb-4 text-xs text-dark-4">
                                    No products found matching your search. Try
                                    another category or keyword.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center rounded-lg bg-blue px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue/90"
                                >
                                    Browse All Products
                                </Link>
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                <>
                    {/* Dynamic Hero Section */}
                    <HeroSection featured={heroFeatured} promos={heroPromos} />

                    {/* Browse By Category */}
                    <section className="overflow-hidden pt-16">
                        <div className="mx-auto w-full max-w-292.5 px-4 sm:px-8 xl:px-0">
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <span className="mb-1.5 flex items-center gap-2.5 text-xs font-medium text-blue">
                                        Categories
                                    </span>
                                    <h2 className="text-2xl font-bold text-dark">
                                        Browse by Category
                                    </h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-6">
                                {categories.map((cat, idx) => (
                                    <CategoryCard
                                        key={cat.id}
                                        category={cat}
                                        index={idx}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Verified Shops */}
            <section
                id="verified-shops"
                className="overflow-hidden bg-white pt-14 pb-14"
            >
                <div className="mx-auto w-full max-w-292.5 px-4 sm:px-8 xl:px-0">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <span className="mb-1 block text-xs font-bold tracking-wider text-blue uppercase">
                                Merchant Network
                            </span>
                            <h2 className="text-2xl font-bold text-dark">
                                Explore Verified Shops
                            </h2>
                        </div>
                        <span className="text-xs font-semibold text-dark-4">
                            {shops.length} Registered Shops
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
                        {shops.map((shop, sIdx) => (
                            <ShopCard key={shop.id} shop={shop} index={sIdx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals from Verified Shops */}
            <section className="overflow-hidden border-t border-gray-3 bg-gray-1 py-14">
                <div className="mx-auto w-full max-w-292.5 px-4 sm:px-8 xl:px-0">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <span className="mb-1 block text-xs font-bold tracking-wider text-blue uppercase">
                                Fresh Inventory
                            </span>
                            <h2 className="text-2xl font-bold text-dark">
                                New Arrivals from Shops
                            </h2>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {newArrivals.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
