import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import heroImg from '../assets/images/riwaayat_hero_models_1793388054232.jpg';

interface HeroSectionProps {
  onShopNow: () => void;
  headline?: string;
  subheadline?: string;
}

export function HeroSection({
  onShopNow,
  headline = 'Timeless Tradition, Modern You',
  subheadline = 'Discover premium Pakistani fashion crafted with elegance, comfort and quality.',
}: HeroSectionProps) {
  return (
    <section className="relative w-full bg-[#121212] text-white">
      {/* 
        Full Unobstructed Models Photography
        Both Pakistani models in shalwar kameez and footwear are clearly visible with zero text overlay covering them.
      */}
      <div className="relative w-full overflow-hidden bg-black flex items-center justify-center border-b border-[#D4AF37]/30">
        <div className="w-full max-w-7xl mx-auto">
          <img
            src={heroImg}
            alt="Pakistani Male and Female Fashion Models wearing luxury Shalwar Kameez by Riwaayat Wear"
            className="w-full h-auto max-h-[60vh] sm:max-h-[68vh] md:max-h-[74vh] object-contain sm:object-cover object-center"
            loading="eager"
          />
        </div>
      </div>

      {/* 
        Compact "SHOP NOW" Section Placed Underneath the Models Photo
      */}
      <div className="bg-[#121212] border-b border-[#D4AF37]/20 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle Kicker */}
          <div className="inline-flex items-center justify-center gap-2 mb-2 text-[#D4AF37]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs tracking-[0.25em] uppercase font-semibold">
              Haute Couture & Festive Collection
            </span>
          </div>

          {/* Headline (Compact & Refined) */}
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-normal tracking-wide text-white leading-tight mb-2">
            {headline}
          </h2>

          {/* Subheadline */}
          <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-5 max-w-2xl mx-auto">
            {subheadline}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-6">
            <button
              onClick={onShopNow}
              className="inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-[#D4AF37] hover:bg-[#c49f2e] text-[#121212] text-xs uppercase tracking-[0.2em] font-bold transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer group"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4 ml-1.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            <a
              href="#contact-section"
              className="inline-flex items-center justify-center px-5 sm:px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white/30 hover:border-white text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
            >
              Visit Lahore Atelier
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-neutral-300 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>100% Pure Egyptian Cottons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Master Needlework</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Nationwide Express Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
