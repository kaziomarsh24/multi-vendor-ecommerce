import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Boxes,
    Layers,
    ExternalLink,
    Store,
    LogOut,
    Home,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import type { User, Shop } from '@/types/ecommerce';

interface ShopOwnerLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function ShopOwnerLayout({ children, title }: ShopOwnerLayoutProps) {
    const { auth, flash } = usePage<{
        auth: { user: User & { shop?: Shop } };
        flash?: { success?: string; error?: string };
    }>().props;

    const user = auth?.user;
    const shop = user?.shop;
    const currentUrl = window.location.pathname;

    return (
        <div className="min-h-screen bg-[#F1F5F9] text-[#1C2434] flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-64 bg-[#1C2434] text-white shrink-0 flex flex-col justify-between">
                <div>
                    {/* Header */}
                    <div className="p-5 border-b border-gray-800 flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/images/logo/csn_logo_transparent.png"
                                alt="CSN Logo"
                                className="h-7 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <span className="text-[10px] uppercase font-bold tracking-wider bg-blue-600/30 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
                            Merchant
                        </span>
                    </div>

                    {/* Shop Info Card */}
                    <div className="p-4 mx-3 my-4 bg-gray-800/60 rounded-lg border border-gray-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold">
                                <Store className="w-5 h-5" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-xs font-semibold text-white truncate">
                                    {shop ? shop.name : 'My Shop'}
                                </h4>
                                <span className="text-[11px] text-gray-400 block truncate">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="px-3 space-y-1.5 text-xs font-medium text-gray-300">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                            Menu
                        </div>
                        <Link
                            href="/owner/inventory"
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition ${
                                currentUrl.startsWith('/owner/inventory')
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Boxes className="w-4 h-4" />
                            Inventory
                        </Link>

                        <Link
                            href="/owner/catalog"
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition ${
                                currentUrl.startsWith('/owner/catalog')
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Layers className="w-4 h-4" />
                            Master Catalog
                        </Link>

                        <div className="px-3 pt-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                            Storefront
                        </div>
                        {shop && (
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition text-gray-300"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Store className="w-4 h-4 text-emerald-400" />
                                    View Storefront
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white transition text-gray-300"
                        >
                            <Home className="w-4 h-4" />
                            Marketplace Home
                        </Link>
                    </nav>
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-gray-800">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-rose-900/40 text-gray-300 hover:text-rose-400 text-xs font-semibold transition cursor-pointer"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Nav */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">{title || 'Merchant Portal'}</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {shop && (
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition"
                            >
                                <span>Preview Storefront</span>
                                <ExternalLink className="w-3 h-3" />
                            </Link>
                        )}
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                            <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                                {user?.name?.charAt(0) || 'M'}
                            </span>
                            <div className="text-left hidden sm:block">
                                <span className="block text-xs font-bold text-gray-800">{user?.name}</span>
                                <span className="block text-[10px] text-gray-500">Merchant Owner</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-6 mt-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="p-6 flex-1 flex flex-col justify-between">
                    <div>{children}</div>
                    <footer className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-2">
                        <span>CSN Merchant Portal</span>
                        <span>
                            Developed by{' '}
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-800 hover:text-blue-600 transition underline decoration-gray-300 underline-offset-4"
                            >
                                Kazi Omar Faruk
                            </a>
                        </span>
                    </footer>
                </main>
            </div>
        </div>
    );
}
