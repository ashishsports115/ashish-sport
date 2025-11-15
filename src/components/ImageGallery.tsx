'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
    images: string[];
    alt: string;
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

    // Reset zoom when image changes
    useEffect(() => {
        setZoomLevel(1);
        setZoomPosition({ x: 50, y: 50 });
    }, [selectedIndex]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!isFullscreen) return;

        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsFullscreen(false);
                setZoomLevel(1);
            } else if (e.key === 'ArrowLeft' && selectedIndex > 0) {
                setSelectedIndex(selectedIndex - 1);
            } else if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) {
                setSelectedIndex(selectedIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isFullscreen, selectedIndex, images.length]);

    const handleImageClick = () => {
        setIsFullscreen(true);
    };

    const handleZoom = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomLevel === 1) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y });
            setZoomLevel(2);
        } else {
            setZoomLevel(1);
        }
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        const newZoom = Math.max(1, Math.min(3, zoomLevel + delta));
        setZoomLevel(newZoom);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (zoomLevel > 1) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setZoomPosition({ x, y });
        }
    };

    if (images.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                {/* Main Image with Zoom */}
                <div
                    className="relative w-full aspect-square lg:aspect-auto lg:h-[600px] bg-gray-100 overflow-hidden cursor-zoom-in group"
                    onClick={handleImageClick}
                    onWheel={handleWheel}
                >
                    <div
                        className="relative w-full h-full transition-transform duration-300"
                        style={{
                            transform: `scale(${zoomLevel})`,
                            transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        }}
                        onMouseMove={handleMouseMove}
                    >
                        <Image
                            src={images[selectedIndex]}
                            alt={`${alt} - Image ${selectedIndex + 1}`}
                            fill
                            className="object-cover"
                            priority={selectedIndex === 0}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                    </div>

                    {/* Zoom indicator */}
                    {zoomLevel > 1 && (
                        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded text-xs font-medium">
                            {Math.round(zoomLevel * 100)}%
                        </div>
                    )}

                    {/* Click to zoom hint */}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1.5 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to view fullscreen
                    </div>
                </div>

                {/* Thumbnail Gallery */}
                {images.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
                        {images.map((image, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setSelectedIndex(index)}
                                className={`relative aspect-square bg-gray-100 overflow-hidden border-2 transition-all ${selectedIndex === index
                                    ? 'border-black'
                                    : 'border-transparent hover:border-gray-400'
                                    }`}
                            >
                                <Image
                                    src={image}
                                    alt={`${alt} - Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 25vw, 20vw"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Modal */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => {
                        setIsFullscreen(false);
                        setZoomLevel(1);
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={() => {
                            setIsFullscreen(false);
                            setZoomLevel(1);
                        }}
                        className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Navigation Arrows */}
                    {images.length > 1 && (
                        <>
                            {selectedIndex > 0 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(selectedIndex - 1);
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                            )}
                            {selectedIndex < images.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedIndex(selectedIndex + 1);
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            )}
                        </>
                    )}

                    {/* Fullscreen Image with Zoom */}
                    <div
                        className="relative w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                        onWheel={handleWheel}
                    >
                        <div
                            className="relative max-w-full max-h-full transition-transform duration-300 cursor-zoom-in"
                            style={{
                                transform: `scale(${zoomLevel})`,
                                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                            }}
                            onMouseMove={handleMouseMove}
                            onClick={handleZoom}
                        >
                            <Image
                                src={images[selectedIndex]}
                                alt={`${alt} - Image ${selectedIndex + 1}`}
                                width={1200}
                                height={1200}
                                className="object-contain max-w-full max-h-[90vh]"
                                priority
                                sizes="100vw"
                            />
                        </div>
                    </div>

                    {/* Zoom Controls */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setZoomLevel(Math.max(1, zoomLevel - 0.25));
                            }}
                            className="text-white hover:text-gray-300 transition-colors"
                            aria-label="Zoom out"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                            </svg>
                        </button>
                        <span className="text-white text-sm font-medium min-w-[60px] text-center">
                            {Math.round(zoomLevel * 100)}%
                        </span>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setZoomLevel(Math.min(3, zoomLevel + 0.25));
                            }}
                            className="text-white hover:text-gray-300 transition-colors"
                            aria-label="Zoom in"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                            </svg>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setZoomLevel(1);
                            }}
                            className="text-white hover:text-gray-300 transition-colors ml-2"
                            aria-label="Reset zoom"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>

                    {/* Image Counter */}
                    {images.length > 1 && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                            {selectedIndex + 1} / {images.length}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
