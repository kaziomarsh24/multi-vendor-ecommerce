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

export default function ShopOwnerLayout({
    children,
    title,
}: ShopOwnerLayoutProps) {
    const { auth, flash } = usePage<{
        auth: { user: User & { shop?: Shop } };
        flash?: { success?: string; error?: string };
    }>().props;

    const user = auth?.user;
    const shop = user?.shop;
    const currentUrl = window.location.pathname;

    return (
        <div className="flex min-h-screen flex-col bg-[#F1F5F9] font-sans text-[#1C2434] md:flex-row">
            {/* Sidebar */}
            <aside className="flex w-full shrink-0 flex-col justify-between bg-[#1C2434] text-white md:w-64">
                <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-800 p-5">
                        <Link href="/" className="flex items-center gap-2">
                            <img
                                src="/images/logo/csn_logo_transparent.png"
                                alt="CSN Logo"
                                className="h-7 w-auto object-contain brightness-0 invert"
                            />
                        </Link>
                        <span className="rounded border border-blue-500/30 bg-blue-600/30 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-400 uppercase">
                            Merchant
                        </span>
                    </div>

                    {/* Shop Info Card */}
                    <div className="mx-3 my-4 rounded-lg border border-gray-700/50 bg-gray-800/60 p-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-600/20 font-bold text-blue-400">
                                <Store className="h-5 w-5" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="truncate text-xs font-semibold text-white">
                                    {shop ? shop.name : 'My Shop'}
                                </h4>
                                <span className="block truncate text-[11px] text-gray-400">
                                    {user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-1.5 px-3 text-xs font-medium text-gray-300">
                        <div className="px-3 py-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                            Menu
                        </div>
                        <Link
                            href="/owner/inventory"
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition ${
                                currentUrl.startsWith('/owner/inventory')
                                    ? 'bg-blue-600 font-semibold text-white'
                                    : 'hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Boxes className="h-4 w-4" />
                            Inventory
                        </Link>

                        <Link
                            href="/owner/catalog"
                            className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 transition ${
                                currentUrl.startsWith('/owner/catalog')
                                    ? 'bg-blue-600 font-semibold text-white'
                                    : 'hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <Layers className="h-4 w-4" />
                            Master Catalog
                        </Link>

                        <div className="px-3 pt-4 pb-2 text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                            Storefront
                        </div>
                        {shop && (
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="flex items-center justify-between rounded-lg px-3 py-2.5 text-gray-300 transition hover:bg-gray-800 hover:text-white"
                            >
                                <span className="flex items-center gap-2.5">
                                    <Store className="h-4 w-4 text-emerald-400" />
                                    View Storefront
                                </span>
                                <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
                            </Link>
                        )}
                        <Link
                            href="/"
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-gray-300 transition hover:bg-gray-800 hover:text-white"
                        >
                            <Home className="h-4 w-4" />
                            Marketplace Home
                        </Link>
                    </nav>
                </div>

                {/* Footer / Logout */}
                <div className="border-t border-gray-800 p-4">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-xs font-semibold text-gray-300 transition hover:bg-rose-900/40 hover:text-rose-400"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
                {/* Top Nav */}
                <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">
                            {title || 'Merchant Portal'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        {shop && (
                            <Link
                                href={`/shops/${shop.slug}`}
                                className="hidden items-center gap-1.5 rounded-md bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 sm:flex"
                            >
                                <span>Preview Storefront</span>
                                <ExternalLink className="h-3 w-3" />
                            </Link>
                        )}
                        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                {user?.name?.charAt(0) || 'M'}
                            </span>
                            <div className="hidden text-left sm:block">
                                <span className="block text-xs font-bold text-gray-800">
                                    {user?.name}
                                </span>
                                <span className="block text-[10px] text-gray-500">
                                    Merchant Owner
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-6 mt-4 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex flex-1 flex-col justify-between p-6">
                    <div>{children}</div>
                    <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row">
                        <span>CSN Merchant Portal</span>
                        <span>
                            Developed by{' '}
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-gray-800 underline decoration-gray-300 underline-offset-4 transition hover:text-blue-600"
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
