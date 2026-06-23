'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Shield, Truck, Lock, ChevronDown, Tag, X } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { api, formatINR } from '@/lib/api';
import { useCartStore } from '@/store/cart-store';
import { useAuthStore } from '@/store/auth-store';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, isLoading, fetchCart, getTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');
  const [form, setForm] = useState({
    firstName: '', lastName: '', line1: '', city: '', state: '', zipCode: '', phone: '',
  });
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const activeItems = items.filter((i) => !i.savedForLater);
  const total = getTotal();
  const shipping = total >= 999 ? 0 : 99;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax - couponDiscount;

  const applyCoupon = async () => {
    const code = couponCode.trim().toUpperCase();
    if (!code) return;
    setCouponLoading(true);
    setCouponError('');
    try {
      const { data } = await api.post('/coupons/validate', {
        code,
        orderValue: total,
      });
      const discount = data.discountAmount || data.discountValue || 0;
      setCouponDiscount(discount);
      setAppliedCoupon(code);
      setCouponCode('');
      toast.success(`Coupon applied! You saved ${formatINR(discount)}`);
    } catch (err: any) {
      setCouponError(err?.response?.data?.message || 'Invalid or expired coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    setCouponError('');
  };

  useEffect(() => {
    if (!isAuthenticated) { router.push('/auth/login'); return; }
    fetchCart();
    api.get('/users/addresses').then(({ data }) => {
      const addrs = data.data || data;
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddress(defaultAddr.id);
      else if (addrs.length > 0) setSelectedAddress(addrs[0].id);
    });
  }, [isAuthenticated, fetchCart, router]);

  useEffect(() => {
    if (!isLoading && activeItems.length === 0) {
      router.replace('/cart');
    }
  }, [isLoading, activeItems.length, router]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      let addressId = selectedAddress;

      // If no saved address, create one
      if (!addressId) {
        const { data: addrData } = await api.post('/users/addresses', {
          firstName: form.firstName || 'Customer',
          lastName: form.lastName || '',
          line1: form.line1 || 'Address',
          city: form.city || 'City',
          state: form.state || 'State',
          zipCode: form.zipCode || '000000',
          phone: form.phone || '',
          isDefault: true,
        });
        const addr = addrData.data || addrData;
        addressId = addr.id;
      }

      const { data } = await api.post('/orders', {
        shippingAddressId: addressId,
        paymentMethod,
        shippingCost: shipping,
        taxAmount: tax,
        couponCode: appliedCoupon || undefined,
      });

      const order = data.data || data;

      if (paymentMethod === 'stripe') {
        try {
          const { data: stripeData } = await api.post(`/payments/stripe/create-intent/${order.id}`);
          toast.success('Payment successful!');
        } catch {
          toast.success('Order placed! (Demo mode)');
        }
      } else if (paymentMethod === 'razorpay') {
        const { data: rzData } = await api.post(`/payments/razorpay/create-order/${order.id}`);
        // Open Razorpay checkout
        const options = {
          key: rzData.key,
          amount: rzData.amount,
          currency: rzData.currency,
          order_id: rzData.razorpayOrderId,
          handler: function () {
            api.post('/payments/razorpay/verify', {
              razorpay_order_id: rzData.razorpayOrderId,
              razorpay_payment_id: 'demo_payment',
              razorpay_signature: 'demo',
            });
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

      router.push(`/checkout/success?order=${order.orderNumber}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return <div className="pt-28 pb-24 max-w-4xl mx-auto px-6 md:px-12">
      <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/30 animate-pulse" />)}</div>
    </div>;
  }

  if (activeItems.length === 0) {
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
            Complete your order
          </h1>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-8 font-heading text-xs tracking-[0.1em] uppercase">
          {[
            { num: 1, label: 'Shipping' },
            { num: 2, label: 'Payment' },
            { num: 3, label: 'Review' },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-medium transition-all duration-300 ${
                step >= s.num ? 'bg-black text-white' : 'bg-black/5 text-gray-400'
              }`}>{s.num}</div>
              <span className={step >= s.num ? 'text-gray-900' : 'text-gray-400'}>{s.label}</span>
              {i < 2 && <ChevronDown className="w-3 h-3 -rotate-90 text-gray-300 mx-1" />}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            {/* Step 1: Shipping Address */}
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="shipping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="border border-black/10 p-6">
                    <h3 className="font-heading font-semibold text-sm tracking-[0.1em] uppercase text-gray-900 mb-4">
                      Shipping Address
                    </h3>
                    {addresses.length > 0 ? (
                      <div className="space-y-2">
                        {addresses.map((addr) => (
                          <label key={addr.id} className={`block border p-4 cursor-pointer transition-all ${
                            selectedAddress === addr.id ? 'border-black bg-black/5' : 'border-black/10 hover:border-black/30'
                          }`}>
                            <input type="radio" name="address" value={addr.id} checked={selectedAddress === addr.id}
                              onChange={(e) => setSelectedAddress(e.target.value)} className="sr-only" />
                            <p className="font-heading font-medium text-sm text-gray-900">{addr.firstName} {addr.lastName}</p>
                            <p className="font-body text-xs text-gray-500 mt-1">{addr.line1}{addr.line2 ? ', ' + addr.line2 : ''}, {addr.city}, {addr.state} {addr.zipCode}</p>
                            {addr.phone && <p className="font-body text-xs text-gray-400 mt-1">{addr.phone}</p>}
                          </label>
                        ))}
                        <button onClick={() => setSelectedAddress('new')} className="btn-ghost text-xs mt-2">
                          + Add New Address
                        </button>
                      </div>
                    ) : null}
                    {addresses.length === 0 || selectedAddress === 'new' ? (
                      <div className="grid grid-cols-2 gap-3">
                        <input className="input-field col-span-2" placeholder="Full Name" value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                        <input className="input-field col-span-2" placeholder="Address Line 1" value={form.line1}
                          onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                        <input className="input-field" placeholder="City" value={form.city}
                          onChange={(e) => setForm({ ...form, city: e.target.value })} />
                        <input className="input-field" placeholder="State" value={form.state}
                          onChange={(e) => setForm({ ...form, state: e.target.value })} />
                        <input className="input-field" placeholder="ZIP Code" value={form.zipCode}
                          onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
                        <input className="input-field" placeholder="Phone" value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                      </div>
                    ) : null}
                    <button
                      onClick={() => setStep(2)}
                      disabled={!selectedAddress}
                      className="btn-primary mt-4 w-full"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <motion.div key="payment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="border border-black/10 p-6">
                    <h3 className="font-heading font-semibold text-sm tracking-[0.1em] uppercase text-gray-900 mb-4">
                      Payment Method
                    </h3>
                    <div className="space-y-2 mb-6">
                      {[
                        { id: 'stripe', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                        { id: 'razorpay', label: 'UPI / Net Banking / Wallet', icon: Shield, desc: 'Google Pay, PhonePe, Paytm' },
                      ].map(({ id, label, icon: Icon, desc }) => (
                        <label key={id} className={`flex items-center gap-3 border p-4 cursor-pointer transition-all ${
                          paymentMethod === id ? 'border-black bg-black/5' : 'border-black/10 hover:border-black/30'
                        }`}>
                          <input type="radio" name="payment" value={id} checked={paymentMethod === id}
                            onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                          <Icon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <div>
                            <span className="font-heading text-sm text-gray-900">{label}</span>
                            <p className="font-body text-[11px] text-gray-400">{desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>

                    <AnimatePresence mode="wait">
                      {paymentMethod === 'stripe' && (
                        <motion.div key="stripe-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="border border-black/10 p-4 space-y-3 bg-black/[0.02]">
                            <h4 className="font-heading text-xs tracking-[0.1em] uppercase text-gray-500 mb-3">Card Details</h4>
                            <input
                              placeholder="Cardholder Name"
                              value={cardDetails.name}
                              onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                              className="input-field"
                            />
                            <input
                              placeholder="Card Number"
                              value={cardDetails.number}
                              onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim() })}
                              className="input-field"
                              maxLength={19}
                            />
                            <div className="grid grid-cols-2 gap-3">
                              <input
                                placeholder="MM / YY"
                                value={cardDetails.expiry}
                                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value.replace(/[^\d/]/g, '').slice(0, 5) })}
                                className="input-field"
                                maxLength={5}
                              />
                              <input
                                placeholder="CVV"
                                type="password"
                                value={cardDetails.cvv}
                                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                                className="input-field"
                                maxLength={4}
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {paymentMethod === 'razorpay' && (
                        <motion.div key="razorpay-form" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="border border-black/10 p-4 space-y-3 bg-black/[0.02]">
                            <h4 className="font-heading text-xs tracking-[0.1em] uppercase text-gray-500 mb-3">UPI Details</h4>
                            <input
                              placeholder="UPI ID (e.g. name@upi)"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              className="input-field"
                            />
                            <p className="font-body text-[11px] text-gray-400">
                              Or pay with Net Banking / Wallet via Razorpay checkout
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setStep(1)} className="btn-secondary flex-1">
                        Back
                      </button>
                      <button onClick={() => setStep(3)} className="btn-primary flex-1">
                        Review Order
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                  <div className="border border-black/10 p-6">
                    <h3 className="font-heading font-semibold text-sm tracking-[0.1em] uppercase text-gray-900 mb-4">
                      Review & Confirm
                    </h3>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-heading text-xs tracking-[0.05em] uppercase text-gray-500">Shipping</span>
                        <button onClick={() => setStep(1)} className="font-body text-[11px] text-gray-900 underline">Edit</button>
                      </div>
                      <div className="border border-black/10 p-3 bg-black/[0.02]">
                        <p className="font-body text-sm text-gray-900">Shipping address selected</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="font-heading text-xs tracking-[0.05em] uppercase text-gray-500">Payment</span>
                        <button onClick={() => setStep(2)} className="font-body text-[11px] text-gray-900 underline">Edit</button>
                      </div>
                      <div className="border border-black/10 p-3 bg-black/[0.02]">
                        <p className="font-body text-sm text-gray-900">
                          {paymentMethod === 'stripe' ? 'Credit / Debit Card' : 'UPI / Net Banking'}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button onClick={() => setStep(2)} className="btn-secondary flex-1">
                        Back
                      </button>
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isProcessing}
                        className="btn-primary flex-1"
                      >
                        {isProcessing ? 'Processing...' : (
                          <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Pay {formatINR(grandTotal)}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary - always visible */}
          <div className="md:col-span-2">
            <div className="border border-black/10 p-6 sticky top-28">
              <h3 className="font-heading font-semibold text-sm tracking-[0.1em] uppercase text-gray-900 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6">
                {activeItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 overflow-hidden bg-black/5 flex-shrink-0">
                      {item.product.images?.[0] && (
                        <Image src={item.product.images[0].url} alt="" width={48} height={48} className="w-full h-full object-cover" />
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

              <div className="space-y-2 mb-4 pb-4 border-b border-black/10">
                <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Subtotal</span><span>{formatINR(total)}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Shipping</span><span>{shipping === 0 ? 'Free' : '₹99'}</span></div>
                <div className="flex justify-between font-body text-sm"><span className="text-gray-500">Tax</span><span>{formatINR(tax)}</span></div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between font-body text-sm text-green-600">
                    <span>Discount</span>
                    <span>-{formatINR(couponDiscount)}</span>
                  </div>
                )}
              </div>

              <div className="mb-4 pb-4 border-b border-black/10">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-green-600" />
                      <span className="font-body text-xs font-medium text-green-700">{appliedCoupon}</span>
                    </div>
                    <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => { setCouponCode(e.target.value); setCouponError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                      className="input-field flex-1 text-xs"
                    />
                    <button
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="btn-primary text-[10px] px-4 whitespace-nowrap"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
                {couponError && (
                  <p className="font-body text-[11px] text-red-500 mt-1">{couponError}</p>
                )}
              </div>

              <div className="flex justify-between font-heading font-semibold text-base mb-6">
                <span>Total</span>
                <span>{formatINR(grandTotal)}</span>
              </div>

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
