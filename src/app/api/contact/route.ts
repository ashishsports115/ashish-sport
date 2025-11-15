import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, mobile, message, outfit_id } = body;

        if (!name || !mobile || !message) {
            return NextResponse.json(
                { error: 'Name, mobile, and message are required' },
                { status: 400 }
            );
        }

        const supabase = await createClient();
        const { data, error } = await supabase
            .from('contacts')
            .insert([
                {
                    name,
                    mobile,
                    message,
                    outfit_id: outfit_id || null,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error('Error inserting contact:', error);
            return NextResponse.json(
                { error: 'Failed to save contact message' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, data }, { status: 201 });
    } catch (error) {
        console.error('Error in contact API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

