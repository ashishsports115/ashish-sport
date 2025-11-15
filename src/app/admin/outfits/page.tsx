import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';
import { OutfitAdminCard } from '@/components/OutfitAdminCard';
import type { Outfit } from '@/types';

export default async function AdminOutfitsPage() {
    // Ensure user is authenticated
    await requireAuth();

    const supabase = await createClient();
    const { data: outfits, error } = await supabase
        .from('outfits')
        .select('*')
        .order('created_at', { ascending: false });

    return (
        <div className="min-h-screen">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 tracking-tight">
                        Manage Outfits
                    </h1>
                    <p className="text-gray-600 font-light">Create and manage your sport outfit collection</p>
                </div>
                <Link
                    href="/admin/outfits/new"
                    className="bg-black text-white px-6 md:px-8 py-3 md:py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors whitespace-nowrap"
                >
                    Add New Outfit
                </Link>
            </div>

            {outfits && outfits.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {outfits.map((outfit: Outfit) => (
                        <OutfitAdminCard key={outfit.id} outfit={outfit} />
                    ))}
                </div>
            ) : (
                <div className="bg-white border border-gray-200 p-16 text-center">
                    <p className="text-gray-400 text-lg mb-6 font-light">No outfits yet.</p>
                    <Link
                        href="/admin/outfits/new"
                        className="inline-block bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
                    >
                        Create your first outfit
                    </Link>
                </div>
            )}
        </div>
    );
}

