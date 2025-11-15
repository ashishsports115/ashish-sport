'use client';

import { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ContactFormProps {
    searchParams: Promise<{ outfit_id?: string; outfit_title?: string }>;
}

export function ContactForm({ searchParams }: ContactFormProps) {
    const router = useRouter();
    const [outfitId, setOutfitId] = useState('');
    const [outfitTitle, setOutfitTitle] = useState('');

    useEffect(() => {
        searchParams.then((params) => {
            const id = params.outfit_id || '';
            const title = params.outfit_title || '';
            setOutfitId(id);
            setOutfitTitle(title);
            setFormData((prev) => ({ ...prev, outfit_id: id }));
        });
    }, [searchParams]);

    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        message: '',
        outfit_id: '',
    });
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        startTransition(async () => {
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to send message');
                }

                setSuccess(true);
                setFormData({
                    name: '',
                    mobile: '',
                    message: '',
                    outfit_id: '',
                });

                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {outfitTitle && (
                <div className="bg-gray-50 border border-gray-200 p-4">
                    <p className="text-sm text-gray-700 font-medium">
                        <span className="text-xs uppercase tracking-wider text-gray-500">Inquiring about:</span>
                        <span className="block mt-1 text-black">{outfitTitle}</span>
                    </p>
                </div>
            )}

            <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Name *
                </label>
                <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                />
            </div>

            <div>
                <label htmlFor="mobile" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Mobile *
                </label>
                <input
                    type="tel"
                    id="mobile"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                />
            </div>

            <div>
                <label htmlFor="message" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Message *
                </label>
                <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light resize-none"
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                    <p className="text-sm font-medium">Thank you for your message! We'll get back to you soon. Redirecting...</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}

