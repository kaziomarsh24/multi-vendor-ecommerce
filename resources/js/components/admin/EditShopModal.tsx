import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Upload } from 'lucide-react';
import type { Shop, User } from '@/types/ecommerce';

interface EditShopModalProps {
    shop: Shop | null;
    availableOwners: User[];
    onClose: () => void;
}

export default function EditShopModal({
    shop,
    availableOwners,
    onClose,
}: EditShopModalProps) {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);

    const editForm = useForm<{
        _method: string;
        name: string;
        email: string;
        phone: string;
        address: string;
        description: string;
        is_active: boolean;
        user_id: number;
        logo: File | null;
        banner: File | null;
    }>({
        _method: 'PUT',
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        is_active: true,
        user_id: 0,
        logo: null,
        banner: null,
    });

    useEffect(() => {
        if (!shop) return;

        setLogoPreview(shop.logo_url || null);
        setBannerPreview(shop.banner_url || null);
        editForm.setData({
            _method: 'PUT',
            name: shop.name,
            email: shop.email || '',
            phone: shop.phone || '',
            address: shop.address || '',
            description: shop.description || '',
            is_active: shop.is_active,
            user_id: shop.user_id,
            logo: null,
            banner: null,
        });
    }, [shop]);

    if (!shop) return null;

    const handleClose = () => {
        editForm.reset();
        setLogoPreview(null);
        setBannerPreview(null);
        onClose();
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            editForm.setData('logo', file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            editForm.setData('banner', file);
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editForm.post(`/admin/shops/${shop.id}`, {
            forceFormData: true,
            onSuccess: handleClose,
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
            <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">
                            Edit Shop Details
                        </h3>
                        <p className="text-xs text-gray-500">{shop.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-lg p-1 text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Shop Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={editForm.data.name}
                            onChange={(e) =>
                                editForm.setData('name', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue"
                        />
                        {editForm.errors.name && (
                            <span className="text-[11px] text-rose-600">
                                {editForm.errors.name}
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                placeholder="e.g. contact@shop.com"
                                value={editForm.data.email}
                                onChange={(e) =>
                                    editForm.setData('email', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue"
                            />
                            {editForm.errors.email && (
                                <span className="text-[11px] text-rose-600">
                                    {editForm.errors.email}
                                </span>
                            )}
                        </div>
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Phone
                            </label>
                            <input
                                type="text"
                                value={editForm.data.phone}
                                onChange={(e) =>
                                    editForm.setData('phone', e.target.value)
                                }
                                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue"
                            />
                            {editForm.errors.phone && (
                                <span className="text-[11px] text-rose-600">
                                    {editForm.errors.phone}
                                </span>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Physical Address
                        </label>
                        <input
                            type="text"
                            value={editForm.data.address}
                            onChange={(e) =>
                                editForm.setData('address', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue"
                        />
                        {editForm.errors.address && (
                            <span className="text-[11px] text-rose-600">
                                {editForm.errors.address}
                            </span>
                        )}
                    </div>

                    {/* Owner Assignment */}
                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Assigned Shop Owner
                        </label>
                        <select
                            value={editForm.data.user_id}
                            onChange={(e) =>
                                editForm.setData(
                                    'user_id',
                                    Number(e.target.value),
                                )
                            }
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue"
                        >
                            {shop.owner && (
                                <option value={shop.owner.id}>
                                    {shop.owner.name} ({shop.owner.email})
                                    [Current Owner]
                                </option>
                            )}
                            {availableOwners
                                .filter((o) => o.id !== shop.user_id)
                                .map((o) => (
                                    <option key={o.id} value={o.id}>
                                        {o.name} ({o.email})
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Logo & Banner Uploads with Preview */}
                    <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Shop Logo
                            </label>
                            {logoPreview ? (
                                <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-2">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="h-12 w-12 rounded border border-gray-200 bg-white object-contain p-1"
                                    />
                                    <label className="cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-medium transition hover:border-blue hover:text-blue">
                                        Change
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-3 transition hover:border-blue">
                                    <Upload className="mb-1 h-4 w-4 text-gray-400" />
                                    <span className="text-[11px] font-medium text-gray-600">
                                        Upload logo
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        <div>
                            <label className="mb-1 block font-semibold text-gray-700">
                                Shop Banner
                            </label>
                            {bannerPreview ? (
                                <div className="flex items-center gap-2.5 rounded-lg border border-gray-200 bg-gray-50 p-2">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="h-12 w-16 rounded border border-gray-200 object-cover"
                                    />
                                    <label className="cursor-pointer rounded border border-gray-300 bg-white px-2.5 py-1.5 text-[11px] font-medium transition hover:border-blue hover:text-blue">
                                        Change
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleBannerChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            ) : (
                                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50/50 p-3 transition hover:border-blue">
                                    <Upload className="mb-1 h-4 w-4 text-gray-400" />
                                    <span className="text-[11px] font-medium text-gray-600">
                                        Upload banner
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerChange}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block font-semibold text-gray-700">
                            Description
                        </label>
                        <textarea
                            rows={2}
                            value={editForm.data.description}
                            onChange={(e) =>
                                editForm.setData('description', e.target.value)
                            }
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-blue"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="edit_is_active"
                            checked={editForm.data.is_active}
                            onChange={(e) =>
                                editForm.setData('is_active', e.target.checked)
                            }
                            className="cursor-pointer rounded border-gray-300 text-blue focus:ring-blue"
                        />
                        <label
                            htmlFor="edit_is_active"
                            className="cursor-pointer font-semibold text-gray-800"
                        >
                            Active
                        </label>
                    </div>

                    <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-blue px-5 py-2 font-semibold text-white shadow-sm hover:bg-blue-dark disabled:opacity-70"
                        >
                            <Save className="h-4 w-4" />
                            <span>
                                {editForm.processing
                                    ? 'Saving...'
                                    : 'Save Changes'}
                            </span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
