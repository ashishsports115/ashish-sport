'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

interface HeaderProps {
    companyName?: string;
    logoUrl?: string | null;
}

export function Header({ companyName = 'AshishSport', logoUrl }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setIsLoading(false);
        };

        checkUser();

        // Listen for auth changes
        const supabase = createClient();
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        router.push('/');
        router.refresh();
    };

    const isAdminPage = pathname?.startsWith('/admin');
    const isLoginPage = pathname === '/admin/login';

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link
                        href={user && isAdminPage ? "/admin" : "/"}
                        className="flex items-center gap-3 hover:opacity-70 transition-opacity"
                    >
                        {logoUrl ? (
                            <>
                                <div className="relative w-10 h-10 md:w-12 md:h-12">
                                    <Image
                                        src={logoUrl}
                                        alt={companyName}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 40px, 48px"
                                    />
                                </div>
                                <span className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                    {companyName}
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl md:text-3xl font-black text-black tracking-tight">
                                {companyName}
                            </span>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    {!isLoading && (
                        <nav className="hidden md:flex items-center gap-8">
                            {user && isAdminPage ? (
                                <>
                                    <Link
                                        href="/admin"
                                        className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider"
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href="/admin/outfits"
                                        className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider"
                                    >
                                        Outfits
                                    </Link>
                                    <Link
                                        href="/admin/contacts"
                                        className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider"
                                    >
                                        Contacts
                                    </Link>
                                    <Link
                                        href="/admin/company"
                                        className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider"
                                    >
                                        Company
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/"
                                        className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider"
                                    >
                                        Home
                                    </Link>
                                    <Link
                                        href="/contact"
                                        className="text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider"
                                    >
                                        Contact
                                    </Link>
                                    {user && !isLoginPage && (
                                        <Link
                                            href="/admin"
                                            className="text-sm font-medium text-gray-600 hover:text-black transition-colors uppercase tracking-wider"
                                        >
                                            Admin
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    )}

                    {/* Logout Button (Admin only) */}
                    {user && isAdminPage && !isLoginPage && (
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="hidden md:block bg-black text-white px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50"
                        >
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </button>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-900"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && !isLoading && (
                    <nav className="md:hidden pb-4 space-y-3">
                        {user && isAdminPage ? (
                            <>
                                <Link
                                    href="/admin"
                                    className="block text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/admin/outfits"
                                    className="block text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Outfits
                                </Link>
                                <Link
                                    href="/admin/contacts"
                                    className="block text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contacts
                                </Link>
                                <Link
                                    href="/admin/company"
                                    className="block text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Company
                                </Link>
                                {!isLoginPage && (
                                    <button
                                        onClick={() => {
                                            setIsMenuOpen(false);
                                            handleLogout();
                                        }}
                                        disabled={isLoggingOut}
                                        className="block w-full text-left text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2 disabled:opacity-50"
                                    >
                                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                                    </button>
                                )}
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/"
                                    className="block text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/contact"
                                    className="block text-sm font-medium text-gray-900 hover:text-black transition-colors uppercase tracking-wider py-2"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                                {user && !isLoginPage && (
                                    <Link
                                        href="/admin"
                                        className="block text-sm font-medium text-gray-600 hover:text-black transition-colors uppercase tracking-wider py-2"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Admin
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                )}
            </div>
        </header>
    );
}

