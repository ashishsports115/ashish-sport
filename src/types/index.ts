export interface Outfit {
    id: string;
    title: string;
    category: string;
    price: number | null;
    description: string | null;
    image_url: string; // Keep for backward compatibility
    image_urls?: string[]; // Array of image URLs
    created_at: string;
}

export interface Contact {
    id: string;
    name: string;
    mobile: string;
    message: string;
    outfit_id: string | null;
    created_at: string;
}

export interface OutfitFormData {
    title: string;
    category: string;
    price: number | null;
    image: File | null;
}

export interface ContactFormData {
    name: string;
    mobile: string;
    message: string;
    outfit_id?: string;
}

export interface CompanyDetails {
    id: string;
    company_name: string;
    email: string;
    phone: string;
    mobile: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    website: string | null;
    description: string | null;
    logo_url: string | null;
    social_facebook: string | null;
    social_instagram: string | null;
    social_twitter: string | null;
    updated_at: string;
}

