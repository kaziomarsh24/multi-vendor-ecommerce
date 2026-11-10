import type { ShopProduct } from '@/types/ecommerce';
import { Link } from '@inertiajs/react';

interface HeroSectionProps {
    featured?: ShopProduct | null;
    promos?: ShopProduct[];
}

export default function HeroSection({ featured, promos = [] }: HeroSectionProps) {
    const promoTop = promos[0];
    const promoBottom = promos[1];

    const getDiscountPercent = (item?: ShopProduct | null) => {
        if (!item) return null;
        const price = Number(item.display_price);
        const comparePrice = item.display_compare_price ? Number(item.display_compare_price) : null;
        if (comparePrice && comparePrice > price) {
            return Math.round(((comparePrice - price) / comparePrice) * 100);
        }
        return null;
    };

    const featuredDiscount = getDiscountPercent(featured) || 15;
    const promoTopDiscount = getDiscountPercent(promoTop) || 12;

    const featuredUrl = featured
        ? `/products/${featured.product?.slug}?shop=${featured.shop?.slug}`
        : '/#verified-shops';

    const promoTopUrl = promoTop
        ? `/products/${promoTop.product?.slug}?shop=${promoTop.shop?.slug}`
        : '/#verified-shops';

    const promoBottomUrl = promoBottom
        ? `/products/${promoBottom.product?.slug}?shop=${promoBottom.shop?.slug}`
        : '/#verified-shops';

    const formatBDT = (amount: string | number | null | undefined) => {
        if (!amount) return '৳0';
        return `৳${Number(amount).toLocaleString('en-US')}`;
    };

    return (
        <section className="overflow-hidden pb-10 lg:pb-12 xl:pb-15 pt-8 bg-blue-light">
            <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0">
                <div className="flex flex-wrap gap-5">
                    {/* Hero Left Big Showcase Card */}
                    <div className="xl:max-w-189.25 w-full">
                        <div className="relative z-1 rounded-[10px] bg-white overflow-hidden p-6 sm:p-10 flex items-center flex-col-reverse sm:flex-row justify-between min-h-110">
                            <img
                                src="/images/hero/hero-bg.png"
                                alt="hero bg"
                                className="absolute right-0 bottom-0 -z-1 w-133.5 pointer-events-none"
                            />

                            <div className="max-w-98.5 py-4">
                                <div className="flex items-center gap-4 mb-6">
                                    <span className="font-bold text-4xl text-blue">{featuredDiscount}%</span>
                                    <span className="text-dark text-sm leading-tight font-medium">
                                        Sale
                                        <br />
                                        Off
                                    </span>
                                </div>
                                <h1 className="font-semibold text-dark text-2xl sm:text-3xl mb-3 leading-snug line-clamp-2">
                                    <Link href={featuredUrl}>
                                        {featured?.display_title || 'True Wireless Noise Cancelling Headphone'}
                                    </Link>
                                </h1>
                                <p className="text-dark-4 text-xs mb-6 line-clamp-2">
                                    {featured?.shop
                                        ? `Top deal at ${featured.shop.name}. Multi-shop verified pricing with doorstep warranty.`
                                        : 'Multi-shop price comparison. Shop local authorized vendors across Dhaka with doorstep warranty.'}
                                </p>
                                <Link
                                    href={featuredUrl}
                                    className="inline-flex font-medium text-white text-xs rounded-md bg-dark py-3 px-7 hover:bg-blue transition shadow-xs"
                                >
                                    Explore Deal
                                </Link>
                            </div>

                            <div className="max-w-70 w-full py-4 flex items-center justify-center">
                                <Link href={featuredUrl} className="w-full flex items-center justify-center">
                                    <img
                                        src={featured?.display_thumbnail_url || '/images/hero/hero-01.png'}
                                        alt={featured?.display_title || 'Featured item'}
                                        className="max-h-75 max-w-65 object-contain drop-shadow-xl hover:scale-105 transition duration-300"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = '/images/hero/hero-01.png';
                                        }}
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Hero Right Promo Cards */}
                    <div className="xl:max-w-98.25 w-full flex flex-col justify-between gap-5">
                        {/* Promo 1 */}
                        <div className="w-full relative rounded-[10px] bg-white p-6 flex items-center justify-between overflow-hidden min-h-52.5">
                            <div className="max-w-47.5">
                                <span className="font-medium text-xs text-dark-4 block mb-1 truncate">
                                    {promoTop?.display_title || 'Apple iPhone 18 Pro'}
                                </span>
                                <h2 className="font-semibold text-dark text-lg mb-2">
                                    Up to {promoTopDiscount}% off
                                </h2>
                                <Link href={promoTopUrl} className="font-medium text-xs text-blue hover:underline">
                                    Browse Sellers &rarr;
                                </Link>
                            </div>
                            <Link href={promoTopUrl} className="shrink-0">
                                <img
                                    src={promoTop?.display_thumbnail_url || '/images/hero/hero-02.png'}
                                    alt={promoTop?.display_title || 'Promo 1'}
                                    className="max-w-30 max-h-35 object-contain hover:scale-105 transition duration-300"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/hero/hero-02.png';
                                    }}
                                />
                            </Link>
                        </div>

                        {/* Promo 2 */}
                        <div className="w-full relative rounded-[10px] bg-white p-6 flex items-center justify-between overflow-hidden min-h-52.5">
                            <div className="max-w-47.5">
                                <span className="font-medium text-xs text-dark-4 block mb-1 truncate">
                                    {promoBottom?.display_title || 'Mechanical Keyboards'}
                                </span>
                                <h2 className="font-semibold text-dark text-lg mb-2">
                                    From {formatBDT(promoBottom?.display_price || 3499)}
                                </h2>
                                <Link href={promoBottomUrl} className="font-medium text-xs text-blue hover:underline">
                                    Explore Offers &rarr;
                                </Link>
                            </div>
                            <Link href={promoBottomUrl} className="shrink-0">
                                <img
                                    src={promoBottom?.display_thumbnail_url || '/images/hero/hero-03.png'}
                                    alt={promoBottom?.display_title || 'Promo 2'}
                                    className="max-w-32.5 max-h-35 object-contain hover:scale-105 transition duration-300"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = '/images/hero/hero-03.png';
                                    }}
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trust Badges */}
            <div className="max-w-292.5 w-full mx-auto px-4 sm:px-8 xl:px-0 mt-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex items-center gap-4">
                        <img src="/images/icons/icon-01.svg" alt="icon" width="40" height="41" />
                        <div>
                            <h3 className="font-semibold text-sm text-dark">Free Shipping</h3>
                            <p className="text-xs text-dark-4">For all orders inside Dhaka</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/images/icons/icon-02.svg" alt="icon" width="40" height="41" />
                        <div>
                            <h3 className="font-semibold text-sm text-dark">1 & 1 Returns</h3>
                            <p className="text-xs text-dark-4">7-day replacement warranty</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/images/icons/icon-03.svg" alt="icon" width="40" height="41" />
                        <div>
                            <h3 className="font-semibold text-sm text-dark">100% Secure Payments</h3>
                            <p className="text-xs text-dark-4">Cash on Delivery & bKash</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <img src="/images/icons/icon-04.svg" alt="icon" width="40" height="41" />
                        <div>
                            <h3 className="font-semibold text-sm text-dark">24/7 Dedicated Support</h3>
                            <p className="text-xs text-dark-4">+880 1603-700911</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
