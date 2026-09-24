'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Package,
  Truck,
  CheckCircle2,
  X,
  Edit2,
  Loader2,
  Filter,
} from 'lucide-react';
import { api } from '../../../lib/api';
import { Order } from '../../../types';
import { formatCurrency } from '../../../lib/utils';
import { toast } from 'sonner';

const STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [search, setSearch] = useState('');

  // Status update modal
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [note, setNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (selectedStatus) params.set('status', selectedStatus);
      if (search) params.set('search', search);

      const res = await api.get(`/orders/admin/all?${params.toString()}`);
      if (res.data?.success && res.data.data) {
        setOrders(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus, search]);

  const handleOpenStatusModal = (order: Order) => {
    setActiveOrder(order);
    setNewStatus(order.orderStatus);
    setTrackingNumber(order.trackingNumber || '');
    setNote('');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    setIsUpdating(true);
    try {
      const res = await api.put(`/orders/admin/${activeOrder._id}/status`, {
        orderStatus: newStatus,
        trackingNumber,
        note,
      });

      if (res.data?.success) {
        toast.success(`Order ${activeOrder.orderNumber} updated to ${newStatus}`);
        setActiveOrder(null);
        fetchOrders();
      }
    } catch (error: any) {
      toast.error(error.customMessage || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
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
            Order Fulfillment & Dispatch
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Tracking {orders.length} global transactions
          </p>
        </div>

        {/* Filter by Status */}
        <div className="flex items-center gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none cursor-pointer"
          >
            <option value="">All Fulfillment Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 uppercase text-zinc-400 font-bold tracking-wider border-b border-zinc-100 dark:border-zinc-800">
              <tr>
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items</th>
                <th className="py-4 px-6">Total</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Fulfillment</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    Loading order records...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-400">
                    No orders matching this filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40">
                    <td className="py-4 px-6 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                      {order.orderNumber}
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                        {order.shippingAddress?.fullName || 'Customer'}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {order.shippingAddress?.city}, {order.shippingAddress?.country}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-6 text-zinc-600 dark:text-zinc-400">
                      {order.items?.length || 0} artifacts
                    </td>
                    <td className="py-4 px-6 font-bold text-zinc-900 dark:text-zinc-100">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          order.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                          order.orderStatus === 'Delivered'
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(order)}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold text-[11px] flex items-center gap-1.5 ml-auto"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Update Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setActiveOrder(null)}
          />

          <div className="relative bg-white dark:bg-zinc-900 max-w-md w-full rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 z-10 animate-slide-up">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Update Order Status
                </h3>
                <p className="text-xs text-zinc-400 font-mono mt-0.5">
                  {activeOrder.orderNumber}
                </p>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="p-1 text-zinc-400 hover:text-zinc-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Fulfillment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900 cursor-pointer"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Courier Tracking Number (Optional)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. 1Z9999999999999999"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-sm font-mono focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-zinc-600 dark:text-zinc-400 mb-1.5">
                  Timeline Milestone Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Package dispatched via DHL Express"
                  className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl p-3 text-sm focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setActiveOrder(null)}
                  className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-600 hover:bg-zinc-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
                >
                  {isUpdating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Save Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
