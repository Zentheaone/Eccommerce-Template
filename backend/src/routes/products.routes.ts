import { Router, Response } from 'express';
import Product from '../models/Product';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

// Get all products (public)
router.get('/', async (req, res: Response) => {
    try {
        const {
            category,
            search,
            featured,
            sort = '-createdAt',
            page = 1,
            limit = 12,
        } = req.query;

        const query: any = { isActive: true };

        if (category) {
            // Check if category is an ObjectId or a slug
            const mongoose = require('mongoose');
            if (mongoose.Types.ObjectId.isValid(category as string)) {
                query.category = category;
            } else {
                // Find category by slug
                const Category = require('../models/Category').default;
                const categoryDoc = await Category.findOne({ slug: category });
                if (categoryDoc) {
                    query.category = categoryDoc._id;
                }
            }
        }

        if (featured === 'true') {
            query.featured = true;
        }

        if (search) {
            query.$text = { $search: search as string };
        }

        const skip = (Number(page) - 1) * Number(limit);

        const products = await Product.find(query)
            .populate('category', 'name slug')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit));

        const total = await Product.countDocuments(query);

        res.json({
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single product (public)
router.get('/:id', async (req, res: Response) => {
    try {
        const product = await Product.findById(req.params.id).populate(
            'category',
            'name slug'
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create product (admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const product = new Product(req.body);
        await product.save();
        await product.populate('category', 'name slug');
        res.status(201).json(product);
    } catch (error) {
        console.error('Create product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('category', 'name slug');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all products for admin (includes inactive)
router.get('/admin/all', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const products = await Product.find()
            .populate('category', 'name slug')
            .sort('-createdAt');

        res.json(products);
    } catch (error) {
        console.error('Get admin products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
