import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from 'lucide-react';
import { DISPLAY_WHATSAPP_NUMBER, createWhatsAppUrl } from '../utils/whatsapp';
import { WhatsAppIcon } from './FloatingWhatsApp';
import { api } from '../utils/apiClient';

export function ContactLocationSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorText, setErrorText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || (!email.trim() && !phone.trim())) {
      setErrorText('Please provide your name, message, and either a phone number or email.');
      return;
    }

    setStatus('submitting');
    setErrorText('');

    try {
      await api.createInquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        subject: subject.trim(),
        message: message.trim(),
      });

      setStatus('success');
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      setStatus('error');
      setErrorText(err.message || 'Error sending message');
    }
  };

  return (
    <section id="contact-section" className="py-16 sm:py-24 bg-[#F7F4EC] border-t border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#997B2C] font-semibold block mb-2">
            Visit & Connect
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#121212] tracking-wide mb-4">
            Contact & Atelier Location
          </h2>
          <p className="text-sm text-neutral-600 leading-relaxed">
            Experience our bespoke tailoring, touch our pure Egyptian cottons and raw silks, or consult our fashion stylists in Lahore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Official Business Details & Map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-white p-6 sm:p-8 border border-[#D4AF37]/30 shadow-sm space-y-6">
              
              {/* Official Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center shrink-0 mt-1">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#121212] mb-1">
                    Store & Atelier Address
                  </h3>
                  <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                    Science College, Wahdat Road, Lahore, Pakistan.
                  </p>
                </div>
              </div>

              {/* Official WhatsApp */}
              <div className="flex items-start gap-4 pt-4 border-t border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 mt-1">
                  <WhatsAppIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#121212] mb-1">
                    Official WhatsApp
                  </h3>
                  <p className="text-sm text-neutral-700 font-mono font-bold text-base">
                    {DISPLAY_WHATSAPP_NUMBER}
                  </p>
                  <p className="text-xs text-neutral-500 mb-2">
                    International: +92 321 0424424
                  </p>
                  <a
                    href={createWhatsAppUrl('Hello RIWAAYAT WEAR, I would like to inquire about your collection.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#25D366] text-white text-xs font-semibold rounded-none hover:bg-[#20bd5a] transition-colors"
                  >
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Atelier Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-neutral-100">
                <div className="w-10 h-10 rounded-full bg-[#121212] text-[#D4AF37] flex items-center justify-center shrink-0 mt-1">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-[#121212] mb-1">
                    Atelier Timings
                  </h3>
                  <p className="text-xs text-neutral-700">
                    Monday – Saturday: 11:00 AM – 10:00 PM
                  </p>
                  <p className="text-xs text-neutral-700">
                    Sunday: 2:00 PM – 10:00 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Nationwide Delivery & Concierge Card (Replacing Map) */}
            <div className="bg-[#121212] text-white p-6 sm:p-7 border border-[#D4AF37]/30 space-y-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#D4AF37] font-semibold block">
                Order & Delivery Assistance
              </span>
              <h4 className="font-serif text-xl font-medium text-white">
                Nationwide Express Dispatch from Lahore
              </h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                All garments are inspected, hand-finished, and securely packaged at our Lahore atelier before being dispatched via insured express courier across Pakistan.
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
                <span>Standard Delivery: 3–5 Business Days</span>
                <span className="text-[#D4AF37] font-semibold">Cash on Delivery (COD)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customer Inquiry Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-10 border border-[#D4AF37]/30 shadow-sm">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#997B2C] font-semibold block mb-1">
              Direct Inquiries
            </span>
            <h3 className="font-serif text-2xl font-semibold text-[#121212] mb-2">
              Send us a Message
            </h3>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
              Have questions regarding custom sizing, wedding orders, or bulk corporate tailoring? Drop us a note and our Lahore atelier will get back to you promptly.
            </p>

            {status === 'success' && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Shukriya! Your message has been received. Our team will respond shortly.</span>
              </div>
            )}

            {errorText && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorText}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Rehman"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                    Phone / WhatsApp *
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
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Custom Stitching or Wedding Order"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider font-semibold text-neutral-700 mb-1">
                  Message Details *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us what you're looking for..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-neutral-300 text-sm focus:outline-none focus:border-[#121212] text-[#121212]"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3.5 bg-[#121212] hover:bg-neutral-800 text-white text-xs uppercase tracking-widest font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>{status === 'submitting' ? 'Sending Message...' : 'Send Inquiry to Lahore Atelier'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
