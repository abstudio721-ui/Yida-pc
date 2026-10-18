import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="custom-navy text-white mt-12 py-10 border-t border-blue-900 bg-[#0b132b]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 text-center text-xs text-gray-400 space-y-4">
        <p className="text-sm font-bold text-white uppercase tracking-wider">YIDA COMPUTERS AKOLA</p>
        <p>© 2026 YIDA Computers Akola, Maharashtra. All Rights Reserved. Authorized Sales & Service of Laptops, Desktops, Workstations, and Gaming Peripherals.</p>
        <div className="flex justify-center gap-6">
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: YIDA Computers protects your data with strict confidentiality.'); }} className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service: Genuine products with 1-year manufacturer warranty and store support in Akola.'); }} className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" onClick={(e) => { e.preventDefault(); alert('Support Hotline: +91 9607643461 (Akola Store)'); }} className="hover:text-white transition-colors">Support</a>
          <a href="https://wa.me/919607643461" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-green-400 font-bold">WhatsApp: +91 9607643461</a>
        </div>
      </div>
    </footer>
  );
};
