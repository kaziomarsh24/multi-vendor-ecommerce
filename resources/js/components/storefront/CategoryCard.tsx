import type { Category } from '@/types/ecommerce';
import { Link } from '@inertiajs/react';

interface CategoryCardProps {
    category: Category;
    index?: number;
}

export default function CategoryCard({
    category,
    index = 0,
}: CategoryCardProps) {
    return (
        <Link
            href={`/?category=${category.slug}`}
            className="group flex flex-col items-center text-center"
        >
            <div className="mb-3 flex h-25 w-25 items-center justify-center rounded-full bg-[#F6F7FB] transition duration-200 group-hover:scale-105">
                <img
                    src={
                        category.icon_url ||
                        `/images/categories/categories-0${(index % 6) + 1}.png`
                    }
                    alt={category.name}
                    className="h-12.5 w-12.5 object-contain"
                    onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                            '/images/categories/categories-01.png';
                    }}
                />
            </div>
            <h3 className="mb-0.5 text-xs font-medium text-dark transition group-hover:text-blue">
                {category.name}
            </h3>
            <span className="text-[10px] text-dark-4">
                {category.products_count ?? 0} items
            </span>
        </Link>
    );
}
