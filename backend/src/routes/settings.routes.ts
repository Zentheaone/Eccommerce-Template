import { Router, Response } from 'express';
import Settings from '../models/Settings';
import { authMiddleware } from '../middleware/auth.middleware';
import { AuthRequest } from '../types';

const router = Router();

// Get settings (public - limited fields)
router.get('/public', async (req, res: Response) => {
    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        // Return only public fields
        res.json({
            storeName: settings.storeName,
            storeDescription: settings.storeDescription,
            logo: settings.logo,
            whatsappNumber: settings.whatsappNumber,
            currency: settings.currency,
            currencySymbol: settings.currencySymbol,
            deliveryCharge: settings.deliveryCharge,
            heroTitle: settings.heroTitle,
            heroSubtitle: settings.heroSubtitle,
            footerText: settings.footerText,
            socialLinks: settings.socialLinks,
        });
    } catch (error) {
        console.error('Get public settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all settings (admin only)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        const settings = await Settings.findOne();

        if (!settings) {
            return res.status(404).json({ message: 'Settings not found' });
        }

        res.json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update settings (admin only)
router.put('/', authMiddleware, async (req: AuthRequest, res: Response) => {
    try {
        let settings = await Settings.findOne();

        if (!settings) {
            // Create settings if they don't exist
            settings = new Settings(req.body);
        } else {
            // Update existing settings
            Object.assign(settings, req.body);
        }

        await settings.save();
        res.json(settings);
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
