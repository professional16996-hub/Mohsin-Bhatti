import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from 'lucide-react';
import type { CartItem } from '../types';
import { formatPrice } from '../utils/currency';
import { getCartCheckoutWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './FloatingWhatsApp';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
}: CartDrawerProps) {
  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const freeShippingThreshold = 5000;
  const shippingFee = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 250;
  const total = subtotal + shippingFee;

  const handleQuickWhatsAppCheckout = () => {
    const dummyOrder = {
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
      customerName: '[Customer Name]',
      phone: '[Customer Phone]',
      address: '[Delivery Address]',
      city: 'Lahore',
    };
    const url = getCartCheckoutWhatsAppUrl(dummyOrder);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#D4AF37]/30 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between bg-[#FDFBF7]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#121212]" />
              <h2 className="font-serif text-lg tracking-wider uppercase font-semibold text-[#121212]">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-neutral-500 hover:text-black transition-colors rounded-full hover:bg-neutral-100"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping banner */}
          <div className="bg-[#121212] text-white px-5 py-2.5 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              <span>
                {subtotal >= freeShippingThreshold
                  ? 'You unlocked FREE delivery across Pakistan!'
                  : `Add ${formatPrice(freeShippingThreshold - subtotal)} more for FREE delivery`}
              </span>
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-neutral-500">
                <ShoppingBag className="w-16 h-16 text-neutral-300 stroke-1 mb-4" />
                <h3 className="font-serif text-lg text-[#121212] font-semibold mb-1">Your bag is empty</h3>
                <p className="text-xs text-neutral-500 mb-6 max-w-xs">
                  Discover our timeless Pakistani shalwar kameez and bespoke festive attire.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-widest font-semibold hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover object-top border border-neutral-200 bg-neutral-50 shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-sm font-semibold text-[#121212] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span>Size: <strong className="text-neutral-800">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          Color: 
                          <span 
                            className="w-2.5 h-2.5 rounded-full border border-black/20 inline-block"
                            style={{ backgroundColor: item.selectedColor.hex }}
                          />
                          <strong className="text-neutral-800">{item.selectedColor.name}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity selector */}
                      <div className="flex items-center border border-neutral-300">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 py-1 text-xs font-semibold text-neutral-900 min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-neutral-600 hover:bg-neutral-100 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-sm font-bold text-[#121212]">
                        {formatPrice(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout CTAs */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-200 bg-[#FDFBF7] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery across Pakistan</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#121212] pt-2 border-t border-neutral-200">
                  <span>Total</span>
                  <span className="text-[#121212]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Primary Website Checkout */}
              <button
                onClick={onProceedCheckout}
                className="w-full py-3.5 bg-[#121212] hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>

              {/* Direct WhatsApp Order */}
              <button
                onClick={handleQuickWhatsAppCheckout}
                className="w-full py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4" />
                <span>Instant Order via WhatsApp</span>
              </button>

              <p className="text-[10px] text-neutral-400 text-center tracking-wide">
                Cash on Delivery Available Nationwide · Dispatched from Lahore
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
