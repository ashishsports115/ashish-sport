import Link from 'next/link';
import Image from 'next/image';
import type { Outfit } from '@/types';
import { formatPrice } from '@/lib/utils';

interface OutfitCardProps {
    outfit: Outfit;
}

export function OutfitCard({ outfit }: OutfitCardProps) {
    // Use first image from image_urls array if available, otherwise fall back to image_url
    const displayImage = outfit.image_urls && outfit.image_urls.length > 0
        ? outfit.image_urls[0]
        : outfit.image_url;

    return (
        <Link href={`/outfit/${outfit.id}`} className="group block">
            <div className="bg-white overflow-hidden hover-lift">
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                    {displayImage ? (
                        <Image
                            src={displayImage}
                            alt={outfit.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="pt-4 pb-2">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">
                        {outfit.category}
                    </p>
                    <h3 className="text-base md:text-lg font-semibold text-black mb-2 group-hover:opacity-70 transition-opacity leading-tight">
                        {outfit.title}
                    </h3>
                    {outfit.price !== null && (
                        <p className="text-base md:text-lg font-bold text-black">
                            {formatPrice(outfit.price)}
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}

