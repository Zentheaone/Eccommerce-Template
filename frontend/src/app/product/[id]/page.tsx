'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Loader';
import { productsAPI, settingsAPI } from '@/lib/api';
import { useCartStore } from '@/store/cartStore';
import { Product, Settings } from '@/types';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const [product, setProduct] = useState<Product | null>(null);
    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariants, setSelectedVariants] = useState<{ [key: string]: string }>({});
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, settingsRes] = await Promise.all([
                    productsAPI.getById(params.id as string),
                    settingsAPI.getPublic(),
                ]);
                setProduct(productRes.data);
                setSettings(settingsRes.data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Product not found');
                router.push('/shop');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, router]);

    const handleAddToCart = () => {
        if (!product) return;

        // Check if all variants are selected
        if (product.variants.length > 0) {
            const missingVariants = product.variants.filter(
                (variant) => !selectedVariants[variant.type]
            );
            if (missingVariants.length > 0) {
                toast.error(`Please select ${missingVariants.map((v) => v.name).join(', ')}`);
                return;
            }
        }

        // Ensure we have a valid image URL
        const productImage = product.images[0] || '/uploads/placeholder.jpg';

        addItem({
            id: product._id,
            name: product.name,
            price: product.price,
            image: productImage,
            quantity,
            selectedVariants,
        });

        toast.success('Added to cart!');
    };

    if (loading) {
        return <PageLoader />;
    }

    if (!product) {
        return null;
    }

    const imageUrl = product.images[0]
        ? `http://localhost:5000${product.images[0]}`
        : 'https://via.placeholder.com/600x600?text=No+Image';

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 section">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Product Image */}
                        <div>
                            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/600x600?text=No+Image';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Product Details */}
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>

                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                    {settings?.currencySymbol || '$'}{product.price.toFixed(2)}
                                </span>
                                {product.stock > 0 ? (
                                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                        <FiCheck /> In Stock ({product.stock} available)
                                    </span>
                                ) : (
                                    <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                                )}
                            </div>

                            <p className="text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                                {product.description}
                            </p>

                            {/* Variants */}
                            {product.variants.map((variant) => (
                                <div key={variant.type} className="mb-6">
                                    <label className="block text-sm font-medium mb-2">{variant.name}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {variant.options.map((option) => (
                                            <button
                                                key={option}
                                                onClick={() =>
                                                    setSelectedVariants({ ...selectedVariants, [variant.type]: option })
                                                }
                                                className={`px-4 py-2 rounded-lg border-2 transition-all ${selectedVariants[variant.type] === option
                                                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                                                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}

                            {/* Quantity */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium mb-2">Quantity</label>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        -
                                    </button>
                                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                        className="w-10 h-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                        disabled={quantity >= product.stock}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                size="lg"
                                className="w-full"
                            >
                                <FiShoppingCart className="mr-2" />
                                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
