'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ordersAPI, productsAPI } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Loader } from '@/components/ui/Loader';
import { FiPackage, FiShoppingBag, FiDollarSign, FiAlertCircle, FiLogOut } from 'react-icons/fi';

export default function AdminDashboard() {
    const router = useRouter();
    const { isAuthenticated, logout } = useAuthStore();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }

        const fetchStats = async () => {
            try {
                const [orderStats, productsRes] = await Promise.all([
                    ordersAPI.getStats(),
                    productsAPI.getAllAdmin(),
                ]);

                const lowStockProducts = productsRes.data.filter((p: any) => p.stock <= 5 && p.stock > 0);

                setStats({
                    ...orderStats.data,
                    totalProducts: productsRes.data.length,
                    lowStockCount: lowStockProducts.length,
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout();
        router.push('/admin/login');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <Link href="/">
                                <Button variant="outline" size="sm">View Store</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <FiLogOut className="mr-2" /> Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Orders</p>
                                <p className="text-3xl font-bold">{stats?.totalOrders || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                <FiShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Products</p>
                                <p className="text-3xl font-bold">{stats?.totalProducts || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                <FiPackage className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Revenue</p>
                                <p className="text-3xl font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                                <FiDollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Low Stock Items</p>
                                <p className="text-3xl font-bold">{stats?.lowStockCount || 0}</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                                <FiAlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card className="p-6 mb-8">
                    <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Link href="/admin/products">
                            <Button variant="outline" className="w-full">
                                <FiPackage className="mr-2" /> Manage Products
                            </Button>
                        </Link>
                        <Link href="/admin/categories">
                            <Button variant="outline" className="w-full">
                                Manage Categories
                            </Button>
                        </Link>
                        <Link href="/admin/orders">
                            <Button variant="outline" className="w-full">
                                <FiShoppingBag className="mr-2" /> View Orders
                            </Button>
                        </Link>
                        <Link href="/admin/settings">
                            <Button variant="outline" className="w-full">
                                Settings
                            </Button>
                        </Link>
                    </div>
                </Card>

                {/* Pending Orders */}
                <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Pending Orders</h2>
                        <Link href="/admin/orders">
                            <Button variant="ghost" size="sm">View All</Button>
                        </Link>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {stats?.pendingOrders || 0} orders awaiting confirmation
                    </p>
                </Card>
            </main>
        </div>
    );
}
