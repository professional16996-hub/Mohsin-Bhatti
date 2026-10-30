import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl border border-[#D4AF37]/30 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2 text-[#997B2C]">
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] uppercase tracking-[0.25em] font-semibold">
            Privacy & Trust
          </span>
        </div>

        <h2 className="font-serif text-2xl font-semibold text-[#121212] mb-4">
          RIWAAYAT WEAR Privacy Policy
        </h2>

        <div className="space-y-4 text-xs text-neutral-600 leading-relaxed">
          <p>
            At <strong>RIWAAYAT WEAR</strong> ("we", "our", or "us"), we value your privacy and are committed to safeguarding personal information collected through our official website and WhatsApp channels.
          </p>

          <h3 className="font-serif text-sm font-bold text-neutral-800 pt-2">
            1. Information We Collect
          </h3>
          <p>
            When you place an order, make an inquiry, or interact with our WhatsApp customer service, we collect details necessary to fulfill your request:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customer Name</li>
            <li>Contact Phone / WhatsApp Number</li>
            <li>Delivery Address and City in Pakistan</li>
            <li>Ordered items, sizes, and color selections</li>
            <li>Tailoring measurement preferences and notes</li>
          </ul>

          <h3 className="font-serif text-sm font-bold text-neutral-800 pt-2">
            2. How We Use Your Information
          </h3>
          <p>
            Your information is exclusively used to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Process, stitch, and deliver your orders via our trusted courier partners across Pakistan (TCS, Leopards, Call Courier).</li>
            <li>Send order confirmation, dispatch notifications, and tracking numbers via WhatsApp (+923210424424) or SMS.</li>
            <li>Provide customer support, size guidance, and custom stitching consultations.</li>
          </ul>

          <h3 className="font-serif text-sm font-bold text-neutral-800 pt-2">
            3. WhatsApp Communication
          </h3>
          <p>
            When you choose to order or communicate via our official WhatsApp (+923210424424), your messages are end-to-end encrypted according to WhatsApp's standard security protocols. We never share your telephone number with unauthorized third parties.
          </p>

          <h3 className="font-serif text-sm font-bold text-neutral-800 pt-2">
            4. Data Security & Storage
          </h3>
          <p>
            All records are stored securely on persistent server infrastructure. We do not store sensitive payment card details; for Cash on Delivery (COD) orders, payment is handled securely upon physical delivery of your parcel.
          </p>

          <h3 className="font-serif text-sm font-bold text-neutral-800 pt-2">
            5. Contact Our Privacy Team
          </h3>
          <p>
            For any inquiries regarding data protection or order records, you can reach out to our Lahore atelier:
            <br />
            <strong>RIWAAYAT WEAR</strong><br />
            Science College, Wahdat Road, Lahore, Pakistan<br />
            WhatsApp: 03210424424
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#121212] text-white text-xs uppercase tracking-wider font-semibold hover:bg-neutral-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
