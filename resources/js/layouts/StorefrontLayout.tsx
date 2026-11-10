import React, { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import type { User, Shop } from '@/types/ecommerce';

interface StorefrontLayoutProps {
    children: React.ReactNode;
}

export default function StorefrontLayout({ children }: StorefrontLayoutProps) {
    const { auth, allShops, allCategories } = usePage<{
        auth: { user: (User & { shop?: Shop }) | null };
        allShops?: { id: number; name: string; slug: string; logo?: string | null; logo_url?: string | null }[];
        allCategories?: { id: number; name: string }[];
    }>().props;
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('search') || '';
        }
        return '';
    });
    const [searchCategory, setSearchCategory] = useState(() => {
        if (typeof window !== 'undefined') {
            return new URLSearchParams(window.location.search).get('category') || '0';
        }
        return '0';
    });

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const queryParams: Record<string, string> = {};
        if (searchQuery.trim()) {
            queryParams.search = searchQuery.trim();
        }
        if (searchCategory !== '0') {
            queryParams.category = searchCategory;
        }

        router.get('/', queryParams, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return (
        <div className="bg-white min-h-screen flex flex-col font-sans text-dark">
            {/* Header */}
            <header className="w-full bg-white border-b border-gray-3 sticky top-0 z-50">
                <div className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0">
                    {/* Header Top */}
                    <div className="flex flex-col lg:flex-row gap-5 items-end lg:items-center xl:justify-between py-6">
                        {/* Header Top Left */}
                        <div className="xl:w-auto flex-col sm:flex-row w-full flex sm:justify-between sm:items-center gap-5 sm:gap-10">
                            <Link className="shrink-0 flex items-center gap-2 group" href="/">
                                <img
                                    src="/images/logo/csn_logo_transparent.png"
                                    alt="CSN Bangladesh Ltd."
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>

                            <div className="max-w-118.75 w-full">
                                <form onSubmit={handleSearchSubmit}>
                                    <div className="flex items-center">
                                        <div className="bg-gray-1 rounded-l-[5px] border border-gray-3 border-r-0 text-dark text-sm py-2.5 pl-3.5 pr-4 flex items-center gap-1.5 cursor-pointer">
                                            <select
                                                value={searchCategory}
                                                onChange={(e) => setSearchCategory(e.target.value)}
                                                className="bg-transparent text-xs text-dark font-medium focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[160px] truncate"
                                            >
                                                <option value="0">All Categories</option>
                                                {allCategories && allCategories.length > 0 ? (
                                                    allCategories.map((cat) => (
                                                        <option key={cat.id} value={String(cat.id)}>
                                                            {cat.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option value="1">Smartphones & Tablets</option>
                                                        <option value="4">Laptops & Computers</option>
                                                        <option value="8">Audio & Sound</option>
                                                        <option value="11">Wearables & Gadgets</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        <div className="relative max-w-83.25 sm:min-w-83.25 w-full">
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 inline-block w-px h-5 bg-gray-3"></span>
                                            <input
                                                type="search"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Search products..."
                                                className="w-full rounded-r-[5px] bg-gray-1 border border-l-0 border-gray-3 py-2.5 pl-4 pr-10 text-xs text-dark outline-none focus:border-blue transition"
                                            />
                                            <button
                                                type="submit"
                                                aria-label="Search"
                                                className="flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 text-dark hover:text-blue transition cursor-pointer"
                                            >
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="fill-current">
                                                    <path d="M17.2687 15.6656L12.6281 11.8969C14.5406 9.28123 14.3437 5.5406 11.9531 3.1781C10.6875 1.91248 8.99995 1.20935 7.19995 1.20935C5.39995 1.20935 3.71245 1.91248 2.44683 3.1781C-0.168799 5.79373 -0.168799 10.0687 2.44683 12.6844C3.71245 13.95 5.39995 14.6531 7.19995 14.6531C8.91558 14.6531 10.5187 14.0062 11.7843 12.8531L16.4812 16.65C16.5937 16.7344 16.7343 16.7906 16.875 16.7906C17.0718 16.7906 17.2406 16.7062 17.3531 16.5656C17.5781 16.2844 17.55 15.8906 17.2687 15.6656ZM7.19995 13.3875C5.73745 13.3875 4.38745 12.825 3.34683 11.7844C1.20933 9.64685 1.20933 6.18748 3.34683 4.0781C4.38745 3.03748 5.73745 2.47498 7.19995 2.47498C8.66245 2.47498 10.0125 3.03748 11.0531 4.0781C13.1906 6.2156 13.1906 9.67498 11.0531 11.7844C10.0406 12.825 8.66245 13.3875 7.19995 13.3875Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Header Top Right */}
                        <div className="flex w-full lg:w-auto items-center gap-7">
                            <div className="hidden xl:flex items-center gap-3.5">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-blue">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M4.7177 3.09215C5.94388 1.80121 7.9721 2.04307 8.98569 3.47665L10.2467 5.26014C11.0574 6.4068 10.9889 8.00097 10.0214 9.01965L9.7765 9.27743C9.77582 9.27921 9.7751 9.28115 9.77436 9.28323C9.76142 9.31959 9.7287 9.43538 9.7609 9.65513C9.82765 10.1107 10.1793 11.0364 11.607 12.5394C13.0391 14.0472 13.9078 14.4025 14.3103 14.4679C14.484 14.4961 14.5748 14.4716 14.6038 14.4614L15.0124 14.0312C15.8862 13.1113 17.2485 12.9301 18.347 13.5623L20.2575 14.662C21.8904 15.6019 22.2705 17.9011 20.9655 19.275L19.545 20.7705C19.1016 21.2373 18.497 21.6358 17.75 21.7095C15.9261 21.8895 11.701 21.655 7.27161 16.9917C3.13844 12.6403 2.35326 8.85538 2.25401 7.00615L2.92011 6.9704L2.25401 7.00615C2.20497 6.09248 2.61224 5.30879 3.1481 4.74464L4.7177 3.09215Z"
                                        fill="#3C50E0"
                                    />
                                </svg>
                                <div>
                                    <span className="block text-[10px] text-dark-4 uppercase tracking-wider">24/7 SUPPORT</span>
                                    <a href="tel:+8801704039173" className="font-medium text-xs text-dark hover:text-blue transition">
                                        +880 1603-700911
                                    </a>
                                </div>
                            </div>

                            <span className="hidden xl:block w-px h-7 bg-gray-3"></span>

                            <div className="flex w-full lg:w-auto justify-between items-center gap-5">
                                <div className="flex items-center gap-5">
                                    {user ? (
                                        <div className="flex items-center gap-2.5">
                                            <div className="w-8 h-8 rounded-full bg-blue text-white font-bold text-xs flex items-center justify-center">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="block text-[10px] text-dark-4 uppercase tracking-wider font-semibold">
                                                    {user.role === 'shop_owner' ? 'SHOP MERCHANT' : user.role === 'admin' ? 'ADMIN' : 'CUSTOMER'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-xs text-dark">{user.name.split(' ')[0]}</span>
                                                    <Link
                                                        href="/logout"
                                                        method="post"
                                                        as="button"
                                                        className="text-[10px] text-rose-600 hover:underline cursor-pointer"
                                                    >
                                                        Logout
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Link href="/login" className="flex items-center gap-2.5">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 1.25C9.37666 1.25 7.25001 3.37665 7.25001 6C7.25001 8.62335 9.37666 10.75 12 10.75C14.6234 10.75 16.75 8.62335 16.75 6C16.75 3.37665 14.6234 1.25 12 1.25Z"
                                                    fill="#3C50E0"
                                                />
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M12 12.25C9.68646 12.25 7.55494 12.7759 5.97546 13.6643C4.4195 14.5396 3.25001 15.8661 3.25001 17.5L3.24995 17.602C3.24882 18.7638 3.2474 20.222 4.52642 21.2635C5.15589 21.7761 6.03649 22.1406 7.22622 22.3815C8.41927 22.6229 9.97424 22.75 12 22.75C14.0258 22.75 15.5808 22.6229 16.7738 22.3815C17.9635 22.1406 18.8441 21.7761 19.4736 21.2635C20.7526 20.222 20.7512 18.7638 20.7501 17.602L20.75 17.5C20.75 15.8661 19.5805 14.5396 18.0246 13.6643C16.4451 12.7759 14.3136 12.25 12 12.25Z"
                                                    fill="#3C50E0"
                                                />
                                            </svg>
                                            <div>
                                                <span className="block text-[10px] text-dark-4 uppercase tracking-wider">ACCOUNT</span>
                                                <p className="font-medium text-xs text-dark">Sign In</p>
                                            </div>
                                        </Link>
                                    )}

                                    <div className="flex items-center gap-2.5 cursor-pointer">
                                        <span className="inline-block relative">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M1.29266 2.7512C1.43005 2.36044 1.8582 2.15503 2.24896 2.29242L2.55036 2.39838C3.16689 2.61511 3.69052 2.79919 4.10261 3.00139C4.54324 3.21759 4.92109 3.48393 5.20527 3.89979C5.48725 4.31243 5.71965 4.87186 6.00288 5.75H19.75C20.4431 5.75 21.0583 6.17743 21.3061 6.82862C21.5539 7.47981 21.3854 8.2144 20.8804 8.68532L17.7651 11.593C17.3023 12.0249 16.7027 12.25 16.0744 12.25H8.25C7.83579 12.25 7.5 11.9142 7.5 11.5C7.5 11.0858 7.83579 10.75 8.25 10.75H16.0744C16.3257 10.75 16.5656 10.66 16.7507 10.4872L19.866 7.57954C19.967 7.48536 20.0007 7.33844 19.9511 7.2082C19.9016 7.07796 19.7785 6.99248 19.6389 6.99248H5.97235C5.67912 6.08272 5.41913 5.39578 5.09344 4.87677C4.73373 4.30353 4.21853 3.91636 3.65682 3.64069C3.15582 3.39483 2.54877 3.18182 1.89069 2.95079L1.58929 2.84483C1.19853 2.70744 0.99312 2.27929 1.13051 1.88853Z"
                                                    fill="#3C50E0"
                                                />
                                            </svg>
                                            <span className="flex items-center justify-center font-medium text-[10px] absolute -right-2 -top-2 bg-blue w-4 h-4 rounded-full text-white">
                                                0
                                            </span>
                                        </span>
                                        <div>
                                            <span className="block text-[10px] text-dark-4 uppercase tracking-wider">CART</span>
                                            <p className="font-medium text-xs text-dark">৳0.00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header Nav Bar */}
                <div className="border-t border-gray-3">
                    <div className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0">
                        <div className="flex items-center justify-between">
                            <nav className="flex items-center gap-6 py-4 text-xs font-semibold text-dark">
                                <Link href="/" className="text-blue border-b-2 border-blue pb-4 -mb-4">
                                    Home
                                </Link>

                                {/* Shops Dropdown */}
                                <div className="relative group pb-4 -mb-4">
                                    <button className="flex items-center gap-1 hover:text-blue transition cursor-pointer">
                                        <span>Shops</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                    <div className="absolute left-0 top-full pt-2 hidden group-hover:block z-50">
                                        <div className="bg-white rounded-lg shadow-lg border border-gray-3 py-2 w-60 text-xs max-h-72 overflow-y-auto">
                                            {(allShops && allShops.length > 0
                                                ? allShops
                                                : [
                                                      { id: 1, name: 'Dhanmondi Gadget Hub', slug: 'dhanmondi-gadget-hub', logo: null },
                                                      { id: 2, name: 'Jamuna Lifestyle & Mart', slug: 'jamuna-lifestyle-mart', logo: null },
                                                      { id: 3, name: 'Chittagong Digital Zone', slug: 'chittagong-digital-zone', logo: null },
                                                  ]
                                            ).map((s) => {
                                                const initials = s.name
                                                    .split(' ')
                                                    .map((w) => w[0])
                                                    .slice(0, 2)
                                                    .join('')
                                                    .toUpperCase();
                                                const logoSrc = s.logo_url || (s.logo ? (s.logo.startsWith('/') || s.logo.startsWith('http') ? s.logo : `/storage/${s.logo}`) : null);

                                                return (
                                                    <Link
                                                        key={s.id}
                                                        href={`/shops/${s.slug}`}
                                                        className="flex items-center gap-2.5 px-4 py-2 hover:bg-gray-1 text-dark hover:text-blue transition"
                                                    >
                                                        {logoSrc ? (
                                                            <img
                                                                src={logoSrc}
                                                                alt={s.name}
                                                                className="w-6 h-6 rounded object-contain border border-gray-2 bg-white shrink-0"
                                                                onError={(e) => {
                                                                    const el = e.currentTarget as HTMLImageElement;
                                                                    el.onerror = null;
                                                                    el.src = '/images/placeholder-product.svg';
                                                                }}
                                                            />
                                                        ) : (
                                                            <span className="w-6 h-6 rounded bg-blue text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                                                                {initials}
                                                            </span>
                                                        )}
                                                        <span className="truncate">{s.name}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {user?.role === 'shop_owner' && (
                                    <Link href="/owner/inventory" className="hover:text-blue transition pb-4 -mb-4 text-dark-2">
                                        Merchant Portal
                                    </Link>
                                )}
                                {user?.role === 'admin' && (
                                    <Link href="/admin" className="hover:text-blue transition pb-4 -mb-4 text-dark-3">
                                        Admin Panel
                                    </Link>
                                )}
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="grow">{children}</main>

            {/* Authentic Nextmerce Footer */}
            <footer className="overflow-hidden border-t border-gray-3 pt-16 pb-10 bg-white">
                <div className="max-w-292.5 mx-auto px-4 sm:px-8 xl:px-0">
                    <div className="flex flex-wrap xl:flex-nowrap gap-10 xl:gap-20 justify-between pb-12 border-b border-gray-3">
                        <div className="max-w-82.5 w-full space-y-4">
                            <img src="/images/logo/csn_logo_transparent.png" alt="CSN Bangladesh Ltd." className="h-8 w-auto object-contain" />
                            <p className="text-xs text-dark-3 leading-relaxed">
                                Multi-Vendor E-Commerce Platform with centralized master catalog and independent merchant shop inventories.
                            </p>
                            <ul className="space-y-2 text-xs text-dark-3 pt-1">
                                <li><strong>Hotline:</strong> +880 1603-700911</li>
                                <li><strong>Email:</strong> support@csnbangladesh.com</li>
                                <li><strong>Location:</strong> Dhaka, Bangladesh</li>
                            </ul>
                        </div>

                        <div className="w-full xl:w-auto flex flex-wrap sm:flex-nowrap gap-10 sm:gap-20 justify-between">
                            <div>
                                <h4 className="font-semibold text-sm text-dark mb-4 uppercase tracking-wider">Verified Shops</h4>
                                <ul className="space-y-2.5 text-xs text-dark-3">
                                    <li><Link href="/shops/dhanmondi-gadget-hub" className="hover:text-blue transition">Dhanmondi Gadget Hub</Link></li>
                                    <li><Link href="/shops/jamuna-lifestyle-mart" className="hover:text-blue transition">Jamuna Lifestyle & Mart</Link></li>
                                    <li><Link href="/shops/chittagong-digital-zone" className="hover:text-blue transition">Chittagong Digital Zone</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm text-dark mb-4 uppercase tracking-wider">Merchant Portal</h4>
                                <ul className="space-y-2.5 text-xs text-dark-3">
                                    <li><Link href="/owner/inventory" className="hover:text-blue transition">My Shop Inventory</Link></li>
                                    <li><Link href="/owner/catalog" className="hover:text-blue transition">Shared Master Catalog</Link></li>
                                    <li><Link href="/login" className="hover:text-blue transition">Merchant Login</Link></li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-semibold text-sm text-dark mb-4 uppercase tracking-wider">Admin Console</h4>
                                <ul className="space-y-2.5 text-xs text-dark-3">
                                    <li><Link href="/admin" className="hover:text-blue transition">Dashboard Overview</Link></li>
                                    <li><Link href="/admin/shops" className="hover:text-blue transition">Shop Management</Link></li>
                                    <li><Link href="/admin/catalog" className="hover:text-blue transition">Master Catalog</Link></li>
                                    <li><Link href="/admin/categories" className="hover:text-blue transition">Categories</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4 text-xs text-dark-4">
                        <p>&copy; 2026 CSN Bangladesh Ltd. All rights reserved.</p>
                        <p className="flex items-center gap-1.5">
                            <span>Developed by</span>
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-dark hover:text-blue transition underline decoration-gray-300 underline-offset-4"
                            >
                                Kazi Omar Faruk
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
