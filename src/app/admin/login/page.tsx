import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/LoginForm';

export default async function AdminLoginPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect('/admin');
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-12">
                    <p className="text-gray-600 font-light uppercase tracking-wider text-sm">Admin Login</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}

