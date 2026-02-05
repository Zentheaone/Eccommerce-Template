import { Request } from 'express';
import { Types } from 'mongoose';

export interface IUser {
    _id: string;
    email: string;
    password: string;
    name: string;
    role: 'admin';
    createdAt: Date;
    updatedAt: Date;
}

export interface IProduct {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: Types.ObjectId;
    variants: IVariant[];
    stock: number;
    isActive: boolean;
    featured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IVariant {
    type: 'size' | 'color' | 'material';
    name: string;
    options: string[];
}

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: string;
    isActive: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrder {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: IOrderItem[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    whatsappSent: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IOrderItem {
    product: Types.ObjectId;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    selectedVariants?: { [key: string]: string };
}

export interface ISettings {
    _id: string;
    storeName: string;
    storeDescription?: string;
    logo?: string;
    whatsappNumber: string;
    currency: string;
    currencySymbol: string;
    deliveryCharge: number;
    orderMessageTemplate: string;
    heroTitle?: string;
    heroSubtitle?: string;
    footerText?: string;
    contactPhone?: string;
    contactEmail?: string;
    businessAddress?: string;
    socialLinks?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
    };
    updatedAt: Date;
}

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}
