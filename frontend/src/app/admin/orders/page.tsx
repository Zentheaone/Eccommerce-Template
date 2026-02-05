'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { ordersAPI, settingsAPI } from '@/lib/api';
import { Order, Settings } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { FiArrowLeft, FiEye, FiMessageCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ViewOrdersPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (statusFilter === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === statusFilter));
        }
    }, [statusFilter, orders]);

    const fetchData = async () => {
        try {
            const [ordersRes, settingsRes] = await Promise.all([
                ordersAPI.getAll(),
                settingsAPI.get(),
            ]);
            // API returns { orders: [], pagination: {} }
            const ordersData = ordersRes.data.orders || ordersRes.data;
            setOrders(ordersData);
            setFilteredOrders(ordersData);
            setSettings(settingsRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order);
        setShowDetailsModal(true);
    };

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        try {
            await ordersAPI.updateStatus(orderId, newStatus);
            toast.success('Order status updated');
            fetchData();
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus as any });
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            toast.error('Failed to update order status');
        }
    };

    const handleSendWhatsApp = (order: Order) => {
        if (!settings) return;

        const orderDate = new Date(order.createdAt).toLocaleString('en-US', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const itemsList = order.items
            .map((item, index) => {
                let itemText = `${index + 1}. *${item.productName}*\n`;
                
                // Add variant details if available
                if (item.selectedVariants && Object.keys(item.selectedVariants).length > 0) {
                    const variants = Object.entries(item.selectedVariants)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(', ');
                    itemText += `   _${variants}_\n`;
                }
                
                itemText += `   Qty: ${item.quantity} × ${settings.currencySymbol}${item.price.toFixed(2)} = *${settings.currencySymbol}${(item.quantity * item.price).toFixed(2)}*`;
                
                return itemText;
            })
            .join('\n\n');

        const message = `╔════════════════════════╗
║   🛍️ *ORDER UPDATE*   ║
╚════════════════════════╝

📅 *Date:* ${orderDate}
📋 *Order #:* ${order.orderNumber}
📊 *Status:* ${order.status.toUpperCase()}

┌─────────────────────────┐
│  📦 *ORDER ITEMS*
└─────────────────────────┘

${itemsList}

┌─────────────────────────┐
│  👤 *CUSTOMER DETAILS*
└─────────────────────────┘
Name: ${order.customerName}
Phone: ${order.customerPhone}

┌─────────────────────────┐
│  💰 *PAYMENT SUMMARY*
└─────────────────────────┘
Subtotal:        ${settings.currencySymbol}${order.subtotal.toFixed(2)}
Delivery Charge: ${settings.currencySymbol}${order.deliveryCharge.toFixed(2)}
─────────────────────────
*TOTAL AMOUNT:   ${settings.currencySymbol}${order.total.toFixed(2)}*

━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your order! 🙏`;

        const whatsappNumber = settings.whatsappNumber.replace(/[^0-9]/g, '');
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'confirmed':
                return 'info';
            case 'completed':
                return 'success';
            case 'cancelled':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
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
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="ghost" size="sm">
                                    <FiArrowLeft className="mr-2" /> Back
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold">View Orders</h1>
                        </div>
                        <div className="w-48">
                            <Select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                options={[
                                    { value: 'all', label: 'All Orders' },
                                    { value: 'pending', label: 'Pending' },
                                    { value: 'confirmed', label: 'Confirmed' },
                                    { value: 'completed', label: 'Completed' },
                                    { value: 'cancelled', label: 'Cancelled' },
                                ]}
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Card className="overflow-hidden">
                    {filteredOrders.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400">
                                {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order #</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead>Items</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredOrders.map((order) => (
                                    <TableRow key={order._id}>
                                        <TableCell className="font-mono font-semibold">
                                            {order.orderNumber}
                                        </TableCell>
                                        <TableCell className="font-medium">{order.customerName}</TableCell>
                                        <TableCell>{order.customerPhone}</TableCell>
                                        <TableCell>{order.items.length}</TableCell>
                                        <TableCell className="font-semibold">
                                            ${order.total.toFixed(2)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(order.status)}>
                                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                                            {formatDate(order.createdAt)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleViewDetails(order)}
                                                >
                                                    <FiEye />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSendWhatsApp(order)}
                                                    title="Send WhatsApp"
                                                >
                                                    <FiMessageCircle className="text-green-600" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <Modal
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    title={`Order ${selectedOrder.orderNumber}`}
                >
                    <div className="space-y-6">
                        {/* Customer Info */}
                        <div>
                            <h3 className="font-semibold mb-2">Customer Information</h3>
                            <div className="space-y-1 text-sm">
                                <p><span className="text-gray-600 dark:text-gray-400">Name:</span> {selectedOrder.customerName}</p>
                                <p><span className="text-gray-600 dark:text-gray-400">Phone:</span> {selectedOrder.customerPhone}</p>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div>
                            <h3 className="font-semibold mb-2">Order Items</h3>
                            <div className="space-y-3">
                                {selectedOrder.items.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <img
                                            src={item.productImage}
                                            alt={item.productName}
                                            className="w-16 h-16 object-cover rounded"
                                        />
                                        <div className="flex-1">
                                            <p className="font-medium">{item.productName}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Quantity: {item.quantity} × ${item.price.toFixed(2)}
                                            </p>
                                        </div>
                                        <p className="font-semibold">${(item.quantity * item.price).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="border-t pt-4">
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Delivery Charge:</span>
                                    <span>${selectedOrder.deliveryCharge.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Total:</span>
                                    <span>${selectedOrder.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedOrder.notes && (
                            <div>
                                <h3 className="font-semibold mb-2">Notes</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedOrder.notes}</p>
                            </div>
                        )}

                        {/* Status Update */}
                        <div>
                            <h3 className="font-semibold mb-2">Update Status</h3>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'pending' ? 'primary' : 'outline'}
                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'pending')}
                                    disabled={selectedOrder.status === 'pending'}
                                >
                                    Pending
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'confirmed' ? 'primary' : 'outline'}
                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'confirmed')}
                                    disabled={selectedOrder.status === 'confirmed'}
                                >
                                    Confirmed
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'completed' ? 'primary' : 'outline'}
                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'completed')}
                                    disabled={selectedOrder.status === 'completed'}
                                >
                                    Completed
                                </Button>
                                <Button
                                    size="sm"
                                    variant={selectedOrder.status === 'cancelled' ? 'primary' : 'outline'}
                                    onClick={() => handleUpdateStatus(selectedOrder._id, 'cancelled')}
                                    disabled={selectedOrder.status === 'cancelled'}
                                >
                                    Cancelled
                                </Button>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="pt-4 border-t">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => handleSendWhatsApp(selectedOrder)}
                            >
                                <FiMessageCircle className="mr-2" /> Send WhatsApp Message
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
