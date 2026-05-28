'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard, Shield, Truck, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, formatINR } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading, fetchCart, getTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', line1: '', city: '', state: '', zipCode: '', phone: '',
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchCart();
    api.get('/users/addresses').then(({ data }) => {
      const addrs = data.data || data;
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
    });
  }, [isAuthenticated, fetchCart, router]);

  const activeItems = items.filter((i) => !i.savedForLater);
  const total = getTotal();
  const grandTotal = total + (total >= 999 ? 0 : 99) + total * 0.18;

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddressId: selectedAddress,
        paymentMethod,
        shippingCost: total >= 999 ? 0 : 99,
        taxAmount: total * 0.18,
      });

      const order = data.data || data;

      if (paymentMethod === 'stripe') {
        const { data: stripeData } = await api.post(`/payments/stripe/create-intent/${order.id}`);
        toast.success('Order placed successfully! (Demo mode)');
        router.push(`/checkout/success?order=${order.orderNumber}`);
      } else {
        toast.success('Order placed successfully!');
        router.push(`/checkout/success?order=${order.orderNumber}`);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 md:px-12">
      <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-2xl bg-white/30 animate-pulse" />)}</div>
    </div>;
  }

  if (activeItems.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <p className="font-heading text-xs font-medium text-glacier-600 tracking-[0.2em] uppercase mb-2">
            Checkout
          </p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold text-gray-900">
            Review your items and proceed to checkout
          </h1>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="glass-surface rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-base text-gray-900 mb-4">
                Shipping Address
              </h3>
              {addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label key={addr.id} className={`block glass-surface rounded-xl p-4 cursor-pointer transition-all ${
                      selectedAddress === addr.id ? 'ring-2 ring-glacier-400' : ''
                    }`}>
                      <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)} className="sr-only" />
                      <p className="font-heading font-medium text-sm text-gray-900">{addr.firstName} {addr.lastName}</p>
                      <p className="font-body text-xs text-gray-500 mt-1">{addr.line1}, {addr.city}, {addr.state} {addr.zipCode}</p>
                      {addr.phone && <p className="font-body text-xs text-gray-400 mt-1">{addr.phone}</p>}
                    </label>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field col-span-2" placeholder="Full Name" />
                  <input className="input-field col-span-2" placeholder="Address Line 1" />
                  <input className="input-field" placeholder="City" />
                  <input className="input-field" placeholder="State" />
                  <input className="input-field" placeholder="ZIP Code" />
                  <input className="input-field" placeholder="Phone" />
                </div>
              )}
            </div>

            <div className="glass-surface rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-base text-gray-900 mb-4">Payment Method</h3>
              <div className="space-y-3">
                {[
                  { id: 'stripe', label: 'Credit/Debit Card', icon: CreditCard },
                  { id: 'razorpay', label: 'UPI / Net Banking', icon: Shield },
                ].map(({ id, label, icon: Icon }) => (
                  <label key={id} className={`flex items-center gap-3 glass-surface rounded-xl p-4 cursor-pointer transition-all ${
                    paymentMethod === id ? 'ring-2 ring-glacier-400' : ''
                  }`}>
                    <input type="radio" name="payment" value={id} checked={paymentMethod === id}
                      onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                    <Icon className="w-5 h-5 text-glacier-600" />
                    <span className="font-body text-sm text-gray-900">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="glass-darker rounded-2xl p-6 sticky top-28">
              <h3 className="font-heading font-semibold text-base text-gray-900 mb-4">Items</h3>
              <div className="space-y-3 mb-6">
                {activeItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-glacier-100/50 flex-shrink-0">
                      {item.product.images?.[0] && (
                        <img src={item.product.images[0].url} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-sm text-gray-900 truncate">{item.product.name}</p>
                      <p className="font-body text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-heading font-medium text-sm text-gray-900">
                      {formatINR((item.variant?.price || item.product.basePrice) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-white/40">
                <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Subtotal</span><span>{formatINR(total)}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Shipping</span><span>{total >= 999 ? 'Free' : '₹99'}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Tax</span><span>{formatINR(total * 0.18)}</span></div>
              </div>
              <div className="flex justify-between font-heading font-semibold text-base mb-6">
                <span>Total</span>
                <span>{formatINR(grandTotal)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || !selectedAddress}
                className="btn-primary w-full text-base py-4 mb-3"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Processing Payment
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Place Order
                  </span>
                )}
              </button>
              <p className="font-body text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                <Shield className="w-3 h-3" />
                Secured with 256-bit encryption
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
