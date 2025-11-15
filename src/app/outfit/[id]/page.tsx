import { createClient } from '@/lib/supabase/server';
import { getCompanyDetails } from '@/lib/company';
import { notFound } from 'next/navigation';
import { formatPrice } from '@/lib/utils';
import { ContactButton } from '@/components/ContactButton';
import { ImageGallery } from '@/components/ImageGallery';
import type { Metadata } from 'next';

interface OutfitDetailPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OutfitDetailPageProps): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const company = await getCompanyDetails();
    const { data: outfit } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();

    const companyName = company?.company_name || 'AshishSport';

    if (!outfit) {
        return {
            title: `Outfit Not Found | ${companyName}`,
        };
    }

    // Get images for metadata
    const images = outfit.image_urls && outfit.image_urls.length > 0
        ? outfit.image_urls
        : outfit.image_url
            ? [outfit.image_url]
            : [];

    const metaDescription = outfit.description
        ? outfit.description.substring(0, 160)
        : `${outfit.title} - ${outfit.category}${outfit.price ? ` - ${formatPrice(outfit.price)}` : ''}. Available at ${companyName}.`;

    return {
        title: `${companyName} | ${outfit.title}`,
        description: metaDescription,
        openGraph: {
            title: `${companyName} | ${outfit.title}`,
            description: metaDescription,
            type: 'website',
            images: images.map((url: any) => ({ url })),
        },
        twitter: {
            card: 'summary_large_image',
            title: `${companyName} | ${outfit.title}`,
            description: metaDescription,
            images: images,
        },
    };
}

export default async function OutfitDetailPage({ params }: OutfitDetailPageProps) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: outfit, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !outfit) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 lg:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Image Section */}
                    <div>
                        <ImageGallery
                            images={
                                outfit.image_urls && outfit.image_urls.length > 0
                                    ? outfit.image_urls
                                    : outfit.image_url
                                        ? [outfit.image_url]
                                        : []
                            }
                            alt={outfit.title}
                        />
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col justify-center">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-medium">
                            {outfit.category}
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-6 tracking-tight leading-tight">
                            {outfit.title}
                        </h1>

                        {outfit.price !== null && (
                            <div className="mb-8">
                                <p className="text-3xl md:text-4xl font-bold text-black mb-2">
                                    {formatPrice(outfit.price)}
                                </p>
                            </div>
                        )}

                        <div className="mb-8">
                            <ContactButton outfitId={outfit.id} outfitTitle={outfit.title} />
                        </div>

                        {outfit.description && (
                            <div className="pt-8 border-t border-gray-200">
                                <h2 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Description</h2>
                                <p className="text-sm text-gray-600 font-light leading-relaxed whitespace-pre-line">
                                    {outfit.description}
                                </p>
                            </div>
                        )}
                        {!outfit.description && (
                            <div className="pt-8 border-t border-gray-200">
                                <p className="text-sm text-gray-600 font-light leading-relaxed">
                                    Premium quality sportswear designed for performance and style.
                                    Perfect for athletes who demand the best.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

