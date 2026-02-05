'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { settingsAPI } from '@/lib/api';
import { Settings } from '@/types';

export default function Footer() {
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

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">
                            {settings?.storeName || 'MyShop'}
                        </h3>
                        <p className="text-sm mb-4">
                            {settings?.storeDescription || 'Your trusted local business for quality products'}
                        </p>
                        <div className="flex space-x-4">
                            {settings?.socialLinks?.facebook && (
                                <a
                                    href={settings.socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    <FiFacebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.socialLinks?.instagram && (
                                <a
                                    href={settings.socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-pink-400 transition-colors"
                                >
                                    <FiInstagram className="w-5 h-5" />
                                </a>
                            )}
                            {settings?.socialLinks?.twitter && (
                                <a
                                    href={settings.socialLinks.twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-blue-300 transition-colors"
                                >
                                    <FiTwitter className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shop" className="hover:text-white transition-colors">
                                    Shop
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin/login" className="hover:text-white transition-colors">
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Categories</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/shop?category=jewelry" className="hover:text-white transition-colors">
                                    Jewelry
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=gifts" className="hover:text-white transition-colors">
                                    Gifts
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=prints" className="hover:text-white transition-colors">
                                    Prints
                                </Link>
                            </li>
                            <li>
                                <Link href="/shop?category=custom" className="hover:text-white transition-colors">
                                    Custom Items
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center space-x-2">
                                <FiPhone className="w-4 h-4" />
                                <span>{settings?.whatsappNumber || '+1234567890'}</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <FiMail className="w-4 h-4" />
                                <span>info@myshop.com</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <FiMapPin className="w-4 h-4 mt-1" />
                                <span>123 Main Street<br />Your City, State 12345</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-800 text-center text-sm">
                    <p>
                        © {currentYear} {settings?.storeName || 'MyShop'}. All rights reserved.
                    </p>
                    <p className="mt-2 text-gray-400">
                        {settings?.footerText || 'Your trusted local business'}
                    </p>
                </div>
            </div>
        </footer>
    );
}
