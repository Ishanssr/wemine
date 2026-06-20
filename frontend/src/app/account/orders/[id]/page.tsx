'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { api, formatINR } from '@/lib/api';
import type { Order } from '@/types';

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  PENDING: { icon: Package, color: 'text-yellow-600 bg-yellow-100', label: 'Pending' },
  CONFIRMED: { icon: CheckCircle, color: 'text-blue-600 bg-blue-100', label: 'Confirmed' },
  PROCESSING: { icon: Package, color: 'text-purple-600 bg-purple-100', label: 'Processing' },
  SHIPPED: { icon: Truck, color: 'text-glacier-600 bg-glacier-100', label: 'Shipped' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-600 bg-green-100', label: 'Delivered' },
  CANCELLED: { icon: XCircle, color: 'text-red-600 bg-red-100', label: 'Cancelled' },
};

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await api.get(`/orders/${id}`);
      return (res.data.data || res.data) as Order;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-white/30 rounded-lg animate-pulse" />
        <div className="h-64 rounded-2xl bg-white/30 animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="font-body text-gray-400">Order not found</p>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.PENDING;
  const StatusIcon = status.icon;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <button onClick={() => router.back()} className="btn-ghost mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="glass-surface rounded-2xl p-6 md:p-8 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="font-heading font-semibold text-lg text-gray-900">{order.orderNumber}</p>
            <p className="font-body text-sm text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            {status.label}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <p className="font-heading text-sm font-medium text-gray-900 mb-3">Items ({order.items?.length})</p>
          {order.items?.map((item) => (
            <div key={item.id} className="flex items-center gap-4 py-3 border-b border-white/40 last:border-0">
              <div className="w-16 h-16 rounded-xl bg-glacier-100/50 overflow-hidden flex-shrink-0">
                {item.imageUrl && <Image src={item.imageUrl} alt="" width={64} height={64} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm text-gray-900 truncate">{item.name}</p>
                <p className="font-body text-xs text-gray-400">SKU: {item.sku} | Qty: {item.quantity}</p>
              </div>
              <span className="font-heading font-medium text-sm whitespace-nowrap">{formatINR(item.total)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/40">
          <div>
            <p className="font-body text-xs text-gray-400 mb-1">Subtotal</p>
            <p className="font-heading font-medium text-sm">{formatINR(order.subtotal)}</p>
          </div>
          <div>
            <p className="font-body text-xs text-gray-400 mb-1">Shipping</p>
            <p className="font-heading font-medium text-sm">{order.shippingCost === 0 ? 'FREE' : formatINR(order.shippingCost)}</p>
          </div>
          {order.taxAmount > 0 && (
            <div>
              <p className="font-body text-xs text-gray-400 mb-1">Tax (GST)</p>
              <p className="font-heading font-medium text-sm">{formatINR(order.taxAmount)}</p>
            </div>
          )}
          {order.discountAmount > 0 && (
            <div>
              <p className="font-body text-xs text-gray-400 mb-1">Discount</p>
              <p className="font-heading font-medium text-sm text-green-600">-{formatINR(order.discountAmount)}</p>
            </div>
          )}
          <div className="col-span-2 pt-3 border-t border-white/40 flex justify-between">
            <p className="font-heading font-semibold text-sm text-gray-900">Total</p>
            <p className="font-heading font-semibold text-base">{formatINR(order.total)}</p>
          </div>
        </div>
      </div>

      {order.shippingAddress && (
        <div className="glass-surface rounded-2xl p-6">
          <p className="font-heading text-sm font-medium text-gray-900 mb-3">Shipping Address</p>
          <p className="font-body text-sm text-gray-700">
            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
          </p>
          <p className="font-body text-xs text-gray-500">
            {order.shippingAddress.line1}
            {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ''}
          </p>
          <p className="font-body text-xs text-gray-500">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
          </p>
          {order.shippingAddress.phone && (
            <p className="font-body text-xs text-gray-400 mt-1">Phone: {order.shippingAddress.phone}</p>
          )}
        </div>
      )}
    </motion.div>
  );
}
