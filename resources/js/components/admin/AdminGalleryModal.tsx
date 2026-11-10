import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { X, ChevronLeft, ChevronRight, Eye, Edit3 } from 'lucide-react';
import type { Product } from '@/types/ecommerce';

interface AdminGalleryModalProps {
    product: Product | null;
    onClose: () => void;
}

export default function AdminGalleryModal({ product, onClose }: AdminGalleryModalProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setActiveIndex(0);
    }, [product]);

    if (!product) return null;

    const photos = [product.thumbnail_url, ...(product.gallery_urls || [])].filter(Boolean) as string[];
    const thumbs = [product.thumb_url, ...(product.gallery_thumb_urls || [])].filter(Boolean) as string[];
    const activePhoto = photos[activeIndex] || photos[0] || '/images/placeholder-product.svg';

    return (
        <div
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                    <div>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">
                            {product.category?.name || 'Product'} &bull; SKU: {product.sku}
                        </span>
                        <h3 className="text-base font-bold text-gray-900 leading-tight">
                            {product.title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Gallery Active Photo View */}
                <div className="space-y-4">
                    <div className="relative rounded-xl bg-[#F6F7FB] border border-gray-200 h-72 flex items-center justify-center p-4 overflow-hidden group">
                        <img
                            src={activePhoto}
                            alt={product.title}
                            className="max-h-full max-w-full object-contain"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = '/images/placeholder-product.svg';
                            }}
                        />

                        {photos.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-700 hover:text-blue-600 transition cursor-pointer"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveIndex((prev) => (prev + 1) % photos.length)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow-md text-gray-700 hover:text-blue-600 transition cursor-pointer"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </>
                        )}

                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
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
                                className={`w-14 h-14 rounded-lg bg-[#F6F7FB] p-1 flex items-center justify-center border-2 transition cursor-pointer shrink-0 ${
                                    activeIndex === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-400'
                                }`}
                            >
                                <img
                                    src={thumbs[idx] || photos[idx]}
                                    alt=""
                                    className="max-h-full max-w-full object-contain"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = photos[idx];
                                    }}
                                />
                            </button>
                        ))}
                    </div>

                    {/* Actions & Links */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <div className="font-mono text-[11px] text-gray-400 truncate max-w-xs">
                            {activePhoto}
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={`/products/${product.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium transition flex items-center gap-1 cursor-pointer"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Storefront View</span>
                            </a>
                            <Link
                                href={`/admin/catalog/${product.id}/edit`}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition flex items-center gap-1"
                            >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Images</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
