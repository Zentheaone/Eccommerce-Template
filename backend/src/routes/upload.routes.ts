import { Router, Request, Response } from 'express';
import { upload } from '../middleware/upload.middleware';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Upload single image (admin only)
router.post('/single', authMiddleware, upload.single('image'), (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({ url: fileUrl, filename: req.file.filename });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

// Upload multiple images (admin only)
router.post('/multiple', authMiddleware, upload.array('images', 10), (req: Request, res: Response) => {
    try {
        if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const files = req.files.map((file) => ({
            url: `/uploads/${file.filename}`,
            filename: file.filename,
        }));

        res.json({ files });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Upload failed' });
    }
});

export default router;
