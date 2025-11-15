import { requireAuth } from '@/lib/auth';
import { CompanyDetailsForm } from '@/components/CompanyDetailsForm';
import { createClient } from '@/lib/supabase/server';

export default async function CompanyDetailsPage() {
    await requireAuth();

    const supabase = await createClient();
    const { data: companyDetails } = await supabase
        .from('company_details')
        .select('*')
        .limit(1)
        .single();

    return (
        <div className="min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 tracking-tight">
                    Company Details
                </h1>
                <p className="text-gray-600 font-light">Manage your company information displayed on the website</p>
            </div>
            <CompanyDetailsForm companyDetails={companyDetails} />
        </div>
    );
}

