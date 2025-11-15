'use client';

import Link from 'next/link';

interface ContactButtonProps {
    outfitId: string;
    outfitTitle: string;
}

export function ContactButton({ outfitId, outfitTitle }: ContactButtonProps) {
    return (
        <Link
            href={`/contact?outfit_id=${outfitId}&outfit_title=${encodeURIComponent(outfitTitle)}`}
            className="inline-block bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors duration-200"
        >
            Inquire About This Outfit
        </Link>
    );
}

