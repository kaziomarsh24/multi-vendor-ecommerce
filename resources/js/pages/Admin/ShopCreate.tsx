import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import {
    ArrowLeft,
    Store,
    User,
    UserPlus,
    ShieldCheck,
    Upload,
} from 'lucide-react';
import type { User as UserType } from '@/types/ecommerce';

interface ShopCreateProps {
    availableOwners: UserType[];
}

export default function ShopCreate({ availableOwners }: ShopCreateProps) {
    const [ownerMode, setOwnerMode] = useState<'existing' | 'new'>(
        availableOwners && availableOwners.length > 0 ? 'existing' : 'new',
    );
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

            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header & Breadcrumbs */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <div className="mb-1 text-xs text-dark-4">
                            <Link
                                href="/admin/shops"
                                className="hover:underline"
                            >
                                Shops Management
                            </Link>{' '}
                            / <span>Register Shop</span>
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight text-dark">
                            Register Shop
                        </h1>
                    </div>

                    <Link
                        href="/admin/shops"
                        className="flex items-center gap-1.5 self-start rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-xs font-medium text-dark-3 shadow-2xs transition hover:bg-gray-50 hover:text-dark sm:self-auto"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        <span>Back to Shops</span>
                    </Link>
                </div>

                {/* Form Card */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-6 rounded-xl border border-gray-3 bg-white p-6 shadow-sm sm:p-8"
                >
                    {/* Basic Shop Info */}
                    <div>
                        <h2 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-bold text-dark">
                            <Store className="h-4 w-4 text-blue" />
                            <span>Shop Details</span>
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-dark">
                                    Shop Name{' '}
                                    <span className="text-rose-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Uttara Tech Universe"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm font-medium text-dark transition focus:border-blue focus:outline-none"
                                />
                                {errors.name && (
                                    <span className="text-[11px] text-rose-600">
                                        {errors.name}
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-dark">
                                        Phone Hotline
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. +880 1700-000000"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                                    />
                                    {errors.phone && (
                                        <span className="text-[11px] text-rose-600">
                                            {errors.phone}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-dark">
                                        Shop Contact Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="e.g. contact@uttaratech.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                                    />
                                    {errors.email && (
                                        <span className="text-[11px] text-rose-600">
                                            {errors.email}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-dark">
                                    Physical Address / Hub Location
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Sector 7, Uttara, Dhaka, Bangladesh"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                                />
                                {errors.address && (
                                    <span className="text-[11px] text-rose-600">
                                        {errors.address}
                                    </span>
                                )}
                            </div>

                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-dark">
                                    Description / Specialty
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Brief overview of shop specialty, warranty support, and target area..."
                                    value={data.description}
                                    onChange={(e) =>
                                        setData('description', e.target.value)
                                    }
                                    className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                                />
                                {errors.description && (
                                    <span className="text-[11px] text-rose-600">
                                        {errors.description}
                                    </span>
                                )}
                            </div>

                            {/* Logo & Banner Uploads */}
                            <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-dark">
                                        Shop Logo
                                    </label>
                                    {logoPreview ? (
                                        <div className="flex items-center gap-3 rounded-lg border border-gray-3 bg-gray-50 p-2.5">
                                            <img
                                                src={logoPreview}
                                                alt="Logo preview"
                                                className="h-14 w-14 rounded border border-gray-200 bg-white object-contain p-1"
                                            />
                                            <label className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-blue hover:text-blue">
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
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-3 bg-gray-50/50 p-4 transition hover:border-blue">
                                            <Upload className="mb-1 h-5 w-5 text-gray-400" />
                                            <span className="text-xs font-medium text-dark">
                                                Upload Shop Logo
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {errors.logo && (
                                        <span className="text-[11px] text-rose-600">
                                            {errors.logo}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-dark">
                                        Shop Banner
                                    </label>
                                    {bannerPreview ? (
                                        <div className="flex items-center gap-3 rounded-lg border border-gray-3 bg-gray-50 p-2.5">
                                            <img
                                                src={bannerPreview}
                                                alt="Banner preview"
                                                className="h-14 w-24 rounded border border-gray-200 object-cover"
                                            />
                                            <label className="cursor-pointer rounded border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium transition hover:border-blue hover:text-blue">
                                                Change Banner
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={
                                                        handleBannerChange
                                                    }
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                    ) : (
                                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-3 bg-gray-50/50 p-4 transition hover:border-blue">
                                            <Upload className="mb-1 h-5 w-5 text-gray-400" />
                                            <span className="text-xs font-medium text-dark">
                                                Upload Shop Banner
                                            </span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleBannerChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
                                    {errors.banner && (
                                        <span className="text-[11px] text-rose-600">
                                            {errors.banner}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shop Owner Credentials */}
                    <div className="pt-2">
                        <h2 className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-sm font-bold text-dark">
                            <ShieldCheck className="h-4 w-4 text-blue" />
                            <span>Shop Owner Account Assignment</span>
                        </h2>

                        <div className="mb-4 flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setOwnerMode('existing')}
                                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                                    ownerMode === 'existing'
                                        ? 'bg-blue text-white shadow-2xs'
                                        : 'border border-gray-3 bg-gray-1 text-dark-3 hover:bg-gray-2'
                                }`}
                            >
                                <User className="h-3.5 w-3.5" />
                                <span>Assign Existing Owner</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setOwnerMode('new')}
                                className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                                    ownerMode === 'new'
                                        ? 'bg-blue text-white shadow-2xs'
                                        : 'border border-gray-3 bg-gray-1 text-dark-3 hover:bg-gray-2'
                                }`}
                            >
                                <UserPlus className="h-3.5 w-3.5" />
                                <span>Create New Owner Account</span>
                            </button>
                        </div>

                        {ownerMode === 'existing' ? (
                            <div>
                                <label className="mb-1.5 block text-xs font-semibold text-dark">
                                    Select Registered Shop Owner{' '}
                                    <span className="text-rose-600">*</span>
                                </label>
                                {availableOwners.length > 0 ? (
                                    <>
                                        <select
                                            value={data.user_id}
                                            onChange={(e) =>
                                                setData(
                                                    'user_id',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2.5 text-sm text-dark transition focus:border-blue focus:outline-none"
                                        >
                                            <option value="">
                                                -- Choose an existing account --
                                            </option>
                                            {availableOwners.map((owner) => (
                                                <option
                                                    key={owner.id}
                                                    value={owner.id}
                                                >
                                                    {owner.name} ({owner.email}){' '}
                                                    {owner.role
                                                        ? `— [${owner.role === 'customer' ? 'Customer' : 'Shop Owner'}]`
                                                        : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="mt-1 text-[11px] text-gray-500">
                                            Registered accounts (including
                                            customers) can be selected.
                                            Assigning a customer will
                                            automatically promote them to Shop
                                            Owner.
                                        </p>
                                    </>
                                ) : (
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                                        All current users already have an
                                        assigned shop. Switch to{' '}
                                        <strong>
                                            "Create New Owner Account"
                                        </strong>{' '}
                                        above to register new merchant
                                        credentials.
                                    </div>
                                )}
                                {errors.user_id && (
                                    <span className="text-[11px] text-rose-600">
                                        {errors.user_id}
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4 rounded-xl border border-gray-3 bg-gray-1 p-4">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-dark">
                                            Owner Full Name{' '}
                                            <span className="text-rose-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="text"
                                            required={ownerMode === 'new'}
                                            placeholder="e.g. Mahfuz Rahman"
                                            value={data.new_owner_name}
                                            onChange={(e) =>
                                                setData(
                                                    'new_owner_name',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-sm text-dark transition focus:border-blue focus:outline-none"
                                        />
                                        {errors.new_owner_name && (
                                            <span className="text-[11px] text-rose-600">
                                                {errors.new_owner_name}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-semibold text-dark">
                                            Owner Email Address{' '}
                                            <span className="text-rose-600">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            type="email"
                                            required={ownerMode === 'new'}
                                            placeholder="e.g. mahfuz@uttaratech.com"
                                            value={data.new_owner_email}
                                            onChange={(e) =>
                                                setData(
                                                    'new_owner_email',
                                                    e.target.value,
                                                )
                                            }
                                            className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-sm text-dark transition focus:border-blue focus:outline-none"
                                        />
                                        {errors.new_owner_email && (
                                            <span className="text-[11px] text-rose-600">
                                                {errors.new_owner_email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold text-dark">
                                        Login Password{' '}
                                        <span className="font-normal text-dark-4">
                                            (default: password)
                                        </span>
                                    </label>
                                    <input
                                        type="password"
                                        placeholder="Min 6 characters"
                                        value={data.new_owner_password}
                                        onChange={(e) =>
                                            setData(
                                                'new_owner_password',
                                                e.target.value,
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-3 bg-white px-3.5 py-2 text-sm text-dark transition focus:border-blue focus:outline-none"
                                    />
                                    {errors.new_owner_password && (
                                        <span className="text-[11px] text-rose-600">
                                            {errors.new_owner_password}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Status & Options */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                        <label className="flex cursor-pointer items-center gap-2.5">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="h-4 w-4 cursor-pointer rounded border-gray-3 text-blue focus:ring-blue"
                            />
                            <span className="text-xs font-semibold text-dark">
                                Active Shop
                            </span>
                        </label>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3 border-t border-gray-3 pt-4">
                        <Link
                            href="/admin/shops"
                            className="cursor-pointer rounded-lg border border-gray-3 bg-white px-5 py-2.5 text-xs font-medium text-dark-3 transition hover:bg-gray-50"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex cursor-pointer items-center gap-2 rounded-lg bg-blue px-6 py-2.5 text-xs font-semibold text-white shadow-2xs transition hover:bg-blue-dark disabled:opacity-70"
                        >
                            <Store className="h-4 w-4" />
                            <span>
                                {processing
                                    ? 'Registering...'
                                    : 'Register Shop'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
