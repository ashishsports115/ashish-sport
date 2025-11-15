import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('outfits')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching outfits:', error);
            return NextResponse.json(
                { error: 'Failed to fetch outfits' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error in outfits API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

