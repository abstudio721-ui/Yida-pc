import React, { useState, useEffect } from 'react';
import { Banner, Product } from '../types';

interface HomeViewProps {
  products: Product[];
  banners: Banner[];
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail', productId?: string, category?: string) => void;
  onAddToCart: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ products, banners, onNavigate, onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [inspectingProduct, setInspectingProduct] = useState<Product | null>(null);
  const [explodedView, setExplodedView] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);

  const activeBanners = banners.filter(b => b.isActive && !b.isDraft);
  const heroSlides = activeBanners.length > 0 ? activeBanners : [
    {
      id: 'default-1',
      title: 'FIND YOUR NEXT POWERHOUSE',
      subtitle: 'ASUS ROG & TUF Gaming Series',
      offerText: 'Special Akola Store Offer: Free Gaming Mouse & Backpack with every RTX Laptop.',
      buttonLabel: 'Explore Laptops',
      destinationUrl: 'catalog',
      displayOrder: 1,
      isActive: true,
      isDraft: false,
      placement: 'Hero Carousel' as const,
      image: products[0]?.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmd_uEhfP1SFxIhoyLyFI1buXEuVWO4WOF7cn8ko5C_jim40qyQrskxewW9zem8X-hX9FLkDIPppCEla6QQGh0JDC3CkpRwsse36z4Lf3aFnhl-x9P0cYMpap2FydxxDNbx1Z__HxKf8xjf7APsXBHdfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hjOkTKmchHHf-t9MHTagjFCUCHG-t3TeXwwq3wduzsp2HN78g65e-uU5'
    }
  ];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const formatINR = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  const categories = [
    { name: 'Laptops', icon: 'fa-laptop', cat: 'laptops' },
    { name: 'Desktops', icon: 'fa-desktop', cat: 'desktops' },
    { name: 'Monitors', icon: 'fa-display', cat: 'monitors' },
    { name: 'Components', icon: 'fa-microchip', cat: 'components' },
    { name: 'Accessories', icon: 'fa-headphones', cat: 'accessories' },
    { name: 'Gaming', icon: 'fa-gamepad', cat: 'gaming' },
    { name: 'Printers', icon: 'fa-print', cat: 'printers' },
    { name: 'Software', icon: 'fa-compact-disc', cat: 'software' },
    { name: 'Networking', icon: 'fa-network-wired', cat: 'networking' },
    { name: 'Services', icon: 'fa-screwdriver-wrench', cat: 'services' },
    { name: 'Offers', icon: 'fa-tag', cat: 'offers' },
  ];

  const slide = heroSlides[currentSlide] || heroSlides[0];

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-8">
      {/* 1. HERO SECTION — FULL WIDTH IMMERSIVE SHOWCASE WITH DYNAMIC ADMIN BANNERS */}
      <section className="relative bg-gradient-to-r from-gray-900 via-[#0b132b] to-blue-950 rounded-3xl overflow-hidden p-8 md:p-12 text-white shadow-2xl border border-blue-900/50">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-8 relative z-10">
          <div className="lg:col-span-6 space-y-6">
            <span className="inline-block bg-blue-600/30 text-blue-300 border border-blue-400/40 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
              {slide.subtitle || 'YIDA COMPUTERS AKOLA'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">
              {slide.title}
            </h1>
            <p className="text-sm md:text-base text-gray-300 leading-relaxed max-w-xl">
              {slide.offerText}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('catalog')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-transform transform hover:scale-105 cursor-pointer text-sm"
              >
                {slide.buttonLabel || 'Explore Products'} <i className="fa-solid fa-arrow-right ml-2"></i>
              </button>
              <button
                onClick={() => {
                  const pcProd = products.find(p => p.category === 'desktops') || products[0];
                  if (pcProd) onNavigate('detail', pcProd.id);
                }}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl backdrop-blur-sm transition-all cursor-pointer text-sm border border-white/20"
              >
                Build Your PC
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 flex justify-center items-center relative">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-2xl"></div>
            <img
              src={slide.image}
              alt={slide.title}
              className="max-h-96 w-full object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.7)] transition-all duration-700 transform hover:scale-105"
            />
          </div>
        </div>

        {/* Carousel Controls */}
        {heroSlides.length > 1 && (
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${currentSlide === idx ? 'w-8 bg-blue-500' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
              <button
                onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Category Strip */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-4 text-center">
          {categories.map((cat, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate('catalog', undefined, cat.cat)}
              className="flex flex-col items-center gap-2 group cursor-pointer p-2 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm transition-colors ${idx === 10 ? 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white' : 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white'}`}>
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <span className="text-xs font-semibold text-gray-800">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Features */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="text-blue-600 text-2xl bg-blue-50 p-3 rounded-xl">
            <i className="fa-solid fa-truck-fast"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Free Delivery</h4>
            <p className="text-xs text-gray-500">Across Akola & Maharashtra</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="text-blue-600 text-2xl bg-blue-50 p-3 rounded-xl">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">1 Year Warranty</h4>
            <p className="text-xs text-gray-500">100% Genuine Hardware</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="text-blue-600 text-2xl bg-blue-50 p-3 rounded-xl">
            <i className="fa-solid fa-headset"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">Expert Support</h4>
            <p className="text-xs text-gray-500">Akola Store Assistance</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 p-4 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="text-green-600 text-2xl bg-green-50 p-3 rounded-xl">
            <i className="fa-brands fa-whatsapp"></i>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">WhatsApp Orders</h4>
            <p className="text-xs text-gray-500">+91 9607643461</p>
          </div>
        </div>
      </section>

      {/* Featured Products — 5 Columns on Desktop with Sales Badges */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-gray-900">Featured Gaming Laptops & PCs</h2>
            <p className="text-xs text-gray-500 mt-0.5">Handpicked high-performance machines ready for instant dispatch from Akola.</p>
          </div>
          <button
            onClick={() => onNavigate('catalog')}
            className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
          >
            View All Products <i className="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>

        {/* Responsive Grid: 5 cols on wide desktop, 3 on tablet, 2 on mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-5">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col justify-between relative group hover:shadow-xl transition-all duration-300"
            >
              {/* Badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {prod.badges && prod.badges.map(b => (
                  <span key={b} className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm text-white ${b === 'SALE' ? 'bg-red-600' : b === 'HOT DEAL' ? 'bg-orange-600' : 'bg-blue-600'}`}>
                    {b}
                  </span>
                ))}
                {(!prod.badges || prod.badges.length === 0) && prod.discount && (
                  <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {prod.discount}
                  </span>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  alert(`Added ${prod.name} to wishlist`);
                }}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors z-10 bg-white/80 p-1.5 rounded-full shadow-sm border border-gray-100 cursor-pointer"
                title="Add to Wishlist"
              >
                <i className="fa-regular fa-heart text-sm"></i>
              </button>

              <div 
                onClick={() => onNavigate('detail', prod.id)}
                className="h-36 flex items-center justify-center my-3 cursor-pointer overflow-hidden pt-4"
              >
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">{prod.brand}</span>
                <h4 
                  onClick={() => onNavigate('detail', prod.id)}
                  className="text-xs font-bold text-gray-900 line-clamp-2 cursor-pointer hover:text-blue-600 transition-colors"
                >
                  {prod.name}
                </h4>
                <p className="text-[11px] text-gray-500 line-clamp-1">{prod.shortDescription}</p>
                <div className="flex items-baseline gap-2 pt-1">
                  <p className="text-sm font-black text-gray-900">{formatINR(prod.price)}</p>
                  {prod.originalPrice && (
                    <p className="text-[10px] text-gray-400 line-through">{formatINR(prod.originalPrice)}</p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
                <button
                  onClick={() => onAddToCart(prod)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-xl font-bold transition-colors cursor-pointer shadow-sm"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => setInspectingProduct(prod)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl text-xs transition-colors cursor-pointer border border-gray-200"
                  title="360° / 3D Inspector"
                >
                  <i className="fa-solid fa-cube"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3D / 360° HARDWARE INSPECTOR MODAL */}
      {inspectingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative border border-gray-200">
            <button
              onClick={() => setInspectingProduct(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl bg-gray-100 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-colors"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>

            <div className="flex items-center gap-3 mb-4">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Interactive 3D / 360° Hardware Inspector</span>
              <h3 className="text-lg font-bold text-gray-900 truncate">{inspectingProduct.name}</h3>
            </div>

            <div className="relative bg-gradient-to-b from-gray-50 to-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center h-80 border border-gray-200 overflow-hidden">
              <div className="absolute top-3 left-3 text-xs text-gray-500 font-mono">
                ROTATION: {rotationAngle}° | VIEW: {explodedView ? 'EXPLODED COMPONENT VIEW' : 'STANDARD STUDIO RENDER'}
              </div>

              <div 
                className="transition-transform duration-300 flex items-center justify-center"
                style={{ transform: `rotate(${rotationAngle}deg) scale(${explodedView ? 1.15 : 1})` }}
              >
                <img src={inspectingProduct.image} alt={inspectingProduct.name} className="max-h-60 object-contain drop-shadow-2xl" />
              </div>

              {explodedView && (
                <div className="absolute inset-x-4 bottom-3 flex justify-around text-[10px] font-bold text-blue-700 bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow border">
                  <span>⚡ RTX GPU</span>
                  <span>🧠 Core i7/i9 CPU</span>
                  <span>💾 DDR5 RAM</span>
                  <span>❄️ Liquid Cooler</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRotationAngle((r) => r - 45)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <i className="fa-solid fa-rotate-left mr-1"></i> Rotate Left
                </button>
                <button
                  onClick={() => setRotationAngle((r) => r + 45)}
                  className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Rotate Right <i className="fa-solid fa-rotate-right ml-1"></i>
                </button>
                <button
                  onClick={() => setExplodedView(!explodedView)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${explodedView ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                >
                  <i className="fa-solid fa-explosion mr-1"></i> Exploded View
                </button>
              </div>

              <button
                onClick={() => {
                  onAddToCart(inspectingProduct);
                  setInspectingProduct(null);
                  alert(`Added ${inspectingProduct.name} to cart!`);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md"
              >
                Add to Cart ({formatINR(inspectingProduct.price)})
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
