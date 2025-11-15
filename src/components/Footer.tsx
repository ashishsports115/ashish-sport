import { getCompanyDetails } from '@/lib/company';
import Image from 'next/image';

export async function Footer() {
    const company = await getCompanyDetails();

    const companyName = company?.company_name || 'AshishSport';
    const description = company?.description || 'Premium sport outfits and athletic wear. Built for athletes, designed for performance.';
    const email = company?.email;
    const phone = company?.phone || company?.mobile;
    const address = company?.address;
    const city = company?.city;
    const state = company?.state;
    const zipCode = company?.zip_code;
    const country = company?.country;
    const website = company?.website;
    const logoUrl = company?.logo_url;
    const socialFacebook = company?.social_facebook;
    const socialInstagram = company?.social_instagram;
    const socialTwitter = company?.social_twitter;

    const fullAddress = [address, city, state, zipCode, country].filter(Boolean).join(', ');

    return (
        <footer className="bg-black text-white mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    <div className="col-span-1 md:col-span-2 lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            {logoUrl && (
                                <div className="relative w-12 h-12 md:w-16 md:h-16">
                                    <Image
                                        src={logoUrl}
                                        alt={companyName}
                                        fill
                                        className="object-contain"
                                        sizes="(max-width: 768px) 48px, 64px"
                                    />
                                </div>
                            )}
                            <h3 className="text-2xl md:text-3xl font-black tracking-tight">{companyName}</h3>
                        </div>
                        <p className="text-gray-400 text-sm font-light max-w-md mb-4">
                            {description}
                        </p>
                        {fullAddress && (
                            <p className="text-gray-400 text-sm font-light mb-2">
                                {fullAddress}
                            </p>
                        )}
                        <div className="flex flex-col gap-1 mt-4">
                            {email && (
                                <a href={`mailto:${email}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                                    {email}
                                </a>
                            )}
                            {phone && (
                                <a href={`tel:${phone}`} className="text-gray-400 hover:text-white text-sm transition-colors">
                                    {phone}
                                </a>
                            )}
                            {website && (
                                <a href={website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    {website}
                                </a>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider mb-4">Follow Us</h4>
                        <ul className="space-y-2">
                            {socialFacebook && (
                                <li>
                                    <a href={socialFacebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                                        Facebook
                                    </a>
                                </li>
                            )}
                            {socialInstagram && (
                                <li>
                                    <a href={socialInstagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                                        Instagram
                                    </a>
                                </li>
                            )}
                            {socialTwitter && (
                                <li>
                                    <a href={socialTwitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors">
                                        Twitter
                                    </a>
                                </li>
                            )}
                            {!socialFacebook && !socialInstagram && !socialTwitter && (
                                <li className="text-gray-500 text-sm">No social links</li>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8">
                    <p className="text-gray-500 text-xs text-center uppercase tracking-wider">
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

