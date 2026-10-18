import React, { useState } from 'react';
import { Product } from '../types';

interface CatalogViewProps {
  products: Product[];
  searchQuery: string;
  initialCategory?: string;
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail', productId?: string) => void;
  onAddToCart: (product: Product) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  products,
  searchQuery,
  initialCategory,
  onNavigate,
  onAddToCart,
}) => {
  const [inStockOnly, setInStockOnly] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['ASUS', 'Lenovo', 'HP', 'MSI', 'Dell']);
  const [maxPrice, setMaxPrice] = useState(180000);
  const [sortBy, setSortBy] = useState('Popularity');
  const [selectedRam, setSelectedRam] = useState('16GB');

  const formatINR = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (inStockOnly && !p.inStock) return false;
    if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand) && p.brand !== 'YIDA Custom') return false;
    if (p.price > maxPrice) return false;
    if (initialCategory && p.category !== initialCategory && initialCategory !== 'offers') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchDesc) return false;
    }
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col w-full text-gray-800">
        {/* Breadcrumb and Top Stats bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-4 mb-6 gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="cursor-pointer hover:underline" onClick={() => onNavigate('home')}>Home</span>
            <span>/</span>
            <span>Catalog</span>
            <span>/</span>
            <span className="text-gray-900 font-bold">Laptops & Desktops</span>
            {initialCategory && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] uppercase font-bold">{initialCategory}</span>}
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <span className="text-xs text-gray-500">Showing <strong className="text-gray-900">{filteredProducts.length}</strong> of <strong className="text-gray-900">{products.length}</strong> products</span>
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
              <span className="text-xs text-gray-500 font-semibold uppercase">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-medium text-gray-800 focus:outline-none cursor-pointer"
              >
                <option>Popularity</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Layout Grid (Sidebar + Product Catalog) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          {/* LEFT SIDEBAR: Advanced Filters */}
          <aside className="lg:col-span-1 bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-filter text-blue-600"></i> Filters
              </h2>
              <button
                onClick={() => {
                  setInStockOnly(false);
                  setSelectedBrands(['ASUS', 'Lenovo', 'HP', 'MSI', 'Dell']);
                  setMaxPrice(180000);
                }}
                className="text-xs text-blue-600 hover:underline font-semibold uppercase bg-transparent border-none cursor-pointer"
              >
                Reset All
              </button>
            </div>

            {/* Availability Filter */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase">Availability</h3>
              <label className="flex items-center gap-3 cursor-pointer select-none text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                />
                <span>In Stock Only <span className="text-xs text-gray-400">({products.filter(p => p.inStock).length})</span></span>
              </label>
            </div>

            {/* Brand Filter */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase">Brands</h3>
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                {['ASUS', 'Lenovo', 'HP', 'MSI', 'Dell'].map((brand) => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase">Price Range (₹)</h3>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="30000"
                  max="180000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>₹30,000</span>
                <span className="font-bold text-gray-900">Up to {formatINR(maxPrice)}</span>
              </div>
            </div>

            {/* RAM Filter */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-800 uppercase">RAM Capacity</h3>
              <div className="flex flex-wrap gap-2">
                {['8GB', '16GB', '32GB'].map((ram) => (
                  <button
                    key={ram}
                    onClick={() => setSelectedRam(ram)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${selectedRam === ram ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {ram}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* MAIN PRODUCT CATALOG AREA */}
          <main className="lg:col-span-3 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group border border-gray-200"
                >
                  {prod.discount && (
                    <span className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                      {prod.discount}
                    </span>
                  )}
                  {prod.badge && !prod.discount && (
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded z-10">
                      {prod.badge}
                    </span>
                  )}
                  <button
                    onClick={() => alert(`Added ${prod.name} to wishlist`)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-base z-10 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    <i className="fa-regular fa-heart"></i>
                  </button>

                  <div
                    onClick={() => onNavigate('detail', prod.id)}
                    className="w-full h-48 overflow-hidden rounded-lg mb-4 bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="object-contain h-full w-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="flex flex-col flex-grow gap-2">
                    <span className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">
                      {prod.brand} • {prod.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                    <h3
                      onClick={() => onNavigate('detail', prod.id)}
                      className="text-sm font-bold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600"
                    >
                      {prod.name}
                    </h3>
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 space-y-1 my-1">
                      {prod.specs.processor && <p className="truncate"><i className="fa-solid fa-microchip text-blue-600 mr-1.5"></i> {prod.specs.processor}</p>}
                      {prod.specs.ram && <p className="truncate"><i className="fa-solid fa-memory text-blue-600 mr-1.5"></i> {prod.specs.ram} {prod.specs.storage ? `| ${prod.specs.storage}` : ''}</p>}
                      {prod.specs.graphics && <p className="truncate"><i className="fa-solid fa-desktop text-blue-600 mr-1.5"></i> {prod.specs.graphics}</p>}
                    </div>
                    <div className="flex items-baseline gap-2 mt-auto pt-2">
                      <span className="text-base font-black text-gray-900">{formatINR(prod.price)}</span>
                      {prod.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatINR(prod.originalPrice)}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <i className="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                    <a
                      href={`https://wa.me/919888888888?text=${encodeURIComponent(`Hello YIDA Computers, I want to order ${prod.name} for ${formatINR(prod.price)}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm no-underline"
                    >
                      <i className="fa-brands fa-whatsapp text-sm"></i> WhatsApp
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between py-4 px-4 bg-white rounded-xl mt-4 border border-gray-200 shadow-sm">
              <span className="text-xs text-gray-500">Page <strong>1</strong> of <strong>6</strong></span>
              <div className="flex items-center gap-1 text-xs">
                <button className="px-3 py-1.5 bg-gray-100 text-gray-400 rounded cursor-not-allowed font-medium" disabled>Previous</button>
                <button className="px-3 py-1.5 bg-blue-600 text-white rounded font-medium">1</button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors">2</button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors">3</button>
                <span className="text-gray-400 px-1">...</span>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors">6</button>
                <button className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-medium transition-colors">Next</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </main>
  );
};
