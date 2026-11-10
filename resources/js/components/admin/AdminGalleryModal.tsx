import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { X, ChevronLeft, ChevronRight, Eye, Edit3 } from 'lucide-react';
import type { Product } from '@/types/ecommerce';

interface AdminGalleryModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function AdminGalleryModal({
    product,
    onClose,
}: AdminGalleryModalProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [product]);

    if (!product) return null;

    const photos = [
        product.thumbnail_url,
        ...(product.gallery_urls || []),
    ].filter(Boolean) as string[];
    const thumbs = [
        product.thumb_url,
        ...(product.gallery_thumb_urls || []),
    ].filter(Boolean) as string[];
    const activePhoto =
        photos[activeIndex] || photos[0] || '/images/placeholder-product.svg';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl space-y-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                    <div>
                        <span className="block text-[10px] font-bold tracking-wider text-blue-600 uppercase">
                            {product.category?.name || 'Product'} &bull; SKU:{' '}
                            {product.sku}
                        </span>
                        <h3 className="text-base leading-tight font-bold text-gray-900">
                            {product.title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="cursor-pointer rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Gallery Active Photo View */}
                <div className="space-y-4">
                    <div className="group relative flex h-72 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-[#F6F7FB] p-4">
                        <img
                            src={activePhoto}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                    '/images/placeholder-product.svg';
                            }}
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex(
                                            (prev) =>
                                                (prev - 1 + photos.length) %
                                                photos.length,
                                        )
                                    }
                                    className="absolute top-1/2 left-2 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-gray-700 shadow-md transition hover:bg-white hover:text-blue-600"
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setActiveIndex(
                                            (prev) =>
                                                (prev + 1) % photos.length,
                                        )
                                    }
                                    className="absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded-full bg-white/90 p-2 text-gray-700 shadow-md transition hover:bg-white hover:text-blue-600"
                                >
                                    <ChevronRight className="h-5 w-5" />
                                </button>
                            </>
                        )}

                        <span className="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">
                            {activeIndex + 1} / {photos.length}
                        </span>
                    </div>

                    {/* Thumbnails Row */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {photos.map((_, idx) => (
                            <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveIndex(idx)}
                                className={`flex h-14 w-14 shrink-0 cursor-pointer items-center justify-center rounded-lg border-2 bg-[#F6F7FB] p-1 transition ${
                                    activeIndex === idx
                                        ? 'border-blue-600 ring-2 ring-blue-100'
                                        : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <img
                                    src={thumbs[idx] || photos[idx]}
                                    alt=""
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        (
                                            e.currentTarget as HTMLImageElement
                                        ).src = photos[idx];
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Actions & Links */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-xs">
                        <div className="max-w-xs truncate font-mono text-[11px] text-gray-400">
                            {activePhoto}
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex cursor-pointer items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                <span>Storefront View</span>
                            </a>
                            <Link
                                href={`/admin/catalog/${product.id}/edit`}
                                className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white transition hover:bg-blue-700"
                            >
                                <Edit3 className="h-3.5 w-3.5" />
                                <span>Edit Images</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
