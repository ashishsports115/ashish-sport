import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/LoginForm';
import Image from 'next/image';
import { getCompanyDetails } from '@/lib/company';

export default async function AdminLoginPage() {
    const company = await getCompanyDetails();
    const companyName = company?.company_name || 'AshishSport';
    const logoUrl = company?.logo_url || null;
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        redirect('/admin');
    }

    return (
        <div className="bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full py-16">
                <div className="text-center mb-12">
                    {logoUrl && (
                        <div className="flex justify-center mb-4">
                            <Image src={logoUrl} alt={companyName} width={100} height={100} />
                        </div>
                    )}
                    <p className="text-gray-600 font-light uppercase tracking-wider text-sm">Admin Login</p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}

