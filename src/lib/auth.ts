import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Check if user is authenticated and redirect to login if not
 * Use this in server components and server actions
 */
export async function requireAuth() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/admin/login');
    }

    return user;
}

/**
 * Check if user is authenticated (returns null if not, user if authenticated)
 * Use this when you need to check auth without redirecting
 */
export async function getAuthUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return user;
}

