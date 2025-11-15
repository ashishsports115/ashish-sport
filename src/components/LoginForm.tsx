'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                const supabase = createClient();
                const { data, error: signInError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (signInError) {
                    setError(signInError.message);
                    return;
                }

                if (data.user) {
                    // Redirect to the original page or admin dashboard
                    const redirectTo = searchParams.get('redirect') || '/admin';
                    router.push(redirectTo);
                    router.refresh();
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Email
                </label>
                <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isPending ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}

