import { createClient } from '@/lib/supabase/server';
import { getCompanyDetails } from '@/lib/company';
import { OutfitCard } from '@/components/OutfitCard';
import type { Outfit } from '@/types';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const company = await getCompanyDetails();
    const companyName = company?.company_name || 'AshishSport';
    const description = company?.description || 'Discover premium sport outfits and athletic wear. Browse our collection of high-quality sportswear.';

    return {
        title: `${companyName} — Sport Outfit Gallery`,
        description,
        openGraph: {
            title: `${companyName} — Sport Outfit Gallery`,
            description,
            type: 'website',
        },
    };
}

export default async function HomePage() {
    const supabase = await createClient();
    const company = await getCompanyDetails();
    const { data: outfits, error } = await supabase
        .from('outfits')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching outfits:', error);
    }
    const companyName = company?.company_name || 'AshishSport';
    const tagline = company?.description || 'Discover premium sport outfits and athletic wear. Built for athletes, designed for performance.';
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-gray-50 to-white py-16 md:py-24 lg:py-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black mb-6 tracking-tight leading-none">
                            {companyName}
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto font-light">
                            {tagline}
                        </p>
                    </div>
                </div>
            </section>
            {/* Products Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
                {outfits && outfits.length > 0 ? (
                    <>
                        <div className="mb-12 text-center">
                            <h2 className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight">
                                Featured Collection
                            </h2>
                            <p className="text-gray-600 text-sm uppercase tracking-widest">Premium Sportswear</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {outfits.map((outfit: Outfit) => (
                                <OutfitCard key={outfit.id} outfit={outfit} />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg font-light">No outfits available yet. Check back soon!</p>
                    </div>
                )}
            </section>
        </div>
    );
}

