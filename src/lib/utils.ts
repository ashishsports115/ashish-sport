import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatPrice(price: number | null): string {
    if (price === null) return 'Price on request';
    return `$${price.toFixed(2)}`;
}

