'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { settingsAPI } from '@/lib/api';
import { Settings } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Loader } from '@/components/ui/Loader';
import toast from 'react-hot-toast';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminSettingsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }

        const fetchSettings = async () => {
            try {
                const response = await settingsAPI.get();
                setSettings(response.data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;

        setSaving(true);
        try {
            await settingsAPI.update(settings);
            toast.success('Settings updated successfully!');
        } catch (error) {
            console.error('Failed to update settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof Settings, value: any) => {
        if (!settings) return;
        setSettings({ ...settings, [field]: value });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!settings) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Failed to load settings</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="ghost" size="sm">
                                    <FiArrowLeft className="mr-2" /> Back to Dashboard
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold">Store Settings</h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
                    {/* Store Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Store Information</h2>
                        <div className="space-y-4">
                            <Input
                                label="Store Name"
                                value={settings.storeName}
                                onChange={(e) => handleChange('storeName', e.target.value)}
                                required
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Store Description
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                    value={settings.storeDescription || ''}
                                    onChange={(e) => handleChange('storeDescription', e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Contact Information */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
                        <div className="space-y-4">
                            <Input
                                label="WhatsApp Number (with country code)"
                                placeholder="+917904159007"
                                value={settings.whatsappNumber}
                                onChange={(e) => handleChange('whatsappNumber', e.target.value)}
                                required
                            />
                            <Input
                                label="Contact Phone"
                                placeholder="+91 79041 59007"
                                value={settings.contactPhone || ''}
                                onChange={(e) => handleChange('contactPhone', e.target.value)}
                            />
                            <Input
                                label="Contact Email"
                                type="email"
                                placeholder="contact@myshop.com"
                                value={settings.contactEmail || ''}
                                onChange={(e) => handleChange('contactEmail', e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Business Address
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Your business address"
                                    value={settings.businessAddress || ''}
                                    onChange={(e) => handleChange('businessAddress', e.target.value)}
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Currency & Pricing */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Currency & Pricing</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            <Input
                                label="Currency Code"
                                placeholder="INR"
                                value={settings.currency}
                                onChange={(e) => handleChange('currency', e.target.value)}
                                required
                            />
                            <Input
                                label="Currency Symbol"
                                placeholder="₹"
                                value={settings.currencySymbol}
                                onChange={(e) => handleChange('currencySymbol', e.target.value)}
                                required
                            />
                            <Input
                                label="Delivery Charge"
                                type="number"
                                min="0"
                                step="0.01"
                                value={settings.deliveryCharge}
                                onChange={(e) => handleChange('deliveryCharge', parseFloat(e.target.value))}
                                required
                            />
                        </div>
                    </Card>

                    {/* Homepage Content */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Homepage Content</h2>
                        <div className="space-y-4">
                            <Input
                                label="Hero Title"
                                placeholder="Welcome to Our Store"
                                value={settings.heroTitle || ''}
                                onChange={(e) => handleChange('heroTitle', e.target.value)}
                            />
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Hero Subtitle
                                </label>
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Discover amazing products..."
                                    value={settings.heroSubtitle || ''}
                                    onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                                />
                            </div>
                            <Input
                                label="Footer Text"
                                placeholder="Your trusted local business"
                                value={settings.footerText || ''}
                                onChange={(e) => handleChange('footerText', e.target.value)}
                            />
                        </div>
                    </Card>

                    {/* Social Links */}
                    <Card className="p-6">
                        <h2 className="text-xl font-bold mb-4">Social Media Links</h2>
                        <div className="space-y-4">
                            <Input
                                label="Facebook URL"
                                placeholder="https://facebook.com/yourpage"
                                value={settings.socialLinks?.facebook || ''}
                                onChange={(e) =>
                                    handleChange('socialLinks', {
                                        ...settings.socialLinks,
                                        facebook: e.target.value,
                                    })
                                }
                            />
                            <Input
                                label="Instagram URL"
                                placeholder="https://instagram.com/yourpage"
                                value={settings.socialLinks?.instagram || ''}
                                onChange={(e) =>
                                    handleChange('socialLinks', {
                                        ...settings.socialLinks,
                                        instagram: e.target.value,
                                    })
                                }
                            />
                            <Input
                                label="Twitter URL"
                                placeholder="https://twitter.com/yourpage"
                                value={settings.socialLinks?.twitter || ''}
                                onChange={(e) =>
                                    handleChange('socialLinks', {
                                        ...settings.socialLinks,
                                        twitter: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </Card>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={saving} size="lg">
                            <FiSave className="mr-2" />
                            Save Settings
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
