import React from 'react';

export function Loader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizes[size]} border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 rounded-full animate-spin`}
            />
        </div>
    );
}

export function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" />
        </div>
    );
}

export function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div className={`skeleton rounded ${className}`} />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <Skeleton className="w-full h-64" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
            </div>
        </div>
    );
}
