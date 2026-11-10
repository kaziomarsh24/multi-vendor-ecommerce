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
        <div className="rounded-2xl bg-white border border-gray-3 p-3.5 shadow-2xs hover:shadow-md transition duration-200 flex flex-col justify-between group">
            <div>
                {/* Cover Banner */}
                <div
                    className="h-44 w-full rounded-xl overflow-hidden relative bg-cover bg-center border border-gray-2"
                    style={{
                        backgroundImage: shop.banner_url
                            ? `linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.25)), url(${shop.banner_url})`
                            : `linear-gradient(135deg, #1C2434 0%, #2D3A4F 60%, #1C2434 100%)`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                    }}
                >
                    {/* Status Badge */}
                    <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-[10px] font-bold text-emerald-600 px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                    </div>

                    {/* Shop Logo inside cover bottom-left */}
                    <div className="absolute left-3 bottom-3 w-13 h-13 rounded-xl bg-white p-1 shadow-md border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
                        {shop.logo_url ? (
                            <img
                                src={shop.logo_url}
                                alt={shop.name}
                                className="max-h-full max-w-full object-contain rounded-lg"
                                onError={(e) => {
                                    (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                            />
                        ) : (
                            <div
                                className={`w-full h-full rounded-lg font-bold text-sm flex items-center justify-center ${
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
                <div className="pt-3 px-1">
                    <h3 className="font-bold text-base text-dark hover:text-blue transition truncate">
                        <Link href={`/shops/${shop.slug}`}>{shop.name}</Link>
                    </h3>
                    <p className="text-xs text-dark-4 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-blue shrink-0" />
                        <span className="truncate">{shop.address || 'Dhaka, Bangladesh'}</span>
                    </p>
                    {shop.description && (
                        <p className="text-xs text-dark-3 leading-relaxed mt-2.5 line-clamp-2">
                            {shop.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Inventory Count & Visit Link */}
            <div className="mt-4 pt-3 px-1 border-t border-gray-100 flex items-center justify-between">
                <div>
                    <span className="text-[10px] text-dark-4 block uppercase font-medium">Inventory</span>
                    <span className="font-bold text-dark text-xs">
                        {shop.shop_products_count ?? 0} Products Stocked
                    </span>
                </div>
                <Link
                    href={`/shops/${shop.slug}`}
                    className="px-4 py-2 bg-dark hover:bg-blue text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-1.5"
                >
                    <span>Visit Store</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </div>
        </div>
    );
}
