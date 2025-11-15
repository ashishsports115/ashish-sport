'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import type { Outfit } from '@/types';

interface OutfitFormProps {
    outfit?: Outfit;
}

export function OutfitForm({ outfit }: OutfitFormProps) {
    const router = useRouter();
    const isEditing = !!outfit;

    const [formData, setFormData] = useState({
        title: outfit?.title || '',
        category: outfit?.category || '',
        price: outfit?.price?.toString() || '',
        description: outfit?.description || '',
    });
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>(
        outfit?.image_urls && outfit.image_urls.length > 0
            ? outfit.image_urls
            : outfit?.image_url
                ? [outfit.image_url]
                : []
    );
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            // Add new files to existing ones
            setImageFiles(prev => [...prev, ...files]);
            const newUrls = files.map(file => URL.createObjectURL(file));
            setPreviewUrls(prev => [...prev, ...newUrls]);
        }
        // Reset input to allow selecting the same files again
        e.target.value = '';
    };

    const removePreview = (index: number) => {
        const urlToRemove = previewUrls[index];
        const isNewFile = urlToRemove.startsWith('blob:'); // New files have blob URLs

        // Remove from preview URLs
        const newUrls = previewUrls.filter((_, i) => i !== index);
        setPreviewUrls(newUrls);

        // Only remove from imageFiles if it's a new file (not an existing image)
        if (isNewFile) {
            // Find the corresponding file index
            const fileIndex = imageFiles.findIndex((_, i) => {
                // Count how many blob URLs come before this index
                let blobCount = 0;
                for (let j = 0; j < index; j++) {
                    if (previewUrls[j].startsWith('blob:')) blobCount++;
                }
                return i === blobCount;
            });

            if (fileIndex !== -1) {
                const newFiles = imageFiles.filter((_, i) => i !== fileIndex);
                setImageFiles(newFiles);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            try {
                if (isEditing && outfit) {
                    // Update existing outfit
                    const updateData: any = {
                        title: formData.title,
                        category: formData.category,
                        price: formData.price ? parseFloat(formData.price) : null,
                        description: formData.description || null,
                    };

                    // Separate existing URLs from new file previews
                    const existingUrls = previewUrls.filter(url => !url.startsWith('blob:'));

                    // If new images are uploaded, upload them first
                    if (imageFiles.length > 0) {
                        const formDataUpload = new FormData();
                        imageFiles.forEach((file) => {
                            formDataUpload.append('files', file);
                        });

                        const uploadResponse = await fetch('/api/outfits/upload-files', {
                            method: 'POST',
                            body: formDataUpload,
                        });

                        if (!uploadResponse.ok) {
                            throw new Error('Failed to upload images');
                        }

                        const { image_urls: newImageUrls } = await uploadResponse.json();
                        // Combine existing URLs with newly uploaded ones
                        const allImageUrls = [...existingUrls, ...newImageUrls];
                        updateData.image_urls = allImageUrls;
                        updateData.image_url = allImageUrls[0]; // Keep first image for backward compatibility
                    } else if (previewUrls.length > 0) {
                        // Keep existing images (only non-blob URLs)
                        updateData.image_urls = existingUrls;
                        updateData.image_url = existingUrls[0] || previewUrls[0];
                    }

                    const response = await fetch(`/api/outfits/${outfit.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(updateData),
                    });

                    if (!response.ok) {
                        throw new Error('Failed to update outfit');
                    }
                } else {
                    // Create new outfit
                    if (imageFiles.length === 0) {
                        setError('Please select at least one image');
                        return;
                    }

                    const formDataUpload = new FormData();
                    imageFiles.forEach((file) => {
                        formDataUpload.append('files', file);
                    });
                    formDataUpload.append('title', formData.title);
                    formDataUpload.append('category', formData.category);
                    formDataUpload.append('price', formData.price || '');
                    formDataUpload.append('description', formData.description || '');

                    const response = await fetch('/api/outfits/upload-multiple', {
                        method: 'POST',
                        body: formDataUpload,
                    });

                    if (!response.ok) {
                        const data = await response.json();
                        throw new Error(data.error || 'Failed to create outfit');
                    }
                }

                router.push('/admin/outfits');
                router.refresh();
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
            <div>
                <label htmlFor="title" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Title *
                </label>
                <input
                    type="text"
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                />
            </div>

            <div>
                <label htmlFor="category" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Category *
                </label>
                <input
                    type="text"
                    id="category"
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                    placeholder="e.g., Running, Basketball, Football"
                />
            </div>

            <div>
                <label htmlFor="price" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Price (optional)
                </label>
                <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light"
                    placeholder="0.00"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Description (optional)
                </label>
                <textarea
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors font-light resize-none"
                    placeholder="Describe the outfit, its features, materials, and benefits..."
                />
                <p className="text-xs text-gray-500 mt-2 font-light">Provide detailed information about this outfit</p>
            </div>

            <div>
                <label htmlFor="images" className="block text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    Images {!isEditing && '*'}
                </label>
                <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    required={!isEditing && previewUrls.length === 0}
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 bg-white text-black focus:outline-none focus:border-black transition-colors"
                />
                <p className="text-xs text-gray-500 mt-2 font-light">You can select multiple images</p>

                {previewUrls.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative aspect-square bg-gray-100 overflow-hidden group">
                                <Image
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                <button
                                    type="button"
                                    onClick={() => removePreview(index)}
                                    className="absolute top-2 right-2 bg-black/70 hover:bg-black text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove image"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="bg-black text-white px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Saving...' : isEditing ? 'Update Outfit' : 'Create Outfit'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="bg-white border-2 border-black text-black px-8 py-4 font-bold text-sm uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

