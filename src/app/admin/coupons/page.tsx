'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  ArrowLeft,
  Tag,
  Check,
  X,
  Loader2,
  Calendar,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Coupon } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 15,
    minimumOrderAmount: 50,
    maximumDiscount: 50,
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    usageLimit: 500,
    perUserLimit: 1,
    isActive: true,
  });

  const fetchCoupons = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/coupons');
      if (res.data?.success && res.data.data) {
        setCoupons(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load coupons:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this coupon?')) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data?.success) {
        toast.success('Coupon removed');
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to delete coupon');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await api.post('/coupons', {
        ...formData,
        code: formData.code.toUpperCase(),
        discountValue: Number(formData.discountValue),
        minimumOrderAmount: Number(formData.minimumOrderAmount),
        maximumDiscount: formData.maximumDiscount ? Number(formData.maximumDiscount) : undefined,
        usageLimit: Number(formData.usageLimit),
        perUserLimit: Number(formData.perUserLimit),
      });

      if (res.data?.success) {
        toast.success(`Coupon ${formData.code} activated`);
        setIsModalOpen(false);
        fetchCoupons();
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to create coupon');
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
            Promotional Coupons & Campaigns
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Manage active store discount incentives and redemption caps
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 uppercase text-zinc-400 font-bold tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-4 px-6">Coupon Code</th>
                <th className="py-4 px-6">Benefit</th>
                <th className="py-4 px-6">Min Order</th>
                <th className="py-4 px-6">Expiry Date</th>
                <th className="py-4 px-6">Redemptions</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    Loading coupon catalog...
                  </td>
                </tr>
              ) : coupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-400">
                    No active promotional coupons.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-4 px-6 font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                      {c.code}
                    </td>
                    <td className="py-4 px-6 font-semibold text-emerald-600 dark:text-emerald-400">
                      {c.discountType === 'percentage'
                        ? `${c.discountValue}% OFF`
                        : `${formatCurrency(c.discountValue)} OFF`}
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      {formatCurrency(c.minimumOrderAmount || 0)}
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      {new Date(c.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400 font-mono">
                      {c.usedCount} / {c.usageLimit || '∞'}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          c.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-zinc-100 text-zinc-400'
                        }`}
                      >
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDeleteCoupon(c._id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-500"
                        aria-label="Delete coupon"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative bg-white dark:bg-zinc-900 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                New Promotion Code
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                  Coupon Code
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. VIP25"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-sm font-mono uppercase focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({ ...formData, discountType: e.target.value as any })
                    }
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-xs focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Dollar ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Value ({formData.discountType === 'percentage' ? '%' : '$'})
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    value={formData.minimumOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minimumOrderAmount: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-zinc-50 dark:bg-zinc-800 border rounded-xl p-3 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
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
                  Create Promotion
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
