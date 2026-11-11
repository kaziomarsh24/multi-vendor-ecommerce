import type { ShopProduct } from '@/types/ecommerce';
import { Link } from '@inertiajs/react';
import { ShoppingBag, Store } from 'lucide-react';

interface ProductCardProps {
    item: ShopProduct;
    shopSlug?: string;
    showShop?: boolean;
    showStock?: boolean;
}

export default function ProductCard({
    item,
    shopSlug,
    showShop = true,
    showStock = false,
}: ProductCardProps) {
    if (!item.product) {
        return null;
    }

    const currentShopSlug = shopSlug || item.shop?.slug;
    const targetUrl = currentShopSlug
        ? `/products/${item.product?.slug}?shop=${currentShopSlug}`
        : `/products/${item.product?.slug}`;

    const price = Number(item.display_price);
    const comparePrice = item.display_compare_price
        ? Number(item.display_compare_price)
        : null;
    const discountPercent =
        comparePrice && comparePrice > price
            ? Math.round(((comparePrice - price) / comparePrice) * 100)
            : null;

    const formatBDT = (amount: number) => `৳${amount.toLocaleString('en-US')}`;

    return (
        <div className="group flex flex-col justify-between rounded-2xl border border-gray-3 bg-white p-4 transition duration-200 hover:shadow-md">
            <div>
                {/* Product Image */}
                <div className="relative mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-gray-1 p-4">
                    {discountPercent && (
                        <span className="absolute top-2.5 left-2.5 z-10 rounded-md bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white shadow-2xs">
                            -{discountPercent}%
                        </span>
                    )}
                    <Link
                        href={targetUrl}
                        className="flex h-full w-full items-center justify-center"
                    >
                        <img
                            src={
                                item.display_thumbnail_url ||
                                '/images/placeholder-product.svg'
                            }
                            alt={item.display_title}
                            className="max-h-full max-w-full object-contain transition duration-300 group-hover:scale-105"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                    '/images/placeholder-product.svg';
                            }}
                        />
                    </Link>
                </div>

                {/* Category Tag */}
                {item.product?.category && (
                    <span className="mb-1 block text-[10px] font-medium tracking-wider text-dark-4 uppercase">
                        {item.product.category.name}
                    </span>
                )}

                {/* Product Title */}
                <h3 className="mb-1 line-clamp-1 text-sm font-semibold text-dark hover:text-blue">
                    <Link href={targetUrl}>{item.display_title}</Link>
                </h3>

                {/* Shop Origin */}
                {showShop && item.shop && (
                    <div className="mb-1.5 flex items-center gap-1 text-[11px] text-dark-4">
                        <Store className="h-3 w-3 shrink-0 text-blue" />
                        <span>Sold by</span>
                        <Link
                            href={`/shops/${item.shop.slug}`}
                            className="truncate font-semibold text-dark-2 hover:text-blue"
                        >
                            {item.shop.name}
                        </Link>
                    </div>
                )}

                {/* In-stock status */}
                {showStock && (
                    <span className="inline-block text-[11px] font-medium text-emerald-600">
                        ✓ {item.stock_quantity} in stock
                    </span>
                )}
            </div>

            {/* Price & Action */}
            <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
                <div>
                    <span className="block text-base font-bold text-dark">
                        {formatBDT(price)}
                    </span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-[11px] text-dark-4 line-through">
                            {formatBDT(comparePrice)}
                        </span>
                    )}
                </div>
                <Link
                    href={targetUrl}
                    className="flex items-center gap-1 rounded-lg bg-blue px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark"
                >
                    <ShoppingBag className="h-3 w-3" />
                    <span>Details</span>
                </Link>
            </div>
        </div>
    );
}
