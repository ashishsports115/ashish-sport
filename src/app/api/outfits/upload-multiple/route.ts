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
        const files = formData.getAll('files') as File[];
        const title = formData.get('title') as string;
        const category = formData.get('category') as string;
        const price = formData.get('price') as string;
        const description = formData.get('description') as string;

        if (!files || files.length === 0 || !title || !category) {
            return NextResponse.json(
                { error: 'Files, title, and category are required' },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();
        const uploadedUrls: string[] = [];
        const uploadedPaths: string[] = [];

        // Upload all files to Supabase Storage
        for (const file of files) {
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
                // Clean up already uploaded files
                if (uploadedPaths.length > 0) {
                    await adminClient.storage.from('ashishsport-outfits').remove(uploadedPaths);
                }
                return NextResponse.json(
                    { error: 'Failed to upload images' },
                    { status: 500 }
                );
            }

            uploadedPaths.push(filePath);

            // Get public URL
            const {
                data: { publicUrl },
            } = adminClient.storage.from('ashishsport-outfits').getPublicUrl(filePath);
            uploadedUrls.push(publicUrl);
        }

        // Insert outfit record with multiple image URLs
        const { data: outfitData, error: insertError } = await adminClient
            .from('outfits')
            .insert([
                {
                    title,
                    category,
                    price: price ? parseFloat(price) : null,
                    description: description || null,
                    image_url: uploadedUrls[0], // First image for backward compatibility
                    image_urls: uploadedUrls, // Array of all images
                },
            ])
            .select()
            .single();

        if (insertError) {
            console.error('Error inserting outfit:', insertError);
            // Try to delete uploaded files if insert fails
            if (uploadedPaths.length > 0) {
                await adminClient.storage.from('ashishsport-outfits').remove(uploadedPaths);
            }
            return NextResponse.json(
                { error: 'Failed to create outfit' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data: outfitData }, { status: 201 });
    } catch (error) {
        console.error('Error in upload-multiple API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

