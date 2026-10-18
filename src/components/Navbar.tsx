import React from 'react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail', category?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  return (
    <nav className="custom-navy text-white shadow-md bg-[#0b132b]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <ul className="flex items-center justify-between overflow-x-auto text-sm py-3 gap-6 whitespace-nowrap scrollbar-none">
          <li>
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                currentView === 'home' ? 'bg-blue-600 text-white' : 'hover:text-blue-400'
              }`}
            >
              <i className="fa-solid fa-house"></i> Home
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'laptops')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Laptops <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'desktops')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Desktops <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'components')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Components <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'monitors')}
              className="hover:text-blue-400 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Monitors
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'gaming')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Gaming <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'accessories')}
              className="hover:text-blue-400 flex items-center gap-1 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Accessories <i className="fa-solid fa-chevron-down text-[10px]"></i>
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'printers')}
              className="hover:text-blue-400 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Printers
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog', 'software')}
              className="hover:text-blue-400 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Software
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('catalog')}
              className="hover:text-blue-400 relative transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Deals <span className="absolute -top-3 -right-4 bg-red-600 text-white text-[9px] font-bold px-1 rounded">HOT</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('YIDA Services: Computer repair, RAM/SSD upgrades, liquid cooling setup, and corporate AMC available at our Nashik & Akola stores.')}
              className="hover:text-blue-400 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => alert('Contact YIDA Computers:\nPhone: +91 98888 88888\nStore: Nashik & Akola, Maharashtra\nEmail: support@yidacomputers.in')}
              className="hover:text-blue-400 transition-colors bg-transparent border-none text-white cursor-pointer"
            >
              Contact
            </button>
          </li>
          <li>
            <button
              onClick={() => onNavigate('admin')}
              className={`flex items-center gap-1 px-3 py-1 rounded font-medium transition-colors ${
                currentView === 'admin' ? 'bg-blue-600 text-white' : 'hover:text-blue-400 text-amber-300'
              }`}
            >
              <i className="fa-solid fa-gauge"></i> Admin Dashboard
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
