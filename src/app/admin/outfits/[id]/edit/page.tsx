import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import { OutfitForm } from '@/components/OutfitForm';
import type { Outfit } from '@/types';

export default async function EditOutfitPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    // Ensure user is authenticated
    await requireAuth();

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
        <div className="min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 tracking-tight">
                    Edit Outfit
                </h1>
                <p className="text-gray-600 font-light">Update outfit details</p>
            </div>
            <OutfitForm outfit={outfit as Outfit} />
        </div>
    );
}

