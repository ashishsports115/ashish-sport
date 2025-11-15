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

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'No files provided' },
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

        return NextResponse.json({ image_urls: uploadedUrls }, { status: 200 });
    } catch (error) {
        console.error('Error in upload-files API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

