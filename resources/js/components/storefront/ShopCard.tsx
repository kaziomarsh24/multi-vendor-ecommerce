import type { Shop } from '@/types/ecommerce';
import { Link } from '@inertiajs/react';
import { ArrowRight, MapPin, ShieldCheck } from 'lucide-react';

interface ShopCardProps {
    shop: Shop;
    index?: number;
}

export default function ShopCard({ shop, index = 0 }: ShopCardProps) {
    const badgeLetter = shop.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
        <div className="group flex flex-col justify-between rounded-2xl border border-gray-3 bg-white p-3.5 shadow-2xs transition duration-200 hover:shadow-md">
            <div>
                {/* Cover Banner */}
                <div
                    className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-2 bg-cover bg-center"
                    style={{
                        backgroundImage: shop.banner_url
                            ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.25)), url(${shop.banner_url})`
                            : `linear-gradient(135deg, #1C2434 0%, #2D3A4F 60%, #1C2434 100%)`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                    }}
                >
                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold text-emerald-600 shadow-xs backdrop-blur-xs">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Verified
                    </div>

                    {/* Shop Logo inside cover bottom-left */}
                    <div className="absolute bottom-3 left-3 flex h-13 w-13 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-white bg-white p-1 shadow-md">
                        {shop.logo_url ? (
                            <img
                                src={shop.logo_url}
                                alt={shop.name}
                                className="max-h-full max-w-full rounded-lg object-contain"
                                onError={(e) => {
                                    (
                                        e.currentTarget as HTMLElement
                                    ).style.display = 'none';
                                }}
                            />
                        ) : (
                            <div
                                className={`flex h-full w-full items-center justify-center rounded-lg text-sm font-bold ${
                                    index === 0
                                        ? 'bg-blue text-white'
                                        : index === 1
                                          ? 'bg-teal-600 text-white'
                                          : 'bg-dark text-white'
                                }`}
                            >
                                {badgeLetter}
                            </div>
                        )}
                    </div>
                </div>

                {/* Shop Info */}
                <div className="px-1 pt-3">
                    <h3 className="truncate text-base font-bold text-dark transition hover:text-blue">
                        <Link href={`/shops/${shop.slug}`}>{shop.name}</Link>
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-dark-4">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-blue" />
                        <span className="truncate">
                            {shop.address || 'Dhaka, Bangladesh'}
                        </span>
                    </p>
                    {shop.description && (
                        <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-dark-3">
                            {shop.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Inventory Count & Visit Link */}
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 px-1 pt-3">
                <div>
                    <span className="block text-[10px] font-medium text-dark-4 uppercase">
                        Inventory
                    </span>
                    <span className="text-xs font-bold text-dark">
                        {shop.shop_products_count ?? 0} Products Stocked
                    </span>
                </div>
                <Link
                    href={`/shops/${shop.slug}`}
                    className="flex items-center gap-1.5 rounded-xl bg-dark px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-blue"
                >
                    <span>Visit Store</span>
                    <ArrowRight className="h-3 w-3" />
                </Link>
            </div>
        </div>
    );
}
