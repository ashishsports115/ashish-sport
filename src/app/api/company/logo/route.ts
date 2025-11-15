import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json(
                { error: 'File must be an image' },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: 'File size must be less than 5MB' },
                { status: 400 }
            );
        }

        const adminClient = createAdminClient();

        // Get existing company details to delete old logo and get ID
        const { data: existing } = await adminClient
            .from('company_details')
            .select('id, logo_url')
            .limit(1)
            .single();

        // Delete old logo if it exists
        if (existing?.logo_url) {
            try {
                const oldFileName = existing.logo_url.split('/').pop();
                if (oldFileName) {
                    await adminClient.storage
                        .from('ashishsport-company')
                        .remove([oldFileName]);
                }
            } catch (error) {
                console.error('Error deleting old logo:', error);
                // Continue even if deletion fails
            }
        }

        // Upload new logo
        const fileExt = file.name.split('.').pop();
        const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = fileName;

        const { data: uploadData, error: uploadError } = await adminClient.storage
            .from('ashishsport-company')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (uploadError) {
            console.error('Error uploading logo:', uploadError);
            return NextResponse.json(
                { error: 'Failed to upload logo' },
                { status: 500 }
            );
        }

        // Get public URL
        const {
            data: { publicUrl },
        } = adminClient.storage.from('ashishsport-company').getPublicUrl(filePath);

        // Update company details with new logo URL
        if (existing?.id) {
            // Update existing record
            const { data: companyData, error: updateError } = await adminClient
                .from('company_details')
                .update({
                    logo_url: publicUrl,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id)
                .select()
                .single();

            if (updateError) {
                console.error('Error updating company details:', updateError);
                // Try to delete uploaded file if update fails
                await adminClient.storage.from('ashishsport-company').remove([filePath]);
                return NextResponse.json(
                    { error: 'Failed to update company details' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ logo_url: publicUrl }, { status: 200 });
        } else {
            // Create new record if it doesn't exist
            const { data: companyData, error: insertError } = await adminClient
                .from('company_details')
                .insert([{
                    logo_url: publicUrl,
                    company_name: 'AshishSport',
                    updated_at: new Date().toISOString(),
                }])
                .select()
                .single();

            if (insertError) {
                console.error('Error creating company details:', insertError);
                // Try to delete uploaded file if insert fails
                await adminClient.storage.from('ashishsport-company').remove([filePath]);
                return NextResponse.json(
                    { error: 'Failed to create company details' },
                    { status: 500 }
                );
            }

            return NextResponse.json({ logo_url: publicUrl }, { status: 200 });
        }
    } catch (error) {
        console.error('Error in logo upload API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

