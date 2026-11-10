import type { Category } from '@/types/ecommerce';
import { Link } from '@inertiajs/react';

interface CategoryCardProps {
    category: Category;
    index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
    return (
        <Link
            href={`/?category=${category.slug}`}
            className="group flex flex-col items-center text-center"
        >
            <div className="w-25 h-25 rounded-full bg-[#F6F7FB] flex items-center justify-center mb-3 group-hover:scale-105 transition duration-200">
                <img
                    src={category.icon_url || `/images/categories/categories-0${(index % 6) + 1}.png`}
                    alt={category.name}
                    className="w-12.5 h-12.5 object-contain"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = '/images/categories/categories-01.png';
                    }}
                />
            </div>
            <h3 className="font-medium text-xs text-dark group-hover:text-blue transition mb-0.5">
                {category.name}
            </h3>
            <span className="text-[10px] text-dark-4">{category.products_count ?? 0} items</span>
        </Link>
    );
}
