'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

interface HeaderProps {
    companyName?: string;
    logoUrl?: string | null;
}

export function Header({ companyName = 'AshishSport', logoUrl }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">
                    <Link
                        href="/"
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
                    <nav className="hidden md:flex items-center gap-8">
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
                    </nav>

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
                {isMenuOpen && (
                    <nav className="md:hidden pb-4 space-y-3">
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
                    </nav>
                )}
            </div>
        </header>
    );
}

