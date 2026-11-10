import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Store,
    Layers,
    Tag,
    ExternalLink,
    LogOut,
    CheckCircle2,
    AlertCircle,
    UserCheck,
    ArrowUpRight,
    ArrowRight,
} from 'lucide-react';
import type { User } from '@/types/ecommerce';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
    const { auth, flash } = usePage<{
        auth: { user: User };
        flash?: { success?: string; error?: string };
    }>().props;

    const user = auth?.user;
    const currentUrl =
        typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="flex min-h-screen flex-col bg-gray-2 font-sans text-dark md:flex-row">
            {/* Sidebar (Matches csn-html-template/admin/) */}
            <aside className="sticky top-0 z-30 flex h-auto min-h-screen w-full shrink-0 flex-col justify-between border-r border-gray-3 bg-white md:h-screen md:w-64">
                <div>
                    {/* CSN Brand Header */}
                    <div className="flex h-16 items-center justify-between border-b border-gray-3 px-5">
                        <Link href="/admin" className="flex items-center gap-2">
                            <img
                                src="/images/logo/csn_logo_transparent.png"
                                alt="CSN Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <span className="rounded bg-blue/10 px-2 py-0.5 text-[9px] font-bold tracking-wider text-blue uppercase">
                            Super Admin
                        </span>
                    </div>

                    {/* Admin Profile Card */}
                    <div className="mx-4 mt-4 flex items-center gap-2.5 rounded-lg border border-gray-3 bg-gray-1 p-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue text-xs font-bold text-white shadow-xs">
                            {user?.name
                                ? user.name
                                      .split(' ')
                                      .map((n) => n[0])
                                      .slice(0, 2)
                                      .join('')
                                : 'AD'}
                        </div>
                        <div className="flex-1 truncate">
                            <h3 className="truncate text-xs font-bold text-dark">
                                {user?.name || 'Kazi Omar Faruk'}
                            </h3>
                            <span className="mt-0.5 flex items-center gap-1.5 text-[10px] font-semibold text-green">
                                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-green"></span>
                                Administrator
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="space-y-5 px-4 py-5">
                        <div>
                            <span className="mb-2 block px-3 text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                                Menu
                            </span>
                            <nav className="space-y-1">
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                                        currentUrl === '/admin'
                                            ? 'bg-blue/10 font-bold text-blue shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                                    <span>Dashboard</span>
                                </Link>

                                <Link
                                    href="/admin/shops"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                                        currentUrl.startsWith('/admin/shops')
                                            ? 'bg-blue/10 font-bold text-blue shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <Store className="h-4 w-4 shrink-0" />
                                    <span>Shops</span>
                                </Link>

                                <Link
                                    href="/admin/catalog"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                                        currentUrl.startsWith('/admin/catalog')
                                            ? 'bg-blue/10 font-bold text-blue shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <Layers className="h-4 w-4 shrink-0" />
                                    <span>Master Catalog</span>
                                </Link>

                                <Link
                                    href="/admin/categories"
                                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                                        currentUrl.startsWith(
                                            '/admin/categories',
                                        )
                                            ? 'bg-blue/10 font-bold text-blue shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <Tag className="h-4 w-4 shrink-0" />
                                    <span>Categories</span>
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <span className="mb-2 block px-3 text-[10px] font-bold tracking-wider text-dark-4 uppercase">
                                Portals
                            </span>
                            <nav className="space-y-1">
                                <Link
                                    href="/owner/inventory"
                                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-dark-3 transition hover:bg-gray-1 hover:text-dark"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <UserCheck className="h-3.5 w-3.5 text-dark-4" />
                                        <span>Merchant Portal</span>
                                    </span>
                                    <ArrowRight className="h-3 w-3 text-dark-4" />
                                </Link>

                                <Link
                                    href="/"
                                    target="_blank"
                                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-dark-3 transition hover:bg-gray-1 hover:text-dark"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <ExternalLink className="h-3.5 w-3.5 text-dark-4" />
                                        <span>View Storefront</span>
                                    </span>
                                    <ArrowUpRight className="h-3.5 w-3.5 text-dark-4" />
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Footer / Logout */}
                <div className="border-t border-gray-3 bg-white p-4">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-3 px-3 py-2.5 text-xs font-semibold text-dark-3 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex min-h-screen flex-1 flex-col overflow-x-hidden">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-3 bg-white px-6 py-3.5 shadow-2xs sm:px-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-bold text-dark sm:text-base">
                            {title || 'Dashboard'}
                        </h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden items-center gap-1.5 text-xs font-medium text-dark-4 transition hover:text-blue sm:inline-flex"
                        >
                            <span>Live Marketplace</span>
                            <ExternalLink className="h-3 w-3" />
                        </Link>
                        <div className="hidden h-4 w-px bg-gray-3 sm:block"></div>
                        <div className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue text-[11px] font-bold text-white shadow-2xs">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <span className="hidden text-xs font-semibold text-dark md:inline-block">
                                {user?.name || 'Administrator'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="m-6 mb-0 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-medium text-emerald-800">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="m-6 mb-0 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-xs font-medium text-rose-800">
                        <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>{children}</div>
                    <footer className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-gray-3 pt-6 text-xs text-dark-4 sm:flex-row">
                        <span>CSN Multi-Vendor Platform</span>
                        <span>
                            Developed by{' '}
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-dark underline decoration-gray-300 underline-offset-4 transition hover:text-blue"
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
