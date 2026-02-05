import mongoose, { Schema, Document } from 'mongoose';
import { ISettings } from '../types';

interface ISettingsDocument extends Omit<ISettings, '_id'>, Document { }

const settingsSchema = new Schema<ISettingsDocument>(
    {
        storeName: {
            type: String,
            required: true,
            default: 'My Store',
        },
        storeDescription: {
            type: String,
        },
        logo: {
            type: String,
        },
        whatsappNumber: {
            type: String,
            required: true,
            default: '+1234567890',
        },
        currency: {
            type: String,
            required: true,
            default: 'USD',
        },
        currencySymbol: {
            type: String,
            required: true,
            default: '$',
        },
        deliveryCharge: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        orderMessageTemplate: {
            type: String,
            required: true,
            default: `🛍️ *New Order*

📦 Order Details:
{items}

👤 Customer: {customerName}
📱 Phone: {customerPhone}

💰 Subtotal: {subtotal}
🚚 Delivery: {deliveryCharge}
💵 *Total: {total}*

Order Number: {orderNumber}`,
        },
        heroTitle: {
            type: String,
            default: 'Welcome to Our Store',
        },
        heroSubtitle: {
            type: String,
            default: 'Discover amazing products for your needs',
        },
        footerText: {
            type: String,
            default: 'Your trusted local business',
        },
        contactPhone: {
            type: String,
        },
        contactEmail: {
            type: String,
        },
        businessAddress: {
            type: String,
        },
        socialLinks: {
            facebook: String,
            instagram: String,
            twitter: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ISettingsDocument>('Settings', settingsSchema);
