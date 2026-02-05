import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/User';
import Category from '../src/models/Category';
import Product from '../src/models/Product';
import Settings from '../src/models/Settings';

dotenv.config();

const seedDatabase = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');

        // Create admin user
        const existingAdmin = await User.findOne({ email: 'admin@shop.local' });
        if (!existingAdmin) {
            const admin = new User({
                email: 'admin@shop.local',
                password: 'admin123',
                name: 'Admin User',
                role: 'admin',
            });
            await admin.save();
            console.log('✅ Admin user created (email: admin@shop.local, password: admin123)');
        } else {
            console.log('ℹ️  Admin user already exists');
        }

        // Create default settings
        const existingSettings = await Settings.findOne();
        if (!existingSettings) {
            const settings = new Settings({
                storeName: 'My Local Shop',
                storeDescription: 'Your trusted local business for quality products',
                whatsappNumber: '+1234567890',
                currency: 'USD',
                currencySymbol: '$',
                deliveryCharge: 5,
                heroTitle: 'Welcome to Our Store',
                heroSubtitle: 'Discover amazing products crafted with care',
                footerText: 'Your trusted local business since 2024',
            });
            await settings.save();
            console.log('✅ Default settings created');
        } else {
            console.log('ℹ️  Settings already exist');
        }

        // Create sample categories
        const categoryCount = await Category.countDocuments();
        if (categoryCount === 0) {
            const categories = [
                { name: 'Jewelry', slug: 'jewelry', description: 'Beautiful handcrafted jewelry', order: 1 },
                { name: 'Gifts', slug: 'gifts', description: 'Perfect gifts for every occasion', order: 2 },
                { name: 'Prints', slug: 'prints', description: 'Custom prints and photo products', order: 3 },
                { name: 'Custom Items', slug: 'custom-items', description: 'Personalized products made just for you', order: 4 },
            ];

            for (const cat of categories) {
                const category = new Category(cat);
                await category.save();
            }
            console.log('✅ Sample categories created');
        } else {
            console.log('ℹ️  Categories already exist');
        }

        // Create sample products
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const jewelryCategory = await Category.findOne({ name: 'Jewelry' });
            const giftsCategory = await Category.findOne({ name: 'Gifts' });

            if (jewelryCategory && giftsCategory) {
                const products = [
                    {
                        name: 'Silver Necklace',
                        description: 'Elegant sterling silver necklace with pendant',
                        price: 49.99,
                        category: jewelryCategory._id,
                        stock: 15,
                        featured: true,
                        variants: [
                            { type: 'material', name: 'Material', options: ['Silver', 'Gold Plated'] },
                        ],
                    },
                    {
                        name: 'Gift Box Set',
                        description: 'Premium gift box with assorted items',
                        price: 29.99,
                        category: giftsCategory._id,
                        stock: 25,
                        featured: true,
                        variants: [
                            { type: 'size', name: 'Size', options: ['Small', 'Medium', 'Large'] },
                        ],
                    },
                ];

                for (const prod of products) {
                    const product = new Product(prod);
                    await product.save();
                }
                console.log('✅ Sample products created');
            }
        } else {
            console.log('ℹ️  Products already exist');
        }

        console.log('\n🎉 Database seeding completed!');
        console.log('\n📝 Admin Credentials:');
        console.log('   Email: admin@shop.local');
        console.log('   Password: admin123');
        console.log('\n⚠️  Please change the admin password after first login!');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
