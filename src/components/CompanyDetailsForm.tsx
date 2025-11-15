'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { CompanyDetails } from '@/types';

interface CompanyDetailsFormProps {
    companyDetails: CompanyDetails | null;
}

export function CompanyDetailsForm({ companyDetails }: CompanyDetailsFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        company_name: companyDetails?.company_name || 'AshishSport',
        email: companyDetails?.email || '',
        phone: companyDetails?.phone || '',
        mobile: companyDetails?.mobile || '',
        address: companyDetails?.address || '',
        city: companyDetails?.city || '',
        state: companyDetails?.state || '',
        zip_code: companyDetails?.zip_code || '',
        country: companyDetails?.country || 'USA',
        website: companyDetails?.website || '',
        description: companyDetails?.description || '',
        logo_url: companyDetails?.logo_url || '',
        social_facebook: companyDetails?.social_facebook || '',
        social_instagram: companyDetails?.social_instagram || '',
        social_twitter: companyDetails?.social_twitter || '',
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(companyDetails?.logo_url || null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setLogoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUpload = async () => {
        if (!logoFile) return;

        setIsUploadingLogo(true);
        setError(null);

        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', logoFile);

            const response = await fetch('/api/company/logo', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to upload logo');
            }

            const { logo_url } = await response.json();
            setFormData({ ...formData, logo_url });
            setLogoFile(null);
            setSuccess(true);
            router.refresh();

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        startTransition(async () => {
            try {
                const response = await fetch('/api/company', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.error || 'Failed to update company details');
                }

                setSuccess(true);
                router.refresh();

                setTimeout(() => {
                    setSuccess(false);
                }, 3000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-8">
            {/* Company Logo */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Company Logo</h2>
                <div className="space-y-4">
                    {logoPreview && (
                        <div className="relative w-32 h-32 bg-gray-100 overflow-hidden border border-gray-300">
                            <Image
                                src={logoPreview}
                                alt="Company Logo"
                                fill
                                className="object-contain"
                                sizes="128px"
                            />
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-1">
                            <label htmlFor="logo" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                                Upload Logo
                            </label>
                            <input
                                type="file"
                                id="logo"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                            />
                            <p className="text-xs text-gray-500 mt-2 font-light">Recommended: Square image, max 5MB</p>
                        </div>
                        {logoFile && (
                            <button
                                type="button"
                                onClick={handleLogoUpload}
                                disabled={isUploadingLogo}
                                className="bg-black text-white px-6 py-3 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                                {isUploadingLogo ? 'Uploading...' : 'Upload Logo'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Company Information */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="company_name" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Company Name *
                        </label>
                        <input
                            type="text"
                            id="company_name"
                            required
                            value={formData.company_name}
                            onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Phone
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="mobile" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Mobile
                        </label>
                        <input
                            type="tel"
                            id="mobile"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="website" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Website
                        </label>
                        <input
                            type="url"
                            id="website"
                            value={formData.website}
                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                            placeholder="https://example.com"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light resize-none"
                        />
                    </div>
                </div>
            </div>

            {/* Address Information */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="address" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Street Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="state" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="zip_code" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Zip Code
                        </label>
                        <input
                            type="text"
                            id="zip_code"
                            value={formData.zip_code}
                            onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>

                    <div>
                        <label htmlFor="country" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            value={formData.country}
                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                        />
                    </div>
                </div>
            </div>

            {/* Social Media */}
            <div className="bg-white border border-gray-200 p-6 md:p-8">
                <h2 className="text-xl font-bold text-black mb-6 uppercase tracking-wider">Social Media</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label htmlFor="social_facebook" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Facebook URL
                        </label>
                        <input
                            type="url"
                            id="social_facebook"
                            value={formData.social_facebook}
                            onChange={(e) => setFormData({ ...formData, social_facebook: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                            placeholder="https://facebook.com/..."
                        />
                    </div>

                    <div>
                        <label htmlFor="social_instagram" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Instagram URL
                        </label>
                        <input
                            type="url"
                            id="social_instagram"
                            value={formData.social_instagram}
                            onChange={(e) => setFormData({ ...formData, social_instagram: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                            placeholder="https://instagram.com/..."
                        />
                    </div>

                    <div>
                        <label htmlFor="social_twitter" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                            Twitter URL
                        </label>
                        <input
                            type="url"
                            id="social_twitter"
                            value={formData.social_twitter}
                            onChange={(e) => setFormData({ ...formData, social_twitter: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                            placeholder="https://twitter.com/..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                    <p className="text-sm font-medium">Company details updated successfully!</p>
                </div>
            )}

            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Saving...' : 'Save Company Details'}
                </button>
            </div>
        </form>
    );
}

