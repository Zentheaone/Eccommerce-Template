'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { useCartStore } from '@/store/cartStore';
import { settingsAPI, ordersAPI } from '@/lib/api';
import { Settings } from '@/types';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function CartPage() {
    const router = useRouter();
    const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
    const [settings, setSettings] = useState<Settings | null>(null);
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [loading, setLoading] = useState(false);

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

    const subtotal = getTotal();
    const deliveryCharge = settings?.deliveryCharge || 0;
    const total = subtotal + deliveryCharge;

    const handleCheckout = async () => {
        if (!customerName || !customerPhone) {
            toast.error('Please enter your name and phone number');
            return;
        }

        if (items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            // Create order with validated data
            const orderData = {
                customerName,
                customerPhone,
                items: items.map((item) => ({
                    product: item.id,
                    productName: item.name,
                    productImage: item.image || '/uploads/placeholder.jpg', // Ensure never empty
                    quantity: item.quantity,
                    price: item.price,
                    selectedVariants: item.selectedVariants,
                })),
                subtotal,
                deliveryCharge,
                total,
            };

            const response = await ordersAPI.create(orderData);
            const order = response.data;

            // Generate WhatsApp message in bill format with enhanced formatting
            const orderDate = new Date().toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            });

            const itemsList = items
                .map((item, index) => {
                    let itemText = `${index + 1}. *${item.name}*\n`;
                    
                    // Add variant details if available
                    if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
                        const variants = Object.entries(item.selectedVariants)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ');
                        itemText += `   _${variants}_\n`;
                    }
                    
                    itemText += `   Qty: ${item.quantity} × ${settings?.currencySymbol || '₹'}${item.price.toFixed(2)} = *${settings?.currencySymbol || '₹'}${(
                        item.price * item.quantity
                    ).toFixed(2)}*`;
                    
                    return itemText;
                })
                .join('\n\n');

            const message = `╔════════════════════════╗
║   🛍️ *NEW ORDER*   ║
╚════════════════════════╝

📅 *Date:* ${orderDate}
📋 *Order #:* ${order.orderNumber}

┌─────────────────────────┐
│  📦 *ORDER ITEMS*
└─────────────────────────┘

${itemsList}

┌─────────────────────────┐
│  👤 *CUSTOMER DETAILS*
└─────────────────────────┘
Name: ${customerName}
Phone: ${customerPhone}

┌─────────────────────────┐
│  💰 *PAYMENT SUMMARY*
└─────────────────────────┘
Subtotal:        ${settings?.currencySymbol || '₹'}${subtotal.toFixed(2)}
Delivery Charge: ${settings?.currencySymbol || '₹'}${deliveryCharge.toFixed(2)}
─────────────────────────
*TOTAL AMOUNT:   ${settings?.currencySymbol || '₹'}${total.toFixed(2)}*

━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your order! 🙏
We'll contact you shortly to confirm.`;

            const whatsappNumber = settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '917904159007';
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

            // Clear cart
            clearCart();

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');

            toast.success('Order placed! Redirecting to WhatsApp...');

            setTimeout(() => {
                router.push('/');
            }, 2000);
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            Add some products to get started
                        </p>
                        <Link href="/shop">
                            <Button>Start Shopping</Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 section">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => (
                                <Card key={item.id} className="p-4">
                                    <div className="flex gap-4">
                                        <img
                                            src={`http://localhost:5000${item.image}` || 'https://via.placeholder.com/100'}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-lg"
                                            onError={(e) => {
                                                e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                                            }}
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                                {settings?.currencySymbol || '$'}{item.price.toFixed(2)} each
                                            </p>
                                            {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                                    {Object.entries(item.selectedVariants).map(([key, value]) => (
                                                        <span key={key} className="mr-2">
                                                            {key}: {value}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <FiMinus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <FiPlus className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-600 transition-colors p-2"
                                                >
                                                    <FiTrash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-bold">
                                                {settings?.currencySymbol || '$'}
                                                {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* Checkout Summary */}
                        <div>
                            <Card className="p-6 sticky top-20">
                                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                        <span className="font-medium">
                                            {settings?.currencySymbol || '$'}{subtotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                                        <span className="font-medium">
                                            {settings?.currencySymbol || '$'}{deliveryCharge.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-blue-600 dark:text-blue-400">
                                            {settings?.currencySymbol || '$'}{total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <Input
                                        label="Your Name"
                                        placeholder="John Doe"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        placeholder="+1234567890"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    isLoading={loading}
                                    className="w-full"
                                    size="lg"
                                >
                                    Checkout via WhatsApp
                                </Button>

                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
                                    You'll be redirected to WhatsApp to complete your order
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
