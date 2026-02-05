export interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
    images: string[];
    category: {
        _id: string;
        name: string;
        slug: string;
    };
    variants: Variant[];
    stock: number;
    isActive: boolean;
    featured: boolean;
    seoTitle?: string;
    seoDescription?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Variant {
    type: 'size' | 'color' | 'material';
    name: string;
    options: string[];
}

export interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    parent?: string;
    isActive: boolean;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface Order {
    _id: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    subtotal: number;
    deliveryCharge: number;
    total: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    whatsappSent: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    product: string;
    productName: string;
    productImage: string;
    quantity: number;
    price: number;
    selectedVariants?: { [key: string]: string };
}

export interface Settings {
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
    updatedAt: string;
}
