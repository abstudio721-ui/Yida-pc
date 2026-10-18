import React, { useState } from 'react';
import { Product } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartCount: number;
  cartTotal: number;
  products: Product[];
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail', productId?: string) => void;
  onOpenAccount: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  cartCount,
  cartTotal,
  products,
  onNavigate,
  onOpenAccount,
}) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    setIsFocused(false);
    onNavigate('catalog');
  };

  const formatINR = (amount: number) => {
    return '₹' + amount.toLocaleString('en-IN');
  };

  const matchingSuggestions = products.filter(p => 
    localSearch.trim() && (
      p.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(localSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(localSearch.toLowerCase())
    )
  ).slice(0, 5);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 px-4 lg:px-8 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none"
          onClick={() => onNavigate('home')}
        >
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tight text-blue-600 uppercase">YIDA COMPUTERS</span>
            <span className="text-[9px] font-bold tracking-wider text-gray-500 uppercase">Akola • Laptops | Desktops | Accessories | Sales & Service</span>
          </div>
        </div>

        {/* Search Bar with Suggestions */}
        <div className="flex-1 max-w-xl w-full relative">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <span className="absolute left-3 text-gray-400">
              <i className="fa-solid fa-magnifying-glass"></i>
            </span>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder="Search for laptops, desktops, monitors, accessories..."
              className="w-full pl-10 pr-24 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="submit"
              className="absolute right-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Search Suggestions Dropdown */}
          {isFocused && matchingSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden">
              {matchingSuggestions.map(prod => (
                <div
                  key={prod.id}
                  onClick={() => {
                    setLocalSearch('');
                    onNavigate('detail', prod.id);
                  }}
                  className="flex items-center gap-3 p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-none transition-colors"
                >
                  <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain bg-gray-50 rounded p-1 border" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                    <p className="text-[10px] text-gray-500 uppercase">{prod.brand} • {formatINR(prod.price)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right User Actions */}
        <div className="flex items-center gap-6 text-sm">
          {/* Store Location */}
          <div className="hidden xl:flex items-center gap-2 cursor-pointer">
            <i className="fa-solid fa-location-dot text-blue-600"></i>
            <div className="text-xs">
              <p className="font-bold text-gray-800">Our Store</p>
              <p className="text-gray-500">Akola, Maharashtra</p>
            </div>
          </div>

          {/* WhatsApp */}
          <a
            href="https://wa.me/919607643461?text=Hello%20YIDA%20Computers%20Akola,%20I%20would%20like%20inquiry%20regarding%20laptops%20and%20hardware."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 cursor-pointer text-green-600 hover:text-green-700 transition-colors no-underline"
          >
            <i className="fa-brands fa-whatsapp text-xl"></i>
            <div className="text-xs hidden sm:block">
              <p className="font-bold text-gray-800">WhatsApp</p>
              <p className="text-gray-500">+91 9607643461</p>
            </div>
          </a>

          {/* Account */}
          <div 
            onClick={onOpenAccount}
            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
          >
            <i className="fa-regular fa-user text-lg"></i>
            <div className="text-xs hidden sm:block">
              <p className="font-bold text-gray-800">Account</p>
              <p className="text-gray-500">Login / Register</p>
            </div>
          </div>

          {/* Cart */}
          <div
            onClick={() => onNavigate('cart')}
            className="flex items-center gap-2 cursor-pointer relative hover:text-blue-600 transition-colors"
          >
            <div className="relative">
              <i className="fa-solid fa-cart-shopping text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-xs hidden sm:block">
              <p className="font-bold text-gray-800">Cart</p>
              <p className="text-gray-500">{formatINR(cartTotal)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
