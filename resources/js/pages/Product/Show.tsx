import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import StorefrontLayout from '@/layouts/StorefrontLayout';
import {
    Store,
    CheckCircle2,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    X,
} from 'lucide-react';
import type { Product, ShopProduct } from '@/types/ecommerce';

interface ProductShowProps {
    product: Product;
    stockingShops: ShopProduct[];
    selectedShopProduct?: ShopProduct | null;
    relatedProducts: Product[];
}

export default function ProductShow({
    product,
    stockingShops,
    selectedShopProduct,
    relatedProducts,
}: ProductShowProps) {
    const displayTitle = selectedShopProduct?.display_title || product.title;
    const displayDescription =
        selectedShopProduct?.display_description || product.description;
    const displayPrice = selectedShopProduct?.display_price
        ? Number(selectedShopProduct.display_price)
        : Number(product.base_price);
    const displayComparePrice = selectedShopProduct?.display_compare_price
        ? Number(selectedShopProduct.display_compare_price)
        : product.compare_price
          ? Number(product.compare_price)
          : null;

    const discountPercent =
        displayComparePrice && displayComparePrice > displayPrice
            ? Math.round(
                  ((displayComparePrice - displayPrice) / displayComparePrice) *
                      100,
              )
            : null;

    // Gallery images & thumbnails: combine main thumbnail + additional gallery angles
    const shopPhotos = selectedShopProduct?.display_thumbnail_url
        ? ([
              selectedShopProduct.display_thumbnail_url,
              ...(selectedShopProduct.display_gallery_urls || []),
          ].filter(Boolean) as string[])
        : [];
    const masterPhotos = product.thumbnail_url
        ? ([product.thumbnail_url, ...(product.gallery_urls || [])].filter(
              Boolean,
          ) as string[])
        : [];
    const galleryImages =
        shopPhotos.length > 0
            ? shopPhotos
            : masterPhotos.length > 0
              ? masterPhotos
              : ['/images/placeholder-product.svg'];

    const shopThumbs = selectedShopProduct?.display_thumb_url
        ? ([
              selectedShopProduct.display_thumb_url,
              ...(selectedShopProduct.display_gallery_thumb_urls || []),
          ].filter(Boolean) as string[])
        : [];
    const masterThumbs = product.thumb_url
        ? ([product.thumb_url, ...(product.gallery_thumb_urls || [])].filter(
              Boolean,
          ) as string[])
        : [];
    const galleryThumbs =
        shopThumbs.length > 0
            ? shopThumbs
            : masterThumbs.length > 0
              ? masterThumbs
              : galleryImages;

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    const activeImage = galleryImages[currentIndex] || galleryImages[0];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentIndex(
            (prev) => (prev - 1 + galleryImages.length) % galleryImages.length,
        );
    };

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    const otherShops = selectedShopProduct
        ? stockingShops.filter((sp) => sp.id !== selectedShopProduct.id)
        : [];

    return (
        <StorefrontLayout>
            <Head
                title={`${displayTitle} | ${selectedShopProduct ? selectedShopProduct.shop?.name : 'CSN Platform'}`}
            />

            {/* Breadcrumb Header */}
            <div className="border-b border-gray-3 bg-gray-1 py-4 sm:py-5">
                <div className="mx-auto flex max-w-292.5 items-center justify-between px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-dark-4">
                        <Link
                            href="/"
                            className="font-medium transition hover:text-blue"
                        >
                            Home
                        </Link>
                        <span>/</span>
                        {selectedShopProduct ? (
                            <>
                                <Link
                                    href={`/shops/${selectedShopProduct.shop?.slug}`}
                                    className="font-medium text-dark-3 transition hover:text-blue"
                                >
                                    {selectedShopProduct.shop?.name}
                                </Link>
                                <span>/</span>
                                <span className="max-w-xs truncate font-semibold text-dark">
                                    {displayTitle}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="text-dark-3">
                                    {product.category?.name || 'Products'}
                                </span>
                                <span>/</span>
                                <span className="max-w-xs truncate font-semibold text-dark">
                                    {product.title}
                                </span>
                            </>
                        )}
                    </div>

                    {selectedShopProduct && (
                        <Link
                            href={`/shops/${selectedShopProduct.shop?.slug}`}
                            className="hidden text-xs font-semibold text-blue hover:underline sm:inline-block"
                        >
                            &larr; Back to {selectedShopProduct.shop?.name}
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Product Details Content */}
            <main className="mx-auto w-full max-w-292.5 space-y-14 px-4 py-10 sm:px-8 xl:px-0">
                <div className="flex flex-col gap-10 lg:flex-row xl:gap-14">
                    {/* Left: Product Media Gallery */}
                    <div className="w-full space-y-4 lg:max-w-130">
                        {/* Main Image Box */}
                        <div className="group relative flex min-h-110 items-center justify-center overflow-hidden rounded-xl border border-gray-3 bg-gray-2 p-8">
                            {discountPercent && (
                                <div className="absolute top-4 left-4 z-10 rounded-md bg-rose-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-xs">
                                    {discountPercent}% OFF
                                </div>
                            )}

                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                <span className="rounded border border-gray-3 bg-white/80 px-2 py-0.5 text-[11px] font-semibold text-dark-4 backdrop-blur-xs">
                                    {currentIndex + 1} / {galleryImages.length}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="cursor-pointer rounded-lg border border-gray-3 bg-white/90 p-1.5 text-dark shadow-xs transition hover:bg-white"
                                    title="View full resolution"
                                >
                                    <Maximize2 className="h-4 w-4" />
                                </button>
                            </div>

                            <img
                                src={activeImage}
                                alt={displayTitle}
                                className="max-h-95 max-w-full cursor-zoom-in object-contain transition-transform duration-300 group-hover:scale-105"
                                onClick={() => setIsLightboxOpen(true)}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src =
                                        '/images/placeholder-product.svg';
                                }}
                            />

                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prevImage}
                                        className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-3 bg-white/90 text-dark opacity-0 shadow-xs transition group-hover:opacity-100 hover:bg-white"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextImage}
                                        className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-gray-3 bg-white/90 text-dark opacity-0 shadow-xs transition group-hover:opacity-100 hover:bg-white"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Strip */}
                        {galleryImages.length > 1 && (
                            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                                {galleryImages.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setCurrentIndex(idx)}
                                        className={`flex h-18 w-18 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-gray-2 p-1.5 transition ${
                                            currentIndex === idx
                                                ? 'border-2 border-blue bg-white shadow-xs ring-2 ring-blue/20'
                                                : 'border border-gray-3 hover:border-blue/50'
                                        }`}
                                    >
                                        <img
                                            src={galleryThumbs[idx] || img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (
                                                    e.currentTarget as HTMLImageElement
                                                ).src = img;
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Info & Actions */}
                    <div className="flex-1 space-y-6">
                        <div>
                            {product.category && (
                                <span className="mb-2 block text-xs font-semibold tracking-wider text-blue uppercase">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="mb-1 text-2xl leading-snug font-bold text-dark sm:text-3xl">
                                {displayTitle}
                            </h1>

                            {selectedShopProduct &&
                                selectedShopProduct.display_title !==
                                    product.title && (
                                    <p className="mb-3 text-xs text-dark-4">
                                        Catalog Item:{' '}
                                        <span className="font-medium text-dark-3">
                                            {product.title}
                                        </span>
                                    </p>
                                )}

                            {/* Clean Price Display */}
                            <div className="my-5 flex items-baseline gap-3">
                                <span className="text-3xl font-extrabold text-blue">
                                    {formatBDT(displayPrice)}
                                </span>
                                {displayComparePrice &&
                                    displayComparePrice > displayPrice && (
                                        <span className="text-lg text-dark-4 line-through">
                                            {formatBDT(displayComparePrice)}
                                        </span>
                                    )}
                                {discountPercent && (
                                    <span className="rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>

                            {displayDescription && (
                                <p className="mb-6 text-xs leading-relaxed whitespace-pre-line text-dark-3 sm:text-sm">
                                    {displayDescription}
                                </p>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="space-y-2.5 border-t border-b border-gray-3 py-4 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="w-28 font-semibold text-dark">
                                    Category:
                                </span>
                                <span className="font-medium text-blue">
                                    {product.category?.name || 'General'}
                                </span>
                            </div>
                            {product.subcategory && (
                                <div className="flex items-center gap-2">
                                    <span className="w-28 font-semibold text-dark">
                                        Subcategory:
                                    </span>
                                    <span className="font-medium text-dark">
                                        {product.subcategory.name}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="w-28 font-semibold text-dark">
                                    SKU:
                                </span>
                                <span className="font-mono font-medium text-dark">
                                    {product.sku}
                                </span>
                            </div>
                        </div>

                        {/* Shop Fulfillment or Multi-Shop Comparison */}
                        {selectedShopProduct ? (
                            <div className="space-y-4 pt-2">
                                {/* Sold By Box */}
                                <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-3 bg-gray-1 p-4 sm:flex-row sm:items-center">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Store className="h-4 w-4 text-blue" />
                                            <span className="text-xs font-bold text-dark">
                                                Sold by{' '}
                                                {selectedShopProduct.shop?.name}
                                            </span>
                                        </div>
                                        {selectedShopProduct.shop?.address && (
                                            <p className="mt-1 text-[11px] text-dark-4">
                                                {
                                                    selectedShopProduct.shop
                                                        .address
                                                }
                                            </p>
                                        )}
                                        {selectedShopProduct.shop?.phone && (
                                            <p className="text-[11px] text-dark-4">
                                                Phone:{' '}
                                                {selectedShopProduct.shop.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="flex items-center gap-1 text-xs font-semibold text-green sm:justify-end">
                                            <CheckCircle2 className="h-3.5 w-3.5" />
                                            {selectedShopProduct.stock_quantity >
                                            0
                                                ? `${selectedShopProduct.stock_quantity} in stock`
                                                : 'Out of stock'}
                                        </span>
                                        <Link
                                            href={`/shops/${selectedShopProduct.shop?.slug}`}
                                            className="mt-2 inline-block text-xs font-semibold text-blue hover:underline"
                                        >
                                            View Store Profile &rarr;
                                        </Link>
                                    </div>
                                </div>

                                {/* Also available from other stores */}
                                {otherShops.length > 0 && (
                                    <div className="border-t border-gray-3 pt-3">
                                        <h3 className="mb-2.5 text-xs font-bold text-dark">
                                            Also available at{' '}
                                            {otherShops.length} other{' '}
                                            {otherShops.length === 1
                                                ? 'store'
                                                : 'stores'}
                                            :
                                        </h3>
                                        <div className="space-y-2">
                                            {otherShops.map((sp) => (
                                                <div
                                                    key={sp.id}
                                                    className="flex items-center justify-between gap-3 rounded-lg border border-gray-3 bg-white p-3 text-xs transition hover:border-blue"
                                                >
                                                    <div>
                                                        <span className="block font-semibold text-dark">
                                                            {sp.shop?.name}
                                                        </span>
                                                        <span className="text-[11px] text-dark-4">
                                                            {sp.stock_quantity}{' '}
                                                            in stock
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-dark">
                                                            {formatBDT(
                                                                sp.display_price,
                                                            )}
                                                        </span>
                                                        <Link
                                                            href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                            className="rounded bg-gray-1 px-2.5 py-1 text-[11px] font-medium transition hover:bg-blue hover:text-white"
                                                        >
                                                            View Offer
                                                        </Link>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Global view without shop context: list all stocking shops */
                            <div className="pt-2">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="flex items-center gap-2 text-sm font-bold text-dark">
                                        <Store className="h-4 w-4 text-blue" />
                                        Available in {stockingShops.length}{' '}
                                        {stockingShops.length === 1
                                            ? 'Store'
                                            : 'Stores'}
                                    </h3>
                                </div>

                                {stockingShops.length > 0 ? (
                                    <div className="space-y-3">
                                        {stockingShops.map((sp) => (
                                            <div
                                                key={sp.id}
                                                className="flex flex-col justify-between gap-3 rounded-xl border border-gray-3 bg-gray-1 p-4 transition hover:border-blue sm:flex-row sm:items-center"
                                            >
                                                <div>
                                                    <Link
                                                        href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                        className="block text-sm font-semibold text-dark transition hover:text-blue"
                                                    >
                                                        {sp.shop?.name}
                                                    </Link>
                                                    {sp.display_title !==
                                                        product.title && (
                                                        <Link
                                                            href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                            className="mt-0.5 block text-xs font-semibold text-blue hover:underline"
                                                        >
                                                            {sp.display_title}
                                                        </Link>
                                                    )}
                                                    <p className="mt-0.5 text-[11px] text-dark-4">
                                                        {sp.shop?.address}
                                                    </p>
                                                    <span className="mt-1 block text-[10px] font-medium text-green">
                                                        ✓ {sp.stock_quantity} in
                                                        stock
                                                    </span>
                                                </div>

                                                <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
                                                    <span className="block text-base font-extrabold text-dark">
                                                        {formatBDT(
                                                            sp.display_price,
                                                        )}
                                                    </span>
                                                    <Link
                                                        href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                        className="flex items-center gap-1.5 rounded-lg bg-blue px-4 py-2 text-xs font-medium text-white transition hover:bg-blue-dark"
                                                    >
                                                        <ShoppingBag className="h-3.5 w-3.5" />
                                                        <span>
                                                            View from Store
                                                        </span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-xl border border-gray-3 bg-gray-1 p-6 text-center text-xs text-dark-4">
                                        Currently not stocked by any shop.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-6 border-t border-gray-3 pt-10">
                        <h3 className="text-lg font-bold text-dark sm:text-xl">
                            Related Products in {product.category?.name}
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedProducts.map((rp) => (
                                <div key={rp.id} className="group">
                                    <div className="relative mb-3 flex min-h-50 items-center justify-center overflow-hidden rounded-xl bg-[#F6F7FB] p-4">
                                        <Link href={`/products/${rp.slug}`}>
                                            <img
                                                src={
                                                    rp.thumbnail_url ||
                                                    '/images/placeholder-product.svg'
                                                }
                                                alt={rp.title}
                                                className="h-32 object-contain transition duration-300 group-hover:scale-105"
                                                onError={(e) => {
                                                    (
                                                        e.currentTarget as HTMLImageElement
                                                    ).src =
                                                        '/images/placeholder-product.svg';
                                                }}
                                            />
                                        </Link>
                                    </div>
                                    <h4 className="mb-1 line-clamp-1 text-xs font-medium text-dark hover:text-blue">
                                        <Link href={`/products/${rp.slug}`}>
                                            {rp.title}
                                        </Link>
                                    </h4>
                                    <span className="text-sm font-bold text-dark">
                                        {formatBDT(rp.base_price)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div
                        className="flex w-full max-w-4xl items-center justify-between pb-4 text-white"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="max-w-md truncate text-sm font-semibold">
                            {displayTitle} &bull;{' '}
                            <span className="text-white/70">
                                Photo {currentIndex + 1} of{' '}
                                {galleryImages.length}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(false)}
                            className="cursor-pointer rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>

                    <div
                        className="relative flex max-h-[75vh] w-full max-w-4xl items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={activeImage}
                            alt={displayTitle}
                            className="max-h-[70vh] max-w-full rounded-lg object-contain"
                        />

                        {galleryImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prevImage}
                                    className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white transition hover:bg-black/80"
                                >
                                    <ChevronLeft className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={nextImage}
                                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 p-3 text-white transition hover:bg-black/80"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {galleryImages.length > 1 && (
                        <div
                            className="mt-4 flex max-w-xl items-center gap-2 overflow-x-auto rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`h-14 w-14 cursor-pointer overflow-hidden rounded-lg border-2 p-1 transition ${
                                        currentIndex === idx
                                            ? 'border-blue bg-white/20'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={galleryThumbs[idx] || img}
                                        alt=""
                                        className="h-full w-full object-contain"
                                        onError={(e) => {
                                            (
                                                e.currentTarget as HTMLImageElement
                                            ).src = img;
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </StorefrontLayout>
    );
}
