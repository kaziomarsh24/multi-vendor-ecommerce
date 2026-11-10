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
    const displayDescription = selectedShopProduct?.display_description || product.description;
    const displayPrice = selectedShopProduct?.display_price
        ? Number(selectedShopProduct.display_price)
        : Number(product.base_price);
    const displayComparePrice = selectedShopProduct?.display_compare_price
        ? Number(selectedShopProduct.display_compare_price)
        : (product.compare_price ? Number(product.compare_price) : null);

    const discountPercent =
        displayComparePrice && displayComparePrice > displayPrice
            ? Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)
            : null;

    // Gallery images & thumbnails: combine main thumbnail + additional gallery angles
    const shopPhotos = selectedShopProduct?.display_thumbnail_url
        ? [selectedShopProduct.display_thumbnail_url, ...(selectedShopProduct.display_gallery_urls || [])].filter(Boolean) as string[]
        : [];
    const masterPhotos = product.thumbnail_url
        ? [product.thumbnail_url, ...(product.gallery_urls || [])].filter(Boolean) as string[]
        : [];
    const galleryImages =
        shopPhotos.length > 0
            ? shopPhotos
            : (masterPhotos.length > 0 ? masterPhotos : ['/images/placeholder-product.svg']);

    const shopThumbs = selectedShopProduct?.display_thumb_url
        ? [selectedShopProduct.display_thumb_url, ...(selectedShopProduct.display_gallery_thumb_urls || [])].filter(Boolean) as string[]
        : [];
    const masterThumbs = product.thumb_url
        ? [product.thumb_url, ...(product.gallery_thumb_urls || [])].filter(Boolean) as string[]
        : [];
    const galleryThumbs =
        shopThumbs.length > 0
            ? shopThumbs
            : (masterThumbs.length > 0 ? masterThumbs : galleryImages);

    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

    const activeImage = galleryImages[currentIndex] || galleryImages[0];

    const nextImage = () => {
        setCurrentIndex((prev) => (prev + 1) % galleryImages.length);
    };

    const prevImage = () => {
        setCurrentIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
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
            <Head title={`${displayTitle} | ${selectedShopProduct ? selectedShopProduct.shop?.name : 'CSN Platform'}`} />

            {/* Breadcrumb Header */}
            <div className="bg-gray-1 py-4 sm:py-5 border-b border-gray-3">
                <div className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0 flex items-center justify-between">
                    <div className="text-xs text-dark-4 flex items-center gap-2 flex-wrap">
                        <Link href="/" className="hover:text-blue transition font-medium">
                            Home
                        </Link>
                        <span>/</span>
                        {selectedShopProduct ? (
                            <>
                                <Link
                                    href={`/shops/${selectedShopProduct.shop?.slug}`}
                                    className="hover:text-blue transition font-medium text-dark-3"
                                >
                                    {selectedShopProduct.shop?.name}
                                </Link>
                                <span>/</span>
                                <span className="text-dark font-semibold truncate max-w-xs">{displayTitle}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-dark-3">{product.category?.name || 'Products'}</span>
                                <span>/</span>
                                <span className="text-dark font-semibold truncate max-w-xs">{product.title}</span>
                            </>
                        )}
                    </div>

                    {selectedShopProduct && (
                        <Link
                            href={`/shops/${selectedShopProduct.shop?.slug}`}
                            className="text-xs font-semibold text-blue hover:underline hidden sm:inline-block"
                        >
                            &larr; Back to {selectedShopProduct.shop?.name}
                        </Link>
                    )}
                </div>
            </div>

            {/* Main Product Details Content */}
            <main className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0 py-10 w-full space-y-14">
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">
                    {/* Left: Product Media Gallery */}
                    <div className="lg:max-w-130 w-full space-y-4">
                        {/* Main Image Box */}
                        <div className="rounded-xl bg-gray-2 p-8 flex items-center justify-center min-h-110 border border-gray-3 relative overflow-hidden group">
                            {discountPercent && (
                                <div className="absolute top-4 left-4 z-10 bg-rose-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                                    {discountPercent}% OFF
                                </div>
                            )}

                            <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                                <span className="text-[11px] font-semibold text-dark-4 bg-white/80 px-2 py-0.5 rounded border border-gray-3 backdrop-blur-xs">
                                    {currentIndex + 1} / {galleryImages.length}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setIsLightboxOpen(true)}
                                    className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-dark shadow-xs border border-gray-3 transition cursor-pointer"
                                    title="View full resolution"
                                >
                                    <Maximize2 className="w-4 h-4" />
                                </button>
                            </div>

                            <img
                                src={activeImage}
                                alt={displayTitle}
                                className="max-h-95 max-w-full object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-105"
                                onClick={() => setIsLightboxOpen(true)}
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                }}
                            />

                            {galleryImages.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={prevImage}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-gray-3 shadow-xs flex items-center justify-center text-dark opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextImage}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white border border-gray-3 shadow-xs flex items-center justify-center text-dark opacity-0 group-hover:opacity-100 transition cursor-pointer"
                                    >
                                        <ChevronRight className="w-5 h-5" />
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
                                        className={`w-18 h-18 rounded-lg p-1.5 flex items-center justify-center bg-gray-2 shrink-0 transition cursor-pointer ${
                                            currentIndex === idx
                                                ? 'border-2 border-blue shadow-xs ring-2 ring-blue/20 bg-white'
                                                : 'border border-gray-3 hover:border-blue/50'
                                        }`}
                                    >
                                        <img
                                            src={galleryThumbs[idx] || img}
                                            alt={`Thumbnail ${idx + 1}`}
                                            className="h-full max-w-full object-contain"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = img;
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
                                <span className="text-xs font-semibold text-blue uppercase tracking-wider block mb-2">
                                    {product.category.name}
                                </span>
                            )}
                            <h1 className="font-bold text-2xl sm:text-3xl text-dark leading-snug mb-1">{displayTitle}</h1>

                            {selectedShopProduct && selectedShopProduct.display_title !== product.title && (
                                <p className="text-xs text-dark-4 mb-3">
                                    Catalog Item:{' '}
                                    <span className="font-medium text-dark-3">{product.title}</span>
                                </p>
                            )}

                            {/* Clean Price Display */}
                            <div className="flex items-baseline gap-3 my-5">
                                <span className="text-3xl font-extrabold text-blue">{formatBDT(displayPrice)}</span>
                                {displayComparePrice && displayComparePrice > displayPrice && (
                                    <span className="text-lg text-dark-4 line-through">
                                        {formatBDT(displayComparePrice)}
                                    </span>
                                )}
                                {discountPercent && (
                                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                        {discountPercent}% OFF
                                    </span>
                                )}
                            </div>

                            {displayDescription && (
                                <p className="text-xs sm:text-sm text-dark-3 leading-relaxed mb-6 whitespace-pre-line">
                                    {displayDescription}
                                </p>
                            )}
                        </div>

                        {/* Specifications */}
                        <div className="py-4 border-t border-b border-gray-3 space-y-2.5 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-dark w-28">Category:</span>
                                <span className="text-blue font-medium">{product.category?.name || 'General'}</span>
                            </div>
                            {product.subcategory && (
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-dark w-28">Subcategory:</span>
                                    <span className="text-dark font-medium">{product.subcategory.name}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-dark w-28">SKU:</span>
                                <span className="font-mono text-dark font-medium">{product.sku}</span>
                            </div>
                        </div>

                        {/* Shop Fulfillment or Multi-Shop Comparison */}
                        {selectedShopProduct ? (
                            <div className="space-y-4 pt-2">
                                {/* Sold By Box */}
                                <div className="p-4 rounded-xl bg-gray-1 border border-gray-3 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-blue" />
                                            <span className="text-xs font-bold text-dark">
                                                Sold by {selectedShopProduct.shop?.name}
                                            </span>
                                        </div>
                                        {selectedShopProduct.shop?.address && (
                                            <p className="text-[11px] text-dark-4 mt-1">
                                                {selectedShopProduct.shop.address}
                                            </p>
                                        )}
                                        {selectedShopProduct.shop?.phone && (
                                            <p className="text-[11px] text-dark-4">
                                                Phone: {selectedShopProduct.shop.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <span className="text-xs font-semibold text-green flex items-center gap-1 sm:justify-end">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {selectedShopProduct.stock_quantity > 0
                                                ? `${selectedShopProduct.stock_quantity} in stock`
                                                : 'Out of stock'}
                                        </span>
                                        <Link
                                            href={`/shops/${selectedShopProduct.shop?.slug}`}
                                            className="text-xs font-semibold text-blue hover:underline mt-2 inline-block"
                                        >
                                            View Store Profile &rarr;
                                        </Link>
                                    </div>
                                </div>

                                {/* Also available from other stores */}
                                {otherShops.length > 0 && (
                                    <div className="pt-3 border-t border-gray-3">
                                        <h3 className="text-xs font-bold text-dark mb-2.5">
                                            Also available at {otherShops.length} other {otherShops.length === 1 ? 'store' : 'stores'}:
                                        </h3>
                                        <div className="space-y-2">
                                            {otherShops.map((sp) => (
                                                <div
                                                    key={sp.id}
                                                    className="p-3 rounded-lg bg-white border border-gray-3 flex items-center justify-between gap-3 text-xs hover:border-blue transition"
                                                >
                                                    <div>
                                                        <span className="font-semibold text-dark block">
                                                            {sp.shop?.name}
                                                        </span>
                                                        <span className="text-[11px] text-dark-4">
                                                            {sp.stock_quantity} in stock
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-bold text-dark">
                                                            {formatBDT(sp.display_price)}
                                                        </span>
                                                        <Link
                                                            href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                            className="px-2.5 py-1 bg-gray-1 hover:bg-blue hover:text-white rounded text-[11px] font-medium transition"
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
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-sm font-bold text-dark flex items-center gap-2">
                                        <Store className="w-4 h-4 text-blue" />
                                        Available in {stockingShops.length} {stockingShops.length === 1 ? 'Store' : 'Stores'}
                                    </h3>
                                </div>

                                {stockingShops.length > 0 ? (
                                    <div className="space-y-3">
                                        {stockingShops.map((sp) => (
                                            <div
                                                key={sp.id}
                                                className="p-4 rounded-xl bg-gray-1 border border-gray-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue transition"
                                            >
                                                <div>
                                                    <Link
                                                        href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                        className="font-semibold text-sm text-dark hover:text-blue transition block"
                                                    >
                                                        {sp.shop?.name}
                                                    </Link>
                                                    {sp.display_title !== product.title && (
                                                        <Link
                                                            href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                            className="text-xs text-blue hover:underline font-semibold block mt-0.5"
                                                        >
                                                            {sp.display_title}
                                                        </Link>
                                                    )}
                                                    <p className="text-[11px] text-dark-4 mt-0.5">{sp.shop?.address}</p>
                                                    <span className="text-[10px] text-green font-medium mt-1 block">
                                                        ✓ {sp.stock_quantity} in stock
                                                    </span>
                                                </div>

                                                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                                                    <span className="font-extrabold text-base text-dark block">
                                                        {formatBDT(sp.display_price)}
                                                    </span>
                                                    <Link
                                                        href={`/products/${product.slug}?shop=${sp.shop?.slug}`}
                                                        className="px-4 py-2 bg-blue hover:bg-blue-dark text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5"
                                                    >
                                                        <ShoppingBag className="w-3.5 h-3.5" />
                                                        <span>View from Store</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-6 bg-gray-1 rounded-xl border border-gray-3 text-center text-xs text-dark-4">
                                        Currently not stocked by any shop.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                    <div className="pt-10 border-t border-gray-3 space-y-6">
                        <h3 className="font-bold text-lg sm:text-xl text-dark">
                            Related Products in {product.category?.name}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((rp) => (
                                <div key={rp.id} className="group">
                                    <div className="relative overflow-hidden flex items-center justify-center rounded-xl bg-[#F6F7FB] min-h-50 mb-3 p-4">
                                        <Link href={`/products/${rp.slug}`}>
                                            <img
                                                src={rp.thumbnail_url || '/images/placeholder-product.svg'}
                                                alt={rp.title}
                                                className="h-32 object-contain group-hover:scale-105 transition duration-300"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                                                }}
                                            />
                                        </Link>
                                    </div>
                                    <h4 className="font-medium text-xs text-dark hover:text-blue mb-1 line-clamp-1">
                                        <Link href={`/products/${rp.slug}`}>{rp.title}</Link>
                                    </h4>
                                    <span className="text-sm font-bold text-dark">{formatBDT(rp.base_price)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            {/* Lightbox Modal */}
            {isLightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4 backdrop-blur-sm"
                    onClick={() => setIsLightboxOpen(false)}
                >
                    <div
                        className="w-full max-w-4xl flex items-center justify-between text-white pb-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="text-sm font-semibold truncate max-w-md">
                            {displayTitle} &bull; <span className="text-white/70">Photo {currentIndex + 1} of {galleryImages.length}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsLightboxOpen(false)}
                            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div
                        className="relative max-w-4xl max-h-[75vh] w-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={activeImage}
                            alt={displayTitle}
                            className="max-h-[70vh] max-w-full object-contain rounded-lg"
                        />

                        {galleryImages.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition cursor-pointer"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </div>

                    {galleryImages.length > 1 && (
                        <div
                            className="flex items-center gap-2 overflow-x-auto max-w-xl py-3 px-4 bg-white/10 rounded-2xl backdrop-blur-md mt-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {galleryImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => setCurrentIndex(idx)}
                                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 p-1 transition cursor-pointer ${
                                        currentIndex === idx
                                            ? 'border-blue bg-white/20'
                                            : 'border-transparent opacity-60 hover:opacity-100'
                                    }`}
                                >
                                    <img
                                        src={galleryThumbs[idx] || img}
                                        alt=""
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = img;
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
