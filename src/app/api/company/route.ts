import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

// GET - Public endpoint to fetch company details
export async function GET() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('company_details')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('Error fetching company details:', error);
            return NextResponse.json(
                { error: 'Failed to fetch company details' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error in company GET API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Admin endpoint to update company details
export async function PUT(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const adminClient = createAdminClient();

        // Get existing record or create new one
        const { data: existing } = await adminClient
            .from('company_details')
            .select('id')
            .limit(1)
            .single();

        if (existing) {
            // Update existing record
            const { data, error } = await adminClient
                .from('company_details')
                .update({
                    ...body,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (error) {
                console.error('Error updating company details:', error);
                return NextResponse.json(
                    { error: 'Failed to update company details' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ data }, { status: 200 });
        } else {
            // Create new record
            const { data, error } = await adminClient
                .from('company_details')
                .insert([body])
                .select()
                .single();

            if (error) {
                console.error('Error creating company details:', error);
                return NextResponse.json(
                    { error: 'Failed to create company details' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ data }, { status: 201 });
        }
    } catch (error) {
        console.error('Error in company PUT API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

