import mongoose, { Schema, Document } from 'mongoose';
import { IOrder, IOrderItem } from '../types';

interface IOrderDocument extends Omit<IOrder, '_id'>, Document { }

const orderItemSchema = new Schema<IOrderItem>({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    productImage: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    selectedVariants: {
        type: Map,
        of: String,
    },
});

const orderSchema = new Schema<IOrderDocument>(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        customerName: {
            type: String,
            required: true,
            trim: true,
        },
        customerPhone: {
            type: String,
            required: true,
            trim: true,
        },
        items: {
            type: [orderItemSchema],
            required: true,
            validate: {
                validator: (items: IOrderItem[]) => items.length > 0,
                message: 'Order must have at least one item',
            },
        },
        subtotal: {
            type: Number,
            required: true,
            min: 0,
        },
        deliveryCharge: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'completed', 'cancelled'],
            default: 'pending',
        },
        whatsappSent: {
            type: Boolean,
            default: false,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Generate order number before saving
orderSchema.pre('validate', async function (next) {
    if (this.isNew && !this.orderNumber) {
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `ORD-${Date.now()}-${count + 1}`;
    }
    next();
});

// Index for searching and filtering
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model<IOrderDocument>('Order', orderSchema);
