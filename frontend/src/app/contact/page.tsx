'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { settingsAPI } from '@/lib/api';
import { Settings } from '@/types';
import { FiPhone, FiMail, FiMapPin, FiClock, FiMessageCircle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

export default function ContactPage() {
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await settingsAPI.getPublic();
                setSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            }
        };
        fetchSettings();
    }, []);

    const handleWhatsAppClick = () => {
        const whatsappNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '917904159007';
        const message = encodeURIComponent('Hi! I would like to know more about your products.');
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative bg-gradient-to-br from-green-900 via-teal-900 to-blue-900 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-20 w-72 h-72 bg-green-500/30 rounded-full blur-3xl animate-pulse" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>

                    <div className="container relative z-10 mx-auto px-4 py-24 md:py-32">
                        <div className="max-w-3xl mx-auto text-center">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
                                Get In Touch
                            </h1>
                            <p className="text-xl text-gray-300 mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                                We'd love to hear from you! Reach out to us through any of the channels below
                            </p>
                        </div>
                    </div>
                </section>

                {/* Contact Information */}
                <section className="section bg-white dark:bg-gray-900">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {/* WhatsApp - Primary Contact */}
                            <Card hover className="p-6 border-2 border-green-500 dark:border-green-600">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FaWhatsapp className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold mb-2">WhatsApp (Preferred)</h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-3">
                                            {settings?.whatsappNumber || '+91 79041 59007'}
                                        </p>
                                        <Button
                                            onClick={handleWhatsAppClick}
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <FaWhatsapp className="w-4 h-4 mr-2" />
                                            Chat Now
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            {/* Phone */}
                            <Card hover className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiPhone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Phone</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {settings?.contactPhone || '+91 79041 59007'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            Mon-Sat, 9 AM - 6 PM
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Email */}
                            <Card hover className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiMail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Email</h3>
                                        <p className="text-gray-600 dark:text-gray-400 break-all">
                                            {settings?.contactEmail || 'contact@myshop.com'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            We'll respond within 24 hours
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Additional Info */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Location */}
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiMapPin className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Location</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {settings?.businessAddress || 'Your Local Area'}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                                            Serving the local community
                                        </p>
                                    </div>
                                </div>
                            </Card>

                            {/* Business Hours */}
                            <Card className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FiClock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Business Hours</h3>
                                        <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                            <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                                            <p>Saturday: 10:00 AM - 4:00 PM</p>
                                            <p>Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <FiMessageCircle className="w-16 h-16 mx-auto mb-6" />
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to Order?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                            Contact us on WhatsApp for quick responses and personalized service
                        </p>
                        <Button
                            onClick={handleWhatsAppClick}
                            size="lg"
                            className="bg-white text-blue-600 hover:bg-gray-100"
                        >
                            <FaWhatsapp className="w-5 h-5 mr-2" />
                            Start Chat on WhatsApp
                        </Button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
