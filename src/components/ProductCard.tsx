import React, { useState } from 'react';
import { ShoppingBag, Eye, Check, ExternalLink, Zap } from 'lucide-react';
import type { Product, ProductColor } from '../types';
import { formatPrice } from '../utils/currency';
import { getProductOrderUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './FloatingWhatsApp';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size: string, color: ProductColor) => void;
  onBuyNow: (product: Product, size: string, color: ProductColor) => void;
  onQuickView: (product: Product) => void;
}

export function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  onQuickView,
}: ProductCardProps) {
  // Local state for customer selection
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Standard'
  );
  const [selectedColor, setSelectedColor] = useState<ProductColor>(
    product.colors && product.colors.length > 0
      ? product.colors[0]
      : { name: 'Standard', hex: '#111111' }
  );
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor);
    setIsAddedFeedback(true);
    setTimeout(() => setIsAddedFeedback(false), 1800);
  };

  const handleBuyNow = () => {
    onBuyNow(product, selectedSize, selectedColor);
  };

  const whatsappOrderUrl = getProductOrderUrl(product, selectedSize, selectedColor);

  return (
    <div className="group bg-white border border-[#E7E2D8] hover:border-[#D4AF37] transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-md">
      {/* Product Image Container */}
      <div className="relative aspect-[3/4] bg-[#F7F4EC] overflow-hidden cursor-pointer" onClick={() => onQuickView(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-[#121212] text-[#D4AF37] border border-[#D4AF37]/40 text-[10px] tracking-widest uppercase font-semibold px-2 py-0.5 shadow-sm">
              New Arrival
            </span>
          )}
          {product.isBestSeller && (
            <span className="bg-[#D4AF37] text-[#121212] text-[10px] tracking-widest uppercase font-bold px-2 py-0.5 shadow-sm">
              Best Seller
            </span>
          )}
        </div>

        {/* Quick View Overlay Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-[#121212] p-2.5 rounded-full shadow-md transition-all duration-200 opacity-90 sm:opacity-0 group-hover:opacity-100 hover:scale-110"
          aria-label={`Quick view ${product.name}`}
          title="Quick View"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Fabric label at image bottom */}
        {product.fabric && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-2.5 pt-6 text-white text-[11px] font-medium tracking-wide truncate">
            {product.fabric}
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        {/* Category & Rating */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5">
          <span className="uppercase tracking-widest text-[11px] text-[#8C712E] font-medium truncate">
            {product.category}
          </span>
          {product.rating && (
            <span className="text-[11px] font-medium text-neutral-600 flex items-center gap-1">
              ★ {product.rating} <span className="text-neutral-400">({product.reviewsCount || 12})</span>
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3 
          onClick={() => onQuickView(product)}
          className="font-serif text-base sm:text-lg text-[#121212] font-semibold tracking-wide mb-2 line-clamp-1 hover:text-[#D4AF37] cursor-pointer transition-colors"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price Section */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base sm:text-lg font-bold text-[#121212] tracking-tight">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Product Description */}
        <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
          {product.description}
        </p>

        {/* Available Colors Selector */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-3.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] tracking-wider uppercase text-neutral-500 font-medium">
                Color: <strong className="text-[#121212] font-semibold">{selectedColor.name}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.map((color, index) => {
                const isSelected = selectedColor.name === color.name;
                return (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer relative ${
                      isSelected 
                        ? 'ring-2 ring-offset-2 ring-[#121212] border-white scale-110' 
                        : 'border-black/20 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Select color ${color.name}`}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Available Sizes Selector */}
        {product.sizes && product.sizes.length > 0 && (
          <div className="mb-5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] tracking-wider uppercase text-neutral-500 font-medium">
                Select Size: <strong className="text-[#121212] font-semibold">{selectedSize}</strong>
              </span>
              <button 
                onClick={() => onQuickView(product)}
                className="text-[10px] text-[#997B2C] hover:underline"
              >
                Size Guide
              </button>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[34px] px-2 py-1 text-xs font-medium uppercase tracking-wider transition-all duration-150 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#121212] text-white border-[#121212]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#121212]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Interactive Action Buttons */}
        <div className="mt-auto space-y-2 pt-2 border-t border-neutral-100">
          {/* Add to Cart & Buy Now Grid */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              className={`w-full py-2.5 px-2 text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 border cursor-pointer ${
                isAddedFeedback
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white hover:bg-neutral-50 text-[#121212] border-[#121212]'
              }`}
            >
              {isAddedFeedback ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              className="w-full py-2.5 px-2 text-xs font-semibold tracking-wider uppercase bg-[#121212] hover:bg-[#2a2a2a] text-white transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Buy Now</span>
            </button>
          </div>

          {/* Official WhatsApp Order Now Option */}
          <a
            href={whatsappOrderUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/40 text-[#075E54] hover:text-[#05463E] text-xs font-semibold tracking-wide rounded-none transition-colors flex items-center justify-center gap-2"
            title="Order directly via WhatsApp chat"
          >
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Order Now</span>
          </a>
        </div>
      </div>
    </div>
  );
}
