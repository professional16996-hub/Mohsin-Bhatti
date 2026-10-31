import React from 'react';
import { MapPin, Phone, Instagram, Facebook, Globe, Sparkles } from 'lucide-react';
import { DISPLAY_WHATSAPP_NUMBER, createWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './FloatingWhatsApp';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onSelectCategory: (category: string) => void;
  categories: string[];
}

export function Footer({
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onSelectCategory,
  categories,
}: FooterProps) {
  return (
    <footer className="bg-[#121212] text-white border-t border-[#D4AF37]/30 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand & Tagline */}
          <div className="lg:col-span-4 space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl tracking-[0.25em] font-medium text-white uppercase">
              RIWAAYAT WEAR
            </h2>
            <p className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              Timeless Tradition, Modern Style.
            </p>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Luxury Pakistani clothing atelier specializing in authentic men's and women's shalwar kameez, handcrafted Jamawar waistcoats, and premium unstitched couture fabrics.
            </p>
            
            {/* Social media links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37] text-white hover:text-[#121212] flex items-center justify-center transition-colors border border-white/10"
                aria-label="Riwaayat Wear on Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#D4AF37] text-white hover:text-[#121212] flex items-center justify-center transition-colors border border-white/10"
                aria-label="Riwaayat Wear on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href={createWhatsAppUrl('Hello RIWAAYAT WEAR!')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-md"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#D4AF37] font-semibold">
              Collections
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      onSelectCategory(cat);
                      const prodSection = document.getElementById('products-section');
                      if (prodSection) prodSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#D4AF37] transition-colors text-left"
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation & Policies */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#D4AF37] font-semibold">
              Information
            </h3>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Contact & Location
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <span className="text-neutral-500">Nationwide Express Delivery</span>
              </li>
              <li>
                <span className="text-neutral-500">Cash on Delivery (COD)</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Lahore Location */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-serif text-sm uppercase tracking-widest text-[#D4AF37] font-semibold">
              Lahore Atelier
            </h3>
            <div className="space-y-2.5 text-xs text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  Science College, Wahdat Road, Lahore, Pakistan.
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/923210424424`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors font-mono font-bold"
                >
                  WhatsApp: {DISPLAY_WHATSAPP_NUMBER}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} RIWAAYAT WEAR. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-neutral-400">
            <span>Handcrafted in Lahore, Pakistan</span>
            <span>·</span>
            <span className="text-[#D4AF37]">Timeless Tradition, Modern Style</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
