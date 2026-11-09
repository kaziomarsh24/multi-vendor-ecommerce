import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Store,
    Layers,
    Tag,
    ExternalLink,
    LogOut,
    Shield,
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
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-gray-2 text-dark flex flex-col md:flex-row font-sans">
            {/* Sidebar (Matches csn-html-template/admin/) */}
            <aside className="w-full md:w-64 bg-white border-r border-gray-3 min-h-screen flex flex-col justify-between shrink-0 sticky top-0 h-auto md:h-screen z-30">
                <div>
                    {/* CSN Brand Header */}
                    <div className="h-16 px-5 border-b border-gray-3 flex items-center justify-between">
                        <Link href="/admin" className="flex items-center gap-2">
                            <img
                                src="/images/logo/csn_logo_transparent.png"
                                alt="CSN Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                        <span className="text-[9px] font-bold text-blue bg-blue/10 px-2 py-0.5 rounded uppercase tracking-wider">
                            Super Admin
                        </span>
                    </div>

                    {/* Admin Profile Card */}
                    <div className="p-3 mx-4 mt-4 rounded-lg bg-gray-1 border border-gray-3 flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {user?.name ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('') : 'AD'}
                        </div>
                        <div className="truncate flex-1">
                            <h3 className="text-xs font-bold text-dark truncate">{user?.name || 'Kazi Omar Faruk'}</h3>
                            <span className="text-[10px] text-green font-semibold flex items-center gap-1.5 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green inline-block animate-pulse"></span>
                                Administrator
                            </span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <div className="px-4 py-5 space-y-5">
                        <div>
                            <span className="px-3 text-[10px] font-bold text-dark-4 uppercase tracking-wider block mb-2">
                                Menu
                            </span>
                            <nav className="space-y-1">
                                <Link
                                    href="/admin"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                                        currentUrl === '/admin'
                                            ? 'bg-blue/10 text-blue font-bold shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <LayoutDashboard className="w-4 h-4 shrink-0" />
                                    <span>Dashboard</span>
                                </Link>

                                <Link
                                    href="/admin/shops"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                                        currentUrl.startsWith('/admin/shops')
                                            ? 'bg-blue/10 text-blue font-bold shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <Store className="w-4 h-4 shrink-0" />
                                    <span>Shops</span>
                                </Link>

                                <Link
                                    href="/admin/catalog"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                                        currentUrl.startsWith('/admin/catalog')
                                            ? 'bg-blue/10 text-blue font-bold shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <Layers className="w-4 h-4 shrink-0" />
                                    <span>Master Catalog</span>
                                </Link>

                                <Link
                                    href="/admin/categories"
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
                                        currentUrl.startsWith('/admin/categories')
                                            ? 'bg-blue/10 text-blue font-bold shadow-2xs'
                                            : 'text-dark-2 hover:bg-gray-1 hover:text-blue'
                                    }`}
                                >
                                    <Tag className="w-4 h-4 shrink-0" />
                                    <span>Categories</span>
                                </Link>
                            </nav>
                        </div>

                        <div>
                            <span className="px-3 text-[10px] font-bold text-dark-4 uppercase tracking-wider block mb-2">
                                Portals
                            </span>
                            <nav className="space-y-1">
                                <Link
                                    href="/owner/inventory"
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-dark-3 hover:bg-gray-1 hover:text-dark transition"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <UserCheck className="w-3.5 h-3.5 text-dark-4" />
                                        <span>Merchant Portal</span>
                                    </span>
                                    <ArrowRight className="w-3 h-3 text-dark-4" />
                                </Link>

                                <Link
                                    href="/"
                                    target="_blank"
                                    className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-dark-3 hover:bg-gray-1 hover:text-dark transition"
                                >
                                    <span className="flex items-center gap-2.5">
                                        <ExternalLink className="w-3.5 h-3.5 text-dark-4" />
                                        <span>View Storefront</span>
                                    </span>
                                    <ArrowUpRight className="w-3.5 h-3.5 text-dark-4" />
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>

                {/* Footer / Logout */}
                <div className="p-4 border-t border-gray-3 bg-white">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-gray-3 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-dark-3 text-xs font-semibold transition cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                    </Link>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
                {/* Top Header Bar */}
                <header className="bg-white border-b border-gray-3 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm sm:text-base font-bold text-dark">{title || 'Dashboard'}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-dark-4 hover:text-blue transition font-medium"
                        >
                            <span>Live Marketplace</span>
                            <ExternalLink className="w-3 h-3" />
                        </Link>
                        <div className="h-4 w-px bg-gray-3 hidden sm:block"></div>
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-blue text-white font-bold text-[11px] flex items-center justify-center shadow-2xs">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <span className="text-xs font-semibold text-dark hidden md:inline-block">
                                {user?.name || 'Administrator'}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="m-6 mb-0 p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-medium flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="m-6 mb-0 p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                    <div>{children}</div>
                    <footer className="mt-12 pt-6 border-t border-gray-3 flex flex-col sm:flex-row items-center justify-between text-xs text-dark-4 gap-2">
                        <span>CSN Multi-Vendor Platform</span>
                        <span>
                            Developed by{' '}
                            <a
                                href="https://kaziomar.vercel.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-semibold text-dark hover:text-blue transition underline decoration-gray-300 underline-offset-4"
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
