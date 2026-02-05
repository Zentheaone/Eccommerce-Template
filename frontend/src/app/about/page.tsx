'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import { FiHeart, FiTarget, FiAward, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
                                About Our Store
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                Your trusted local business for quality products and exceptional service
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Story */}
                <section className="section bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Our Story</h2>
                            <div className="prose dark:prose-invert max-w-none">
                                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                                    Welcome to our local shop! We're passionate about bringing you the finest products
                                    that add value to your life. From beautiful jewelry to custom prints and unique gifts,
                                    every item in our collection is carefully selected with you in mind.
                                </p>
                                <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                                    What started as a small local business has grown into a trusted name in the community.
                                    We pride ourselves on quality, authenticity, and personalized service that makes every
                                    customer feel special.
                                </p>
                                <p className="text-lg text-gray-700 dark:text-gray-300">
                                    Whether you're looking for a special gift, a personal keepsake, or something unique
                                    to brighten your day, we're here to help you find exactly what you need.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="section bg-gray-50 dark:bg-gray-800">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card hover className="p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                                    <FiHeart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Quality First</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We never compromise on the quality of our products and services
                                </p>
                            </Card>

                            <Card hover className="p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                                    <FiTarget className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Customer Focus</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Your satisfaction is our top priority in everything we do
                                </p>
                            </Card>

                            <Card hover className="p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
                                    <FiAward className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    We strive for excellence in every aspect of our business
                                </p>
                            </Card>

                            <Card hover className="p-6 text-center">
                                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                    <FiUsers className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Community</h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Supporting our local community is at the heart of what we do
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section className="section bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Why Choose Us?</h2>
                            <div className="grid md:grid-cols-2 gap-8">
                                <Card className="p-6">
                                    <h3 className="text-xl font-semibold mb-3">🎨 Unique Products</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Carefully curated collection of unique items you won't find anywhere else
                                    </p>
                                </Card>
                                <Card className="p-6">
                                    <h3 className="text-xl font-semibold mb-3">🚚 Fast Delivery</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Quick and reliable delivery to get your products to you as soon as possible
                                    </p>
                                </Card>
                                <Card className="p-6">
                                    <h3 className="text-xl font-semibold mb-3">💎 Premium Quality</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Every product meets our high standards for quality and craftsmanship
                                    </p>
                                </Card>
                                <Card className="p-6">
                                    <h3 className="text-xl font-semibold mb-3">🤝 Personal Service</h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Personalized attention and support for every customer
                                    </p>
                                </Card>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
