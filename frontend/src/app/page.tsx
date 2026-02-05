'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { ProductCardSkeleton } from '@/components/ui/Loader';
import { productsAPI, settingsAPI } from '@/lib/api';
import { Product, Settings } from '@/types';
import { FiShield, FiTruck, FiHeart } from 'react-icons/fi';

export default function HomePage() {
    const [settings, setSettings] = useState<Settings | null>(null);
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, productsRes] = await Promise.all([
                    settingsAPI.getPublic(),
                    productsAPI.getAll({ featured: 'true', limit: 8 }),
                ]);
                setSettings(settingsRes.data);
                setFeaturedProducts(productsRes.data.products);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
                        <div className="max-w-3xl mx-auto text-center">
                            <p className="text-blue-300 font-medium mb-4 animate-fade-in">
                                PREMIUM QUALITY PRODUCTS
                            </p>
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
                                {settings?.heroTitle || 'Your Memories, Beautifully Printed.'}
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                {settings?.heroSubtitle || 'Transform your digital photos into stunning physical keepsakes. From retro polaroids to custom stickers, we bring your moments to life.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                <Link href="/shop">
                                    <Button size="lg" className="w-full sm:w-auto">
                                        Start Shopping →
                                    </Button>
                                </Link>
                                <Link href="/shop">
                                    <Button variant="outline" size="lg" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                                        Explore Catalog
                                    </Button>
                                </Link>
                            </div>

                            {/* Trust Badges */}
                            <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FiShield className="w-5 h-5 text-green-400" />
                                    </div>
                                    <span>Secure Checkout</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FiTruck className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <span>Fast Delivery</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <FiHeart className="w-5 h-5 text-pink-400" />
                                    </div>
                                    <span>Local Business</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="section bg-gray-50 dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Products</h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Discover our most loved items
                                </p>
                            </div>
                            <Link href="/shop">
                                <Button variant="outline">View All</Button>
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {featuredProducts.map((product) => (
                                    <ProductCard key={product._id} product={product} settings={settings} />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Categories */}
                <section className="section">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Shop by Category</h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Find exactly what you're looking for
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {['Jewelry', 'Gifts', 'Prints', 'Custom Items'].map((category) => (
                                <Link key={category} href={`/shop?category=${category.toLowerCase()}`}>
                                    <Card hover className="p-8 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                            {category[0]}
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{category}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Explore our collection
                                        </p>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function ProductCard({ product, settings }: { product: Product; settings: Settings | null }) {
    const imageUrl = product.images[0]
        ? `http://localhost:5000${product.images[0]}`
        : '/placeholder-product.jpg';

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
