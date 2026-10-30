import React, { useState } from 'react';
import { X, ShoppingBag, ShieldCheck, Truck, RefreshCw, Ruler, Zap } from 'lucide-react';
import type { Product, ProductColor } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductOrderUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './FloatingWhatsApp';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  onBuyNow: (product: Product, size: string, color: ProductColor) => void;
}

export function ProductModal({
  product,
  onClose,
  onAddToCart,
  onBuyNow,
}: ProductModalProps) {
  if (!product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'M'
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0 ? product.colors[0] : { name: 'Standard', hex: '#111111' }
  );
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColor);
    onClose();
  };

  const whatsappUrl = getProductOrderUrl(product, selectedSize, selectedColor);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/40 flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/80 hover:bg-white text-neutral-800 p-2 rounded-full shadow-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Column */}
        <div className="w-full md:w-1/2 bg-[#F7F4EC] relative min-h-[360px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-top"
          />
          {product.fabric && (
            <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md text-white p-3 text-xs border border-white/20">
              <span className="text-[#D4AF37] font-semibold block uppercase tracking-wider text-[10px]">Fabric Details</span>
              {product.fabric}
            </div>
          )}
        </div>

        {/* Product Info Column */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Category */}
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#997B2C] font-semibold block mb-1">
              {product.category}
            </span>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl text-[#121212] font-semibold mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#121212]">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 font-medium">
                In Stock ({product.stockQuantity} pieces left)
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-5">
                <span className="text-xs uppercase tracking-wider text-neutral-600 font-semibold block mb-2">
                  Select Color: <span className="text-[#121212]">{selectedColor.name}</span>
                </span>
                <div className="flex items-center gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        selectedColor.name === color.name
                          ? 'ring-2 ring-offset-2 ring-[#121212] scale-110'
                          : 'border-black/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs uppercase tracking-wider text-neutral-600 font-semibold">
                    Select Size: <span className="text-[#121212]">{selectedSize}</span>
                  </span>
                  <button
                    onClick={() => setShowSizeChart(!showSizeChart)}
                    className="text-xs text-[#997B2C] hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>{showSizeChart ? 'Hide Size Chart' : 'View Size Chart'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                        selectedSize === size
                          ? 'bg-[#121212] text-white border-[#121212]'
                          : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {/* Pakistani Traditional Size Chart */}
                {showSizeChart && (
                  <div className="mt-3 p-3 bg-neutral-50 border border-neutral-200 text-xs">
                    <p className="font-semibold text-neutral-800 mb-2">Pakistani Standard Sizing (Inches):</p>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-500 text-[11px]">
                          <th className="py-1">Size</th>
                          <th className="py-1">Chest</th>
                          <th className="py-1">Kameez Length</th>
                          <th className="py-1">Shoulder</th>
                          <th className="py-1">Shalwar Length</th>
                        </tr>
                      </thead>
                      <tbody className="text-neutral-700">
                        <tr className="border-b border-neutral-100">
                          <td className="py-1 font-semibold">S</td>
                          <td>38"</td>
                          <td>40"</td>
                          <td>17.5"</td>
                          <td>39"</td>
                        </tr>
                        <tr className="border-b border-neutral-100">
                          <td className="py-1 font-semibold">M</td>
                          <td>40"</td>
                          <td>42"</td>
                          <td>18.5"</td>
                          <td>40"</td>
                        </tr>
                        <tr className="border-b border-neutral-100">
                          <td className="py-1 font-semibold">L</td>
                          <td>43"</td>
                          <td>43"</td>
                          <td>19.5"</td>
                          <td>41"</td>
                        </tr>
                        <tr>
                          <td className="py-1 font-semibold">XL</td>
                          <td>46"</td>
                          <td>44"</td>
                          <td>20.5"</td>
                          <td>42"</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-4 border-t border-neutral-200">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-white border border-[#121212] hover:bg-neutral-50 text-[#121212] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{added ? 'Added to Cart ✓' : 'Add to Cart'}</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3 px-4 bg-[#121212] hover:bg-neutral-800 text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#D4AF37]" />
                <span>Buy Now</span>
              </button>
            </div>

            {/* Official WhatsApp Order */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs uppercase tracking-wider font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span>Order via WhatsApp (+923210424424)</span>
            </a>

            {/* Trust points */}
            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2">
              <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-[#D4AF37]" /> Express Delivery</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" /> 100% Authentic Fabric</span>
              <span className="flex items-center gap-1"><RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" /> Easy 7-Day Exchange</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
