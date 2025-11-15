import { getCompanyDetails } from '@/lib/company';
import { Header } from '@/components/Header';

export async function HeaderWrapper() {
    const company = await getCompanyDetails();
    const companyName = company?.company_name || 'AshishSport';
    const logoUrl = company?.logo_url || null;

    return <Header companyName={companyName} logoUrl={logoUrl} />;
}

