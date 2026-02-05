'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { categoriesAPI } from '@/lib/api';
import { Category } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import Badge from '@/components/ui/Badge';
import { Loader } from '@/components/ui/Loader';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { FiPlus, FiEdit2, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function ManageCategoriesPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        slug: '',
        isActive: true,
        order: 0,
    });

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/admin/login');
            return;
        }
        fetchCategories();
    }, [isAuthenticated, router]);

    const fetchCategories = async () => {
        try {
            const response = await categoriesAPI.getAllAdmin();
            setCategories(response.data);
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                description: category.description || '',
                slug: category.slug,
                isActive: category.isActive,
                order: category.order,
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                description: '',
                slug: '',
                isActive: true,
                order: categories.length,
            });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: editingCategory ? formData.slug : generateSlug(name),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.slug) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const categoryData = {
                name: formData.name,
                description: formData.description,
                slug: formData.slug,
                isActive: formData.isActive,
                order: formData.order,
            };

            if (editingCategory) {
                await categoriesAPI.update(editingCategory._id, categoryData);
                toast.success('Category updated successfully');
            } else {
                await categoriesAPI.create(categoryData);
                toast.success('Category created successfully');
            }

            handleCloseModal();
            fetchCategories();
        } catch (error: any) {
            console.error('Failed to save category:', error);
            toast.error(error.response?.data?.message || 'Failed to save category');
        }
    };

    const handleDelete = async (categoryId: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            await categoriesAPI.delete(categoryId);
            toast.success('Category deleted successfully');
            fetchCategories();
        } catch (error) {
            console.error('Failed to delete category:', error);
            toast.error('Failed to delete category');
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
                            <h1 className="text-2xl font-bold">Manage Categories</h1>
                        </div>
                        <Button onClick={() => handleOpenModal()}>
                            <FiPlus className="mr-2" /> Add Category
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Card className="overflow-hidden">
                    {categories.length === 0 ? (
                        <div className="p-12 text-center">
                            <p className="text-gray-500 dark:text-gray-400 mb-4">No categories yet</p>
                            <Button onClick={() => handleOpenModal()}>
                                <FiPlus className="mr-2" /> Add Your First Category
                            </Button>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Slug</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Order</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.map((category) => (
                                    <TableRow key={category._id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                                        <TableCell className="max-w-xs truncate">
                                            {category.description || '-'}
                                        </TableCell>
                                        <TableCell>{category.order}</TableCell>
                                        <TableCell>
                                            <Badge variant={category.isActive ? 'success' : 'default'}>
                                                {category.isActive ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleOpenModal(category)}
                                                >
                                                    <FiEdit2 />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(category._id)}
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

            {/* Add/Edit Category Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingCategory ? 'Edit Category' : 'Add Category'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Category Name *"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        required
                    />

                    <div>
                        <Input
                            label="Slug *"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URL-friendly version of the name</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Description</label>
                        <textarea
                            className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div>
                        <Input
                            label="Display Order"
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Lower numbers appear first</p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm">Active</span>
                    </label>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {editingCategory ? 'Update Category' : 'Create Category'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
