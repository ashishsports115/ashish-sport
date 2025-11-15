import { createClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth';
import Link from 'next/link';

export default async function AdminDashboard() {
    // Ensure user is authenticated
    await requireAuth();

    const supabase = await createClient();

    const { count: outfitsCount } = await supabase
        .from('outfits')
        .select('*', { count: 'exact', head: true });

    const { count: contactsCount } = await supabase
        .from('contacts')
        .select('*', { count: 'exact', head: true });

    return (
        <div className="min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 tracking-tight">
                    Dashboard
                </h1>
                <p className="text-gray-600 font-light">Overview of your store</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
                <Link href="/admin/outfits" className="group">
                    <div className="bg-white border border-gray-200 p-8 hover:border-black transition-colors">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-medium">Total Outfits</p>
                        <p className="text-5xl md:text-6xl font-black text-black mb-4">{outfitsCount || 0}</p>
                        <span className="text-sm font-bold text-black uppercase tracking-wider group-hover:opacity-70 transition-opacity">
                            Manage Outfits →
                        </span>
                    </div>
                </Link>

                <Link href="/admin/contacts" className="group">
                    <div className="bg-white border border-gray-200 p-8 hover:border-black transition-colors">
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-medium">Contact Requests</p>
                        <p className="text-5xl md:text-6xl font-black text-black mb-4">{contactsCount || 0}</p>
                        <span className="text-sm font-bold text-black uppercase tracking-wider group-hover:opacity-70 transition-opacity">
                            View Contacts →
                        </span>
                    </div>
                </Link>
            </div>

            <div className="bg-white border border-gray-200 p-8 mb-8">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Quick Actions</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/admin/outfits/new"
                        className="bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors text-center"
                    >
                        Add New Outfit
                    </Link>
                    <Link
                        href="/admin/outfits"
                        className="bg-white border-2 border-black text-black px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors text-center"
                    >
                        View All Outfits
                    </Link>
                </div>
            </div>

            <div className="bg-white border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Settings</h2>
                <Link
                    href="/admin/company"
                    className="inline-block bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors"
                >
                    Manage Company Details
                </Link>
            </div>
        </div>
    );
}

