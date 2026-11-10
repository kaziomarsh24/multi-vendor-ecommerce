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
                <section className="pt-8 pb-16 bg-gray-1">
                    <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider text-blue block mb-1">
                                    Products
                                </span>
                                <h2 className="text-2xl font-bold text-dark">
                                    {searchQuery ? `Results for "${searchQuery}"` : 'Filtered Products'}
                                    <span className="text-sm font-normal text-dark-4 ml-2">
                                        ({searchResults.length} {searchResults.length === 1 ? 'product' : 'products'} found)
                                    </span>
                                </h2>
                            </div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-gray-3 text-xs font-semibold text-dark hover:text-blue hover:border-blue transition shadow-2xs self-start sm:self-auto"
                            >
                                &larr; Clear Filter
                            </Link>
                        </div>

                        {searchResults.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {searchResults.map((item) => (
                                    <ProductCard key={item.id} item={item} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-3 p-12 text-center max-w-lg mx-auto">
                                <p className="text-sm font-bold text-dark mb-1">No products found</p>
                                <p className="text-xs text-dark-4 mb-4">
                                    No products found matching your search. Try another category or keyword.
                                </p>
                                <Link
                                    href="/"
                                    className="inline-flex items-center px-4 py-2 rounded-lg bg-blue text-white text-xs font-semibold hover:bg-blue/90 transition"
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
                        <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
                            <div className="mb-10 flex items-center justify-between">
                                <div>
                                    <span className="flex items-center gap-2.5 font-medium text-xs text-blue mb-1.5">
                                        Categories
                                    </span>
                                    <h2 className="font-bold text-2xl text-dark">Browse by Category</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                                {categories.map((cat, idx) => (
                                    <CategoryCard key={cat.id} category={cat} index={idx} />
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            {/* Verified Shops */}
            <section id="verified-shops" className="overflow-hidden pt-14 pb-14 bg-white">
                <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-blue uppercase tracking-wider block mb-1">
                                Merchant Network
                            </span>
                            <h2 className="font-bold text-2xl text-dark">Explore Verified Shops</h2>
                        </div>
                        <span className="text-xs text-dark-4 font-semibold">{shops.length} Registered Shops</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {shops.map((shop, sIdx) => (
                            <ShopCard key={shop.id} shop={shop} index={sIdx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* New Arrivals from Verified Shops */}
            <section className="overflow-hidden py-14 bg-gray-1 border-t border-gray-3">
                <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <span className="text-xs font-bold text-blue uppercase tracking-wider block mb-1">
                                Fresh Inventory
                            </span>
                            <h2 className="font-bold text-2xl text-dark">New Arrivals from Shops</h2>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {newArrivals.map((item) => (
                            <ProductCard key={item.id} item={item} />
                        ))}
                    </div>
                </div>
            </section>
        </StorefrontLayout>
    );
}
