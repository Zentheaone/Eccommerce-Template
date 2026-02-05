import { Router, Response } from 'express';
import Order from '../models/Order';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

// Create order (public)
router.post('/', async (req, res: Response) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders (admin only)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const query: any = {};
        if (status) {
            query.status = status;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const orders = await Order.find(query)
            .sort('-createdAt')
            .skip(skip)
            .limit(Number(limit));

        const total = await Order.countDocuments(query);

        res.json({
            orders,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single order (admin only)
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status (admin only)
router.patch('/:id/status', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order statistics (admin only)
router.get('/stats/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        const completedOrders = await Order.countDocuments({ status: 'completed' });

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $in: ['confirmed', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);

        res.json({
            totalOrders,
            pendingOrders,
            completedOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
        });
    } catch (error) {
        console.error('Get order stats error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
