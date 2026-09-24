'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Trash2,
  Edit,
  ArrowLeft,
  Search,
  Check,
  X,
  Loader2,
  Package,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Product, Category } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Product form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    price: 0,
    compareAtPrice: 0,
    sku: '',
    stock: 10,
    imageUrl: '',
    featured: false,
    newArrival: false,
    bestSeller: false,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        api.get(`/products?limit=100${search ? `&search=${encodeURIComponent(search)}` : ''}`),
        api.get('/categories'),
      ]);

      if (prodRes.data?.success) setProducts(prodRes.data.data || []);
      if (catRes.data?.success) setCategories(catRes.data.data || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search]);

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      category: categories[0]?._id || '',
      price: 120,
      compareAtPrice: 150,
      sku: `PRD-${Date.now().toString().slice(-4)}`,
      stock: 15,
      imageUrl: 'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80',
      featured: true,
      newArrival: true,
      bestSeller: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProductId(p._id);
    setFormData({
      name: p.name,
      description: p.description,
      shortDescription: p.shortDescription || '',
      category: typeof p.category === 'object' ? p.category._id : p.category,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      sku: p.sku,
      stock: p.stock,
      imageUrl: p.images[0]?.url || '',
      featured: p.featured,
      newArrival: p.newArrival,
      bestSeller: p.bestSeller,
    });
    setIsModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await api.delete(`/products/${id}`);
      if (res.data?.success) {
        toast.success('Product deleted successfully');
        setProducts(products.filter((p) => p._id !== id));
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to delete product');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const payload = {
      ...formData,
      price: Number(formData.price),
      compareAtPrice: Number(formData.compareAtPrice),
      stock: Number(formData.stock),
      images: [{ url: formData.imageUrl, isMain: true }],
    };

    try {
      if (editingProductId) {
        const res = await api.put(`/products/${editingProductId}`, payload);
        if (res.data?.success) {
          toast.success('Product updated successfully');
          setIsModalOpen(false);
          fetchData();
        }
      } else {
        const res = await api.post('/products', payload);
        if (res.data?.success) {
          toast.success('Product created successfully');
          setIsModalOpen(false);
          fetchData();
        }
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Inventory & Catalog Management
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Total of {products.length} artifacts active in repository
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add New Artifact
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name, SKU, or tag..."
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:border-zinc-900 text-zinc-900 dark:text-zinc-100"
        />
      </div>

      {/* Product Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 uppercase text-zinc-400 font-bold tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">SKU</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Loading inventory list...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No products match your search criteria.
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0">
                          <Image
                            src={
                              p.images[0]?.url ||
                              'https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 line-clamp-1 max-w-xs">
                          {p.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-zinc-500">{p.sku}</td>
                    <td className="py-4 px-6 text-zinc-500">
                      {typeof p.category === 'object' ? p.category.name : 'Category'}
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(p.price)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          p.stock <= 5
                            ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                        }`}
                      >
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {p.featured && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full mr-1">
                          Featured
                        </span>
                      )}
                      {p.newArrival && (
                        <span className="bg-zinc-100 text-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
                        aria-label="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-500 hover:text-rose-700"
                        aria-label="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 max-w-2xl w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 z-10 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {editingProductId ? 'Edit Product Particulars' : 'Create New Catalog Artifact'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Sculptural Ceramic Vase"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900 cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Inventory Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Main Image URL
                </label>
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Description
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded"
                  />
                  <span>Featured Collection</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="rounded"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestSeller}
                    onChange={(e) => setFormData({ ...formData, bestSeller: e.target.checked })}
                    className="rounded"
                  />
                  <span>Best Seller</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 hover:bg-zinc-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Artifact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
