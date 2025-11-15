'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import type { Outfit } from '@/types';
import { formatPrice } from '@/lib/utils';

interface OutfitAdminCardProps {
    outfit: Outfit;
}

export function OutfitAdminCard({ outfit }: OutfitAdminCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this outfit?')) {
            return;
        }

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete outfit');
            }

            window.location.reload();
        } catch (error) {
            alert('Failed to delete outfit. Please try again.');
            setIsDeleting(false);
        }
    };

    // Use first image from image_urls array if available, otherwise fall back to image_url
    const displayImage = outfit.image_urls && outfit.image_urls.length > 0
        ? outfit.image_urls[0]
        : outfit.image_url;

    return (
        <div className="bg-white border border-gray-200 overflow-hidden hover-lift group">
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
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-4 md:p-6">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-medium">
                    {outfit.category}
                </p>
                <h3 className="text-base md:text-lg font-semibold text-black mb-2 leading-tight">{outfit.title}</h3>
                {outfit.price !== null && (
                    <p className="text-base md:text-lg font-bold text-black mb-4">{formatPrice(outfit.price)}</p>
                )}
                <div className="flex gap-2">
                    <Link
                        href={`/admin/outfits/${outfit.id}/edit`}
                        className="flex-1 bg-black text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-center hover:bg-gray-900 transition-colors"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-white border-2 border-black text-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
}

