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
    const currentShopSlug = shopSlug || item.shop?.slug;
    const targetUrl = currentShopSlug
        ? `/products/${item.product?.slug}?shop=${currentShopSlug}`
        : `/products/${item.product?.slug}`;

    const price = Number(item.display_price);
    const comparePrice = item.display_compare_price ? Number(item.display_compare_price) : null;
    const discountPercent =
        comparePrice && comparePrice > price
            ? Math.round(((comparePrice - price) / comparePrice) * 100)
            : null;

    const formatBDT = (amount: number) => `৳${amount.toLocaleString('en-US')}`;

    return (
        <div className="group rounded-2xl bg-white border border-gray-3 p-4 flex flex-col justify-between hover:shadow-md transition duration-200">
            <div>
                {/* Product Image */}
                <div className="relative overflow-hidden flex items-center justify-center rounded-xl bg-gray-1 aspect-square p-4 mb-3">
                    {discountPercent && (
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-bold z-10 shadow-2xs">
                            -{discountPercent}%
                        </span>
                    )}
                    <Link href={targetUrl} className="w-full h-full flex items-center justify-center">
                        <img
                            src={item.display_thumbnail_url || '/images/placeholder-product.svg'}
                            alt={item.display_title}
                            className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                            }}
                        />
                    </Link>
                </div>

                {/* Category Tag */}
                {item.product?.category && (
                    <span className="text-[10px] text-dark-4 font-medium uppercase tracking-wider block mb-1">
                        {item.product.category.name}
                    </span>
                )}

                {/* Product Title */}
                <h3 className="font-semibold text-sm text-dark hover:text-blue mb-1 line-clamp-1">
                    <Link href={targetUrl}>{item.display_title}</Link>
                </h3>

                {/* Shop Origin */}
                {showShop && item.shop && (
                    <div className="text-[11px] text-dark-4 mb-1.5 flex items-center gap-1">
                        <Store className="w-3 h-3 text-blue shrink-0" />
                        <span>Sold by</span>
                        <Link href={`/shops/${item.shop.slug}`} className="text-dark-2 hover:text-blue font-semibold truncate">
                            {item.shop.name}
                        </Link>
                    </div>
                )}

                {/* In-stock status */}
                {showStock && (
                    <span className="inline-block text-[11px] text-emerald-600 font-medium">
                        ✓ {item.stock_quantity} in stock
                    </span>
                )}
            </div>

            {/* Price & Action */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-2">
                <div>
                    <span className="font-bold text-base text-dark block">{formatBDT(price)}</span>
                    {comparePrice && comparePrice > price && (
                        <span className="text-dark-4 line-through text-[11px]">
                            {formatBDT(comparePrice)}
                        </span>
                    )}
                </div>
                <Link
                    href={targetUrl}
                    className="px-3.5 py-1.5 bg-blue hover:bg-blue-dark text-white rounded-lg text-xs font-semibold transition shadow-2xs flex items-center gap-1"
                >
                    <ShoppingBag className="w-3 h-3" />
                    <span>Details</span>
                </Link>
            </div>
        </div>
    );
}
