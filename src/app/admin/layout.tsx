import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { requireAuth } from '@/lib/auth';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const headersList = await headers();
    const pathname = headersList.get('x-pathname') || '';

    // Skip auth check for login page to prevent redirect loop
    const isLoginPage = pathname === '/admin/login';

    if (!isLoginPage) {
        // Require authentication - will redirect to login if not authenticated
        await requireAuth();

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="container mx-auto px-4 py-8">{children}</div>
            </div>
        );
    }

    // For login page, render without auth check
    return (
        <div className="min-h-screen bg-gray-50">
            {children}
        </div>
    );
}

