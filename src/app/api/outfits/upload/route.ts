import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

async function checkAdmin() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    return user;
}

export async function POST(request: Request) {
    try {
        const user = await checkAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const price = formData.get('price') as string;

        if (!file || !title || !category) {
            return NextResponse.json(
                { error: 'File, title, and category are required' },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();

        // Upload file to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        const { data: uploadData, error: uploadError } = await adminClient.storage
            .from('ashishsport-outfits')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading file:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload image' },
                { status: 500 }
            );
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = adminClient.storage.from('ashishsport-outfits').getPublicUrl(filePath);

        // Insert outfit record
        const { data: outfitData, error: insertError } = await adminClient
            .from('outfits')
            .insert([
                {
                    title,
                    category,
                    price: price ? parseFloat(price) : null,
                    image_url: publicUrl,
                },
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting outfit:', insertError);
            // Try to delete uploaded file if insert fails
            await adminClient.storage.from('ashishsport-outfits').remove([filePath]);
            return NextResponse.json(
                { error: 'Failed to create outfit' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: outfitData }, { status: 201 });
    } catch (error) {
        console.error('Error in upload API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

