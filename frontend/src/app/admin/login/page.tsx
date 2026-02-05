'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
    const router = useRouter();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await authAPI.login(email, password);
            const { token, user } = response.data;

            setAuth(user, token);
            toast.success('Login successful!');
            router.push('/admin/dashboard');
        } catch (error: any) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Login</h1>
                    <p className="text-gray-300">Sign in to manage your store</p>
                </div>

                <div className="glass rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@shop.local"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button
                            type="submit"
                            isLoading={loading}
                            className="w-full"
                            size="lg"
                        >
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-300">
                        <p>Default credentials:</p>
                        <p className="font-mono mt-1">admin@shop.local / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
