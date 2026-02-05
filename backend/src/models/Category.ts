import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from '../types';

interface ICategoryDocument extends Omit<ICategory, '_id'>, Document { }

const categorySchema = new Schema<ICategoryDocument>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

// Generate slug from name before saving
categorySchema.pre('save', function (next) {
    if (this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    next();
});

// Index for ordering
categorySchema.index({ order: 1, isActive: 1 });

export default mongoose.model<ICategoryDocument>('Category', categorySchema);
