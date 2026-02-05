import { Router, Response } from 'express';
import Category from '../models/Category';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

// Get all categories (public)
router.get('/', async (req, res: Response) => {
    try {
        const categories = await Category.find({ isActive: true })
            .populate('parent', 'name slug')
            .sort('order');

        res.json(categories);
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single category (public)
router.get('/:id', async (req, res: Response) => {
    try {
        const category = await Category.findById(req.params.id).populate(
            'parent',
            'name slug'
        );

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create category (admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const category = new Category(req.body);
        await category.save();
        await category.populate('parent', 'name slug');
        res.status(201).json(category);
    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update category (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('parent', 'name slug');

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json(category);
    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete category (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all categories for admin (includes inactive)
router.get('/admin/all', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const categories = await Category.find()
            .populate('parent', 'name slug')
            .sort('order');

        res.json(categories);
    } catch (error) {
        console.error('Get admin categories error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
