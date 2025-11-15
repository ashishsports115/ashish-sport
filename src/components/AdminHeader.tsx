'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export function AdminHeader() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <div className="flex items-center gap-8 md:gap-12">
                        <Link href="/admin" className="text-xl md:text-2xl font-black text-black tracking-tight hover:opacity-70 transition-opacity">
                            Admin
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link href="/admin" className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider">
                                Dashboard
                            </Link>
                            <Link href="/admin/outfits" className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider">
                                Outfits
                            </Link>
                            <Link href="/admin/contacts" className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider">
                                Contacts
                            </Link>
                            <Link href="/admin/company" className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider">
                                Company
                            </Link>
                        </nav>
                    </div>
                    <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="bg-black text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
                    >
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </div>
        </header>
    );
}

