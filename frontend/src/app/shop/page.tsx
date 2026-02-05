'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProductCardSkeleton } from '@/components/ui/Loader';
import { productsAPI, categoriesAPI, settingsAPI } from '@/lib/api';
import { Product, Category, Settings } from '@/types';

export default function ShopPage() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState<string>('');

    useEffect(() => {
        const category = searchParams.get('category');
        if (category) {
            setSelectedCategory(category);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [productsRes, categoriesRes, settingsRes] = await Promise.all([
                    productsAPI.getAll({ category: selectedCategory || undefined }),
                    categoriesAPI.getAll(),
                    settingsAPI.getPublic(),
                ]);
                setProducts(productsRes.data.products);
                setCategories(categoriesRes.data);
                setSettings(settingsRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [selectedCategory]);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 section">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Shop All Products</h1>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3 mb-8">
                        <Button
                            variant={selectedCategory === '' ? 'primary' : 'outline'}
                            onClick={() => setSelectedCategory('')}
                        >
                            All Products
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category._id}
                                variant={selectedCategory === category.slug ? 'primary' : 'outline'}
                                onClick={() => setSelectedCategory(category.slug)}
                            >
                                {category.name}
                            </Button>
                        ))}
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                No products found in this category.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} settings={settings} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

function ProductCard({ product, settings }: { product: Product; settings: Settings | null }) {
    const imageUrl = product.images[0]
        ? `http://localhost:5000${product.images[0]}`
        : 'https://via.placeholder.com/400x400?text=No+Image';

    return (
        <Link href={`/product/${product._id}`}>
            <Card hover className="overflow-hidden h-full">
                <div className="aspect-square bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=No+Image';
                        }}
                    />
                    {product.stock <= 5 && product.stock > 0 && (
                        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Low Stock
                        </div>
                    )}
                    {product.stock === 0 && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            Out of Stock
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                            {settings?.currencySymbol || '$'}{product.price.toFixed(2)}
                        </span>
                        <Button size="sm">View Details</Button>
                    </div>
                </div>
            </Card>
        </Link>
    );
}
