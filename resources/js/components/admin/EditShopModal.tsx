import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Save, Upload } from 'lucide-react';
import type { Shop, User } from '@/types/ecommerce';

interface EditShopModalProps {
    shop: Shop | null;
    availableOwners: User[];
    onClose: () => void;
}

export default function EditShopModal({ shop, availableOwners, onClose }: EditShopModalProps) {
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Edit Shop Details</h3>
                        <p className="text-xs text-gray-500">{shop.name}</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Shop Name *</label>
                        <input
                            type="text"
                            required
                            value={editForm.data.name}
                            onChange={(e) => editForm.setData('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none"
                        />
                        {editForm.errors.name && <span className="text-rose-600 text-[11px]">{editForm.errors.name}</span>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Contact Email</label>
                            <input
                                type="email"
                                placeholder="e.g. contact@shop.com"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none"
                            />
                            {editForm.errors.email && <span className="text-rose-600 text-[11px]">{editForm.errors.email}</span>}
                        </div>
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Phone</label>
                            <input
                                type="text"
                                value={editForm.data.phone}
                                onChange={(e) => editForm.setData('phone', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none"
                            />
                            {editForm.errors.phone && <span className="text-rose-600 text-[11px]">{editForm.errors.phone}</span>}
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Physical Address</label>
                        <input
                            type="text"
                            value={editForm.data.address}
                            onChange={(e) => editForm.setData('address', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none"
                        />
                        {editForm.errors.address && <span className="text-rose-600 text-[11px]">{editForm.errors.address}</span>}
                    </div>

                    {/* Owner Assignment */}
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Assigned Shop Owner</label>
                        <select
                            value={editForm.data.user_id}
                            onChange={(e) => editForm.setData('user_id', Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none bg-white"
                        >
                            {shop.owner && (
                                <option value={shop.owner.id}>
                                    {shop.owner.name} ({shop.owner.email}) [Current Owner]
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                            <label className="block font-semibold text-gray-700 mb-1">Shop Logo</label>
                            {logoPreview ? (
                                <div className="flex items-center gap-2.5 p-2 border border-gray-200 rounded-lg bg-gray-50">
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="w-12 h-12 object-contain rounded border border-gray-200 bg-white p-1"
                                    />
                                    <label className="px-2.5 py-1.5 rounded border border-gray-300 bg-white text-[11px] font-medium hover:border-blue hover:text-blue cursor-pointer transition">
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
                                <label className="border-2 border-dashed border-gray-300 hover:border-blue rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 transition">
                                    <Upload className="w-4 h-4 text-gray-400 mb-1" />
                                    <span className="text-[11px] font-medium text-gray-600">Upload logo</span>
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
                            <label className="block font-semibold text-gray-700 mb-1">Shop Banner</label>
                            {bannerPreview ? (
                                <div className="flex items-center gap-2.5 p-2 border border-gray-200 rounded-lg bg-gray-50">
                                    <img
                                        src={bannerPreview}
                                        alt="Banner preview"
                                        className="w-16 h-12 object-cover rounded border border-gray-200"
                                    />
                                    <label className="px-2.5 py-1.5 rounded border border-gray-300 bg-white text-[11px] font-medium hover:border-blue hover:text-blue cursor-pointer transition">
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
                                <label className="border-2 border-dashed border-gray-300 hover:border-blue rounded-lg p-3 flex flex-col items-center justify-center cursor-pointer bg-gray-50/50 transition">
                                    <Upload className="w-4 h-4 text-gray-400 mb-1" />
                                    <span className="text-[11px] font-medium text-gray-600">Upload banner</span>
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
                        <label className="block font-semibold text-gray-700 mb-1">Description</label>
                        <textarea
                            rows={2}
                            value={editForm.data.description}
                            onChange={(e) => editForm.setData('description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-blue outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="edit_is_active"
                            checked={editForm.data.is_active}
                            onChange={(e) => editForm.setData('is_active', e.target.checked)}
                            className="rounded border-gray-300 text-blue focus:ring-blue cursor-pointer"
                        />
                        <label htmlFor="edit_is_active" className="font-semibold text-gray-800 cursor-pointer">
                            Active
                        </label>
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={editForm.processing}
                            className="bg-blue hover:bg-blue-dark text-white px-5 py-2 rounded-lg font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-70"
                        >
                            <Save className="w-4 h-4" />
                            <span>{editForm.processing ? 'Saving...' : 'Save Changes'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
