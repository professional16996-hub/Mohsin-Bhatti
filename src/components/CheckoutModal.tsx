import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, Truck, ShoppingBag, ArrowRight } from 'lucide-react';
import type { CartItem, Order } from '../types';
import { formatPrice } from '../utils/currency';
import { getCartCheckoutWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './FloatingWhatsApp';

import { api } from '../utils/apiClient';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: (order: Order) => void;
  onClearCart: () => void;
}

const PAKISTANI_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Bahawalpur',
  'Sargodha',
  'Abbottabad',
  'Sukkur',
  'Hyderabad',
  'Other City',
];

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
  onClearCart,
}: CheckoutModalProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 5000;
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 250;
  const total = subtotal + shippingFee;

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Lahore');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Cash on Delivery' | 'Bank Transfer'>('Cash on Delivery');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const submitOrder = async (orderViaWhatsApp = false) => {
    if (!customerName.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      setErrorMessage('Please fill in your name, contact phone number, address and city.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const payload = {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        notes: notes.trim(),
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          price: i.product.price,
          size: i.selectedSize,
          color: i.selectedColor.name,
          quantity: i.quantity,
          image: i.product.image,
        })),
        subtotal,
        shippingFee,
        total,
        paymentMethod: (orderViaWhatsApp ? 'WhatsApp Checkout' : paymentMethod) as any,
      };

      const createdOrder: Order = await api.createOrder(payload);
      setConfirmedOrder(createdOrder);
      onOrderSuccess(createdOrder);
      onClearCart();

      if (orderViaWhatsApp) {
        const whatsappUrl = getCartCheckoutWhatsAppUrl(createdOrder);
        window.open(whatsappUrl, '_blank');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
          aria-label="Close checkout"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedOrder ? (
          /* Confirmation Screen */
          <div className="text-center py-6 space-y-5">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#121212]">
              Order Placed Successfully!
            </h2>

            <div className="bg-[#FDFBF7] p-4 border border-[#D4AF37]/30 text-left max-w-md mx-auto text-xs space-y-2">
              <div className="flex justify-between border-b pb-2">
                <span className="text-neutral-500">Order Reference:</span>
                <span className="font-mono font-bold text-[#121212]">{confirmedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Customer:</span>
                <span className="font-semibold text-neutral-800">{confirmedOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Contact:</span>
                <span>{confirmedOrder.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping To:</span>
                <span className="text-right max-w-[200px] truncate">{confirmedOrder.address}, {confirmedOrder.city}</span>
              </div>
              <div className="flex justify-between pt-2 border-t font-bold text-sm">
                <span>Total Amount:</span>
                <span className="text-[#121212]">{formatPrice(confirmedOrder.total)}</span>
              </div>
            </div>

            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              Shukriya for choosing <strong>RIWAAYAT WEAR</strong>. Our tailoring and fulfillment team at Science College, Wahdat Road, Lahore is preparing your parcel.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <a
                href={getCartCheckoutWhatsAppUrl(confirmedOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-[#121212] hover:bg-neutral-800 text-white text-xs uppercase tracking-wider font-semibold"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div className="mb-6 border-b pb-3">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#997B2C] font-semibold">
                Riwaayat Wear Checkout
              </span>
              <h2 className="font-serif text-2xl text-[#121212] font-semibold">
                Shipping & Order Information
              </h2>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitOrder(false);
              }}
              className="space-y-4"
            >
              {/* Customer Name */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Bilal Khan"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                />
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0321-0424424"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="customer@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Complete Street / House Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="House #, Street #, Sector / Area"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                />
              </div>

              {/* City Selection */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  City *
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] bg-white text-[#121212]"
                >
                  {PAKISTANI_CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Delivery Notes */}
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Special Tailoring or Delivery Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Call before delivery, custom length requests, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                />
              </div>

              {/* Payment Method */}
              <div className="pt-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash on Delivery')}
                    className={`p-3 text-left border transition-all text-xs ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-[#121212] bg-[#FDFBF7] ring-1 ring-[#121212]'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-[#121212] block">Cash on Delivery (COD)</span>
                    <span className="text-[11px] text-neutral-500">Pay when your order arrives</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-3 text-left border transition-all text-xs ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-[#121212] bg-[#FDFBF7] ring-1 ring-[#121212]'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span className="font-bold text-[#121212] block">Bank Transfer</span>
                    <span className="text-[11px] text-neutral-500">Direct account transfer</span>
                  </button>
                </div>
              </div>

              {/* Order Summary Strip */}
              <div className="mt-4 p-4 bg-[#FDFBF7] border border-[#D4AF37]/30 space-y-1 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Items Total ({items.reduce((s, i) => s + i.quantity, 0)}):</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping across Pakistan:</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#121212] pt-1 border-t border-neutral-200">
                  <span>Payable Total:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Submission CTAs */}
              <div className="space-y-2.5 pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#121212] hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>{isSubmitting ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
                </button>

                {/* Submit through WhatsApp */}
                <button
                  type="button"
                  onClick={() => submitOrder(true)}
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60"
                >
                  <WhatsAppIcon className="w-4 h-4" />
                  <span>Submit Order via WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
