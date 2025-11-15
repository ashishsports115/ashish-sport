import { createClient } from '@/lib/supabase/server';
import type { CompanyDetails } from '@/types';

/**
 * Get company details from database
 * Returns null if no company details exist
 */
export async function getCompanyDetails(): Promise<CompanyDetails | null> {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('company_details')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            // If no record exists, return null
            if (error.code === 'PGRST116') {
                return null;
            }
            console.error('Error fetching company details:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getCompanyDetails:', error);
        return null;
    }
}

