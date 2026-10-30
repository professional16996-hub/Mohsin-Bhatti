import React from 'react';
import { Award, Feather, HeartHandshake, Scissors } from 'lucide-react';
import heroImg from '../assets/images/riwaayat_hero_models_1793388054232.jpg';

export function AboutSection() {
  return (
    <section id="about-section" className="py-20 bg-[#FDFBF7] border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Story Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image side */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] bg-neutral-200 border border-[#D4AF37]/40 shadow-xl overflow-hidden relative">
              <img
                src={heroImg}
                alt="Riwaayat Wear Artisanal Tailoring"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white text-center">
                <span className="font-serif italic text-lg sm:text-xl block text-[#D4AF37]">
                  "Crafting Pakistani Heritage since Inception"
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-300">
                  Lahore · Science College, Wahdat Road
                </span>
              </div>
            </div>
            
            {/* Decorative frame accent */}
            <div className="hidden sm:block absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-[#D4AF37] pointer-events-none" />
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-24 h-24 border-b-2 border-r-2 border-[#D4AF37] pointer-events-none" />
          </div>

          {/* Narrative side */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-[#997B2C] font-semibold block mb-2">
                Our Heritage & Philosophy
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#121212] tracking-wide leading-tight mb-4">
                Timeless Tradition, Modern Style.
              </h2>
            </div>

            <p className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              At <strong>RIWAAYAT WEAR</strong>, we believe Pakistani clothing is more than just fabric—it is an art form rooted in centuries of Mughal grandeur, imperial aesthetics, and regional master craftsmanship.
            </p>

            <p className="text-sm text-neutral-600 leading-relaxed">
              Based in Lahore at Science College, Wahdat Road, our atelier specializes in traditional and modern shalwar kameez for both men and women. We source only the finest fabrics: liquid-finished Egyptian cottons, pure Jamawar brocades, raw silks, and delicate luxury chiffons. Every collar, cuff, placket, and hem is handcrafted with precision, bringing together timeless heritage and sharp modern silhouettes.
            </p>

            {/* Core Values 4-Grid */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#D4AF37]/20">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#121212]">
                  <Scissors className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-sm">Bespoke Precision</h4>
                </div>
                <p className="text-xs text-neutral-500 leading-normal">
                  Expert pattern makers tailoring sharp collars, comfortable armholes, and graceful drape.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#121212]">
                  <Feather className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-sm">Finest Fabrics</h4>
                </div>
                <p className="text-xs text-neutral-500 leading-normal">
                  High-thread-count Egyptian cottons, wash-and-wear, and pure festive Jamawar silks.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#121212]">
                  <Award className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-sm">Hand Embroideries</h4>
                </div>
                <p className="text-xs text-neutral-500 leading-normal">
                  Intricate zardozi, kora dabka, and tonal thread needlework done by Lahore artisans.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#121212]">
                  <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                  <h4 className="font-serif font-bold text-sm">Personalized Service</h4>
                </div>
                <p className="text-xs text-neutral-500 leading-normal">
                  Direct WhatsApp concierge for measurements, customized styling, and swift nationwide delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
