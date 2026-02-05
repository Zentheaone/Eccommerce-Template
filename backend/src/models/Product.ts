import mongoose, { Schema, Document } from 'mongoose';
import { IProduct, IVariant } from '../types';

interface IProductDocument extends Omit<IProduct, '_id'>, Document { }

const variantSchema = new Schema<IVariant>({
    type: {
        type: String,
        enum: ['size', 'color', 'material'],
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    options: {
        type: [String],
        required: true,
    },
});

const productSchema = new Schema<IProductDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        images: {
            type: [String],
            default: [],
        },
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        variants: {
            type: [variantSchema],
            default: [],
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        featured: {
            type: Boolean,
            default: false,
        },
        seoTitle: {
            type: String,
            trim: true,
        },
        seoDescription: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ featured: 1, isActive: 1 });

export default mongoose.model<IProductDocument>('Product', productSchema);
