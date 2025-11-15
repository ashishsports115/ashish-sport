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

    // Check if user is admin (you can customize this logic)
    // For now, we'll check if user exists and is authenticated
    return user;
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await checkAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const { title, category, price, description, image_url, image_urls } = body;

        const adminClient = createAdminClient();
        const updateData: any = {
            title,
            category,
            price: price || null,
            description: description || null,
        };

        // Update image_urls if provided
        if (image_urls && Array.isArray(image_urls)) {
            updateData.image_urls = image_urls;
            updateData.image_url = image_urls[0] || image_url; // Keep first image for backward compatibility
        } else if (image_url) {
            updateData.image_url = image_url;
        }

        const { data, error } = await adminClient
            .from('outfits')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating outfit:', error);
            return NextResponse.json(
                { error: 'Failed to update outfit' },
                { status: 500 }
            );
        }

        return NextResponse.json({ data }, { status: 200 });
    } catch (error) {
        console.error('Error in update outfit API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await checkAdmin();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const adminClient = createAdminClient();

        // First, get the outfit to delete the images from storage
        const { data: outfit } = await adminClient
            .from('outfits')
            .select('image_url, image_urls')
            .eq('id', id)
            .single();

        // Delete from database
        const { error } = await adminClient.from('outfits').delete().eq('id', id);

        if (error) {
            console.error('Error deleting outfit:', error);
            return NextResponse.json(
                { error: 'Failed to delete outfit' },
                { status: 500 }
            );
        }

        // Delete images from storage if they exist
        const imagesToDelete: string[] = [];

        // Add image_urls if they exist
        if (outfit?.image_urls && Array.isArray(outfit.image_urls)) {
            outfit.image_urls.forEach((url: string) => {
                const fileName = url.split('/').pop();
                if (fileName) imagesToDelete.push(fileName);
            });
        }

        // Add image_url if it exists and not already in the list
        if (outfit?.image_url) {
            const fileName = outfit.image_url.split('/').pop();
            if (fileName && !imagesToDelete.includes(fileName)) {
                imagesToDelete.push(fileName);
            }
        }

        // Delete all images from storage
        if (imagesToDelete.length > 0) {
            try {
                await adminClient.storage
                    .from('ashishsport-outfits')
                    .remove(imagesToDelete);
            } catch (storageError) {
                console.error('Error deleting images from storage:', storageError);
                // Continue even if storage deletion fails
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error in delete outfit API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

