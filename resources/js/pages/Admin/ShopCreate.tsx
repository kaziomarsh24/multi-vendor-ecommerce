import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { ArrowLeft, Store, User, UserPlus, CheckCircle2, ShieldCheck, Upload, X } from 'lucide-react';
import type { User as UserType } from '@/types/ecommerce';

interface ShopCreateProps {
    availableOwners: UserType[];
}

export default function ShopCreate({ availableOwners }: ShopCreateProps) {
    const [ownerMode, setOwnerMode] = useState<'existing' | 'new'>('existing');
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm<{
        name: string;
        email: string;
        phone: string;
        address: string;
        description: string;
        is_active: boolean;
        user_id: number | string;
        new_owner_name: string;
        new_owner_email: string;
        new_owner_password: string;
        logo: File | null;
        banner: File | null;
    }>({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        is_active: true,
        user_id: availableOwners[0]?.id || '',
        new_owner_name: '',
        new_owner_email: '',
        new_owner_password: 'password',
        logo: null,
        banner: null,
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('banner', file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/shops', {
            forceFormData: true,
        });
    };

    return (
        <AdminLayout title="Register New Merchant Shop">
            <Head title="Register New Shop | Admin Console" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header & Breadcrumbs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="text-xs text-dark-4 mb-1">
                            <Link href="/admin/shops" className="hover:underline">
                                Shops Management
                            </Link>{' '}
                            / <span>Register Shop</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-dark">Register Shop</h1>
                    </div>

                    <Link
                        href="/admin/shops"
                        className="self-start sm:self-auto px-3.5 py-2 rounded-lg border border-gray-3 bg-white text-dark-3 hover:text-dark hover:bg-gray-50 text-xs font-medium transition flex items-center gap-1.5 shadow-2xs"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Shops</span>
                    </Link>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-3 p-6 sm:p-8 space-y-6 shadow-sm">
                    {/* Basic Shop Info */}
                    <div>
                        <h2 className="text-sm font-bold text-dark mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Store className="w-4 h-4 text-blue" />
                            <span>Shop Details</span>
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-dark mb-1.5">
                                    Shop Name <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Uttara Tech Universe"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition font-medium"
                                />
                                {errors.name && <span className="text-rose-600 text-[11px]">{errors.name}</span>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-dark mb-1.5">
                                        Phone Hotline
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. +880 1700-000000"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                                    />
                                    {errors.phone && <span className="text-rose-600 text-[11px]">{errors.phone}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-dark mb-1.5">
                                        Shop Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="e.g. contact@uttaratech.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                                    />
                                    {errors.email && <span className="text-rose-600 text-[11px]">{errors.email}</span>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-dark mb-1.5">
                                    Physical Address / Hub Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sector 7, Uttara, Dhaka, Bangladesh"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                                />
                                {errors.address && <span className="text-rose-600 text-[11px]">{errors.address}</span>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-dark mb-1.5">
                                    Description / Specialty
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief overview of shop specialty, warranty support, and target area..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                                />
                                {errors.description && <span className="text-rose-600 text-[11px]">{errors.description}</span>}
                            </div>

                            {/* Logo & Banner Uploads */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-dark mb-1.5">Shop Logo</label>
                                    {logoPreview ? (
                                        <div className="flex items-center gap-3 p-2.5 border border-gray-3 rounded-lg bg-gray-50">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="w-14 h-14 object-contain rounded border border-gray-200 bg-white p-1"
                                            />
                                            <label className="px-3 py-1.5 rounded border border-gray-300 bg-white text-xs font-medium hover:border-blue hover:text-blue cursor-pointer transition">
                                                Change Logo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleLogoChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-3 hover:border-blue rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 transition">
                                            <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                            <span className="text-xs font-medium text-dark">Upload Shop Logo</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {errors.logo && <span className="text-rose-600 text-[11px]">{errors.logo}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-dark mb-1.5">Shop Banner</label>
                                    {bannerPreview ? (
                                        <div className="flex items-center gap-3 p-2.5 border border-gray-3 rounded-lg bg-gray-50">
                                            <img
                                                src={bannerPreview}
                                                alt="Banner preview"
                                                className="w-24 h-14 object-cover rounded border border-gray-200"
                                            />
                                            <label className="px-3 py-1.5 rounded border border-gray-300 bg-white text-xs font-medium hover:border-blue hover:text-blue cursor-pointer transition">
                                                Change Banner
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleBannerChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="border-2 border-dashed border-gray-3 hover:border-blue rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 transition">
                                            <Upload className="w-5 h-5 text-gray-400 mb-1" />
                                            <span className="text-xs font-medium text-dark">Upload Shop Banner</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {errors.banner && <span className="text-rose-600 text-[11px]">{errors.banner}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shop Owner Credentials */}
                    <div className="pt-2">
                        <h2 className="text-sm font-bold text-dark mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                            <ShieldCheck className="w-4 h-4 text-blue" />
                            <span>Shop Owner Account Assignment</span>
                        </h2>

                        <div className="flex items-center gap-3 mb-4">
                            <button
                                type="button"
                                onClick={() => setOwnerMode('existing')}
                                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                    ownerMode === 'existing'
                                        ? 'bg-blue text-white shadow-2xs'
                                        : 'bg-gray-1 text-dark-3 hover:bg-gray-2 border border-gray-3'
                                }`}
                            >
                                <User className="w-3.5 h-3.5" />
                                <span>Assign Existing Owner</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setOwnerMode('new')}
                                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                    ownerMode === 'new'
                                        ? 'bg-blue text-white shadow-2xs'
                                        : 'bg-gray-1 text-dark-3 hover:bg-gray-2 border border-gray-3'
                                }`}
                            >
                                <UserPlus className="w-3.5 h-3.5" />
                                <span>Create New Owner Account</span>
                            </button>
                        </div>

                        {ownerMode === 'existing' ? (
                            <div>
                                <label className="block text-xs font-semibold text-dark mb-1.5">
                                    Select Registered Shop Owner <span className="text-rose-600">*</span>
                                </label>
                                {availableOwners.length > 0 ? (
                                    <select
                                        value={data.user_id}
                                        onChange={(e) => setData('user_id', e.target.value)}
                                        className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2.5 text-dark text-sm focus:outline-none focus:border-blue transition"
                                    >
                                        <option value="">-- Choose an existing owner account --</option>
                                        {availableOwners.map((owner) => (
                                            <option key={owner.id} value={owner.id}>
                                                {owner.name} ({owner.email})
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                                        All current shop owners are already assigned. Switch to <strong>"Create New Owner Account"</strong> to register a new merchant credentials.
                                    </div>
                                )}
                                {errors.user_id && <span className="text-rose-600 text-[11px]">{errors.user_id}</span>}
                            </div>
                        ) : (
                            <div className="p-4 bg-gray-1 rounded-xl border border-gray-3 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-dark mb-1.5">
                                            Owner Full Name <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required={ownerMode === 'new'}
                                            placeholder="e.g. Mahfuz Rahman"
                                            value={data.new_owner_name}
                                            onChange={(e) => setData('new_owner_name', e.target.value)}
                                            className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2 text-dark text-sm focus:outline-none focus:border-blue transition"
                                        />
                                        {errors.new_owner_name && (
                                            <span className="text-rose-600 text-[11px]">{errors.new_owner_name}</span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-semibold text-dark mb-1.5">
                                            Owner Email Address <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required={ownerMode === 'new'}
                                            placeholder="e.g. mahfuz@uttaratech.com"
                                            value={data.new_owner_email}
                                            onChange={(e) => setData('new_owner_email', e.target.value)}
                                            className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2 text-dark text-sm focus:outline-none focus:border-blue transition"
                                        />
                                        {errors.new_owner_email && (
                                            <span className="text-rose-600 text-[11px]">{errors.new_owner_email}</span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-dark mb-1.5">
                                        Login Password <span className="text-dark-4 font-normal">(default: password)</span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={data.new_owner_password}
                                        onChange={(e) => setData('new_owner_password', e.target.value)}
                                        className="w-full bg-white border border-gray-3 rounded-lg px-3.5 py-2 text-dark text-sm focus:outline-none focus:border-blue transition"
                                    />
                                    {errors.new_owner_password && (
                                        <span className="text-rose-600 text-[11px]">{errors.new_owner_password}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status & Options */}
                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue cursor-pointer"
                            />
                            <span className="text-xs font-semibold text-dark">
                                Active Shop
                            </span>
                        </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-3">
                        <Link
                            href="/admin/shops"
                            className="px-5 py-2.5 rounded-lg border border-gray-3 bg-white text-dark-3 hover:bg-gray-50 text-xs font-medium transition cursor-pointer"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 rounded-lg bg-blue hover:bg-blue-dark text-white text-xs font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer disabled:opacity-70"
                        >
                            <Store className="w-4 h-4" />
                            <span>{processing ? 'Registering...' : 'Register Shop'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
