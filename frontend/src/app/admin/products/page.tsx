'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { productsAPI, categoriesAPI, uploadAPI } from '@/lib/api';
import { Product, Category } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageProductsPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        images: [] as string[],
        variants: [] as Array<{ type: string; name: string; options: string[] }>,
        isActive: true,
        featured: false,
    });

    // Variant presets
    const variantPresets = {
        color: ['Silver', 'Gold', 'Rose Gold', 'White Gold', 'Platinum', 'Black', 'White', 'Red', 'Blue', 'Green'],
        size: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Adjustable'],
        material: ['Gold', 'Silver', 'Platinum', 'Stainless Steel', 'Titanium', 'Brass', 'Copper'],
    };

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchData();
    }, [isAuthenticated, router]);

    const fetchData = async () => {
        try {
            const [productsRes, categoriesRes] = await Promise.all([
                productsAPI.getAllAdmin(),
                categoriesAPI.getAllAdmin(),
            ]);
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.category._id,
                images: product.images,
                variants: product.variants || [],
                isActive: product.isActive,
                featured: product.featured,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                description: '',
                price: '',
                stock: '',
                category: categories[0]?._id || '',
                images: [],
                variants: [],
                isActive: true,
                featured: false,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            const uploadPromises = Array.from(files).map(file => uploadAPI.single(file));
            const results = await Promise.all(uploadPromises);
            const imageUrls = results.map(res => res.data.url);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Upload failed:', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.price || !formData.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const productData = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                category: formData.category,
                images: formData.images,
                variants: formData.variants,
                isActive: formData.isActive,
                featured: formData.featured,
            };

            if (editingProduct) {
                await productsAPI.update(editingProduct._id, productData);
                toast.success('Product updated successfully');
            } else {
                await productsAPI.create(productData);
                toast.success('Product created successfully');
            }

            handleCloseModal();
            fetchData();
        } catch (error: any) {
            console.error('Failed to save product:', error);
            toast.error(error.response?.data?.message || 'Failed to save product');
        }
    };

    const handleDelete = async (productId: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await productsAPI.delete(productId);
            toast.success('Product deleted successfully');
            fetchData();
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin/dashboard">
                                <Button variant="ghost" size="sm">
                                    <FiArrowLeft className="mr-2" /> Back
                                </Button>
                            </Link>
                            <h1 className="text-2xl font-bold">Manage Products</h1>
                        </div>
                        <Button onClick={() => handleOpenModal()}>
                            <FiPlus className="mr-2" /> Add Product
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Card className="overflow-hidden">
                    {products.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No products yet</p>
                            <Button onClick={() => handleOpenModal()}>
                                <FiPlus className="mr-2" /> Add Your First Product
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.map((product) => (
                                    <TableRow key={product._id}>
                                        <TableCell>
                                            {product.images[0] ? (
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded" />
                                            )}
                                        </TableCell>
                                        <TableCell className="font-medium">{product.name}</TableCell>
                                        <TableCell>{product.category.name}</TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span
                                                className={
                                                    product.stock === 0
                                                        ? 'text-red-600 dark:text-red-400 font-semibold'
                                                        : product.stock <= 5
                                                            ? 'text-yellow-600 dark:text-yellow-400 font-semibold'
                                                            : ''
                                                }
                                            >
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={product.isActive ? 'success' : 'default'}>
                                                {product.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(product)}
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(product._id)}
                                                >
                                                    <FiTrash2 className="text-red-500" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </Card>
            </main>

            {/* Add/Edit Product Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingProduct ? 'Edit Product' : 'Add Product'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Product Name *"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2">Description *</label>
                        <textarea
                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Price *"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            required
                        />
                        <Input
                            label="Stock *"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            required
                        />
                    </div>

                    <Select
                        label="Category *"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        options={categories.map((cat) => ({ value: cat._id, label: cat.name }))}
                        required
                    />

                    {/* Variant Management */}
                    <div>
                        <label className="block text-sm font-medium mb-3">Product Variants</label>
                        
                        {/* Quick Add Variant Buttons */}
                        <div className="space-y-3 mb-4">
                            {/* Color Variant */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Add Color Variant:</p>
                                <div className="flex flex-wrap gap-2">
                                    {variantPresets.color.map((color) => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => {
                                                const colorVariant = formData.variants.find(v => v.type === 'color');
                                                if (colorVariant) {
                                                    if (!colorVariant.options.includes(color)) {
                                                        setFormData({
                                                            ...formData,
                                                            variants: formData.variants.map(v =>
                                                                v.type === 'color'
                                                                    ? { ...v, options: [...v.options, color] }
                                                                    : v
                                                            ),
                                                        });
                                                    }
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        variants: [...formData.variants, { type: 'color', name: 'Color', options: [color] }],
                                                    });
                                                }
                                            }}
                                            className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {color}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Material Variant */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Add Material Variant:</p>
                                <div className="flex flex-wrap gap-2">
                                    {variantPresets.material.map((material) => (
                                        <button
                                            key={material}
                                            type="button"
                                            onClick={() => {
                                                const materialVariant = formData.variants.find(v => v.type === 'material');
                                                if (materialVariant) {
                                                    if (!materialVariant.options.includes(material)) {
                                                        setFormData({
                                                            ...formData,
                                                            variants: formData.variants.map(v =>
                                                                v.type === 'material'
                                                                    ? { ...v, options: [...v.options, material] }
                                                                    : v
                                                            ),
                                                        });
                                                    }
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        variants: [...formData.variants, { type: 'material', name: 'Material', options: [material] }],
                                                    });
                                                }
                                            }}
                                            className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {material}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Variant */}
                            <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Add Size Variant:</p>
                                <div className="flex flex-wrap gap-2">
                                    {variantPresets.size.map((size) => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => {
                                                const sizeVariant = formData.variants.find(v => v.type === 'size');
                                                if (sizeVariant) {
                                                    if (!sizeVariant.options.includes(size)) {
                                                        setFormData({
                                                            ...formData,
                                                            variants: formData.variants.map(v =>
                                                                v.type === 'size'
                                                                    ? { ...v, options: [...v.options, size] }
                                                                    : v
                                                            ),
                                                        });
                                                    }
                                                } else {
                                                    setFormData({
                                                        ...formData,
                                                        variants: [...formData.variants, { type: 'size', name: 'Size', options: [size] }],
                                                    });
                                                }
                                            }}
                                            className="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Display Selected Variants */}
                        {formData.variants.length > 0 && (
                            <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm font-medium">Selected Variants:</p>
                                {formData.variants.map((variant, index) => (
                                    <div key={index} className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium capitalize">{variant.name}:</p>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {variant.options.map((option, optIndex) => (
                                                    <span
                                                        key={optIndex}
                                                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded"
                                                    >
                                                        {option}
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newOptions = variant.options.filter((_, i) => i !== optIndex);
                                                                if (newOptions.length === 0) {
                                                                    setFormData({
                                                                        ...formData,
                                                                        variants: formData.variants.filter((_, i) => i !== index),
                                                                    });
                                                                } else {
                                                                    setFormData({
                                                                        ...formData,
                                                                        variants: formData.variants.map((v, i) =>
                                                                            i === index ? { ...v, options: newOptions } : v
                                                                        ),
                                                                    });
                                                                }
                                                            }}
                                                            className="hover:text-red-600"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Product Images</label>
                        <div className="space-y-2">
                            {formData.images.length > 0 && (
                                <div className="grid grid-cols-4 gap-2">
                                    {formData.images.map((img, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={img}
                                                alt={`Product ${index + 1}`}
                                                className="w-full h-24 object-cover rounded"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                                <FiUpload className="mr-2" />
                                {uploading ? 'Uploading...' : 'Upload Images'}
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span className="text-sm">Featured</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingProduct ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
