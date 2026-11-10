import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: {
        url?: string | null;
        label: string;
        active: boolean;
    }[];
    from?: number;
    to?: number;
    total?: number;
    className?: string;
}

export default function Pagination({ links, from, to, total, className = '' }: PaginationProps) {
    if (!links || links.length <= 1) return null;

    return (
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-4 ${className}`}>
            {total !== undefined && from !== undefined && to !== undefined ? (
                <div className="text-xs text-gray-500 font-medium">
                    Showing <span className="font-semibold text-gray-800">{from}</span> to{' '}
                    <span className="font-semibold text-gray-800">{to}</span> of{' '}
                    <span className="font-semibold text-gray-800">{total}</span> items
                </div>
            ) : (
                <div />
            )}

            <div className="flex items-center gap-1">
                {links.map((link, idx) => {
                    const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                    const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                    const cleanLabel = isPrev ? (
                        <span className="flex items-center gap-1">
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Prev</span>
                        </span>
                    ) : isNext ? (
                        <span className="flex items-center gap-1">
                            <span className="hidden sm:inline">Next</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                    ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    );

                    if (!link.url) {
                        return (
                            <span
                                key={idx}
                                className="px-3 py-1.5 text-xs text-gray-300 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed select-none"
                            >
                                {cleanLabel}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={idx}
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                                link.active
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                                    : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            {cleanLabel}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
