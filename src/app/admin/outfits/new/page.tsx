import { requireAuth } from '@/lib/auth';
import { OutfitForm } from '@/components/OutfitForm';

export default async function NewOutfitPage() {
    // Ensure user is authenticated
    await requireAuth();
    return (
        <div className="min-h-screen">
            <div className="mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-black mb-2 tracking-tight">
                    Add New Outfit
                </h1>
                <p className="text-gray-600 font-light">Create a new sport outfit for your collection</p>
            </div>
            <OutfitForm />
        </div>
    );
}

