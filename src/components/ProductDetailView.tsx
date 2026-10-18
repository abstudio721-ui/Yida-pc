import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailViewProps {
  product: Product;
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail') => void;
  onAddToCart: (product: Product, qty: number) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onNavigate,
  onAddToCart,
}) => {
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState<'overview' | 'specs' | 'gallery' | 'videos' | 'reviews'>('overview');
  const [userReview, setUserReview] = useState({ name: '', comment: '', rating: 5 });
  const [reviewsList, setReviewsList] = useState([
    { id: 'r1', author: 'Rahul Sharma', rating: 5, date: '2 weeks ago', comment: 'Absolute beast of a laptop! Bought it from YIDA Computers store in Nashik. Handles AAA titles smoothly.', verified: true },
    { id: 'r2', author: 'Snehal Patil', rating: 5, date: '1 month ago', comment: 'Purchased for video editing and 3D rendering. The i7 processor combined with RTX 4060 renders projects extremely fast. Great customer service!', verified: true }
  ]);

  const allImages = [product.image, ...(product.thumbnails || [])];
  const currentImg = allImages[selectedImgIndex] || product.image;

  const formatINR = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userReview.name || !userReview.comment) return;
    setReviewsList([
      {
        id: 'r-' + Date.now(),
        author: userReview.name,
        rating: userReview.rating,
        date: 'Just now',
        comment: userReview.comment,
        verified: true
      },
      ...reviewsList
    ]);
    setUserReview({ name: '', comment: '', rating: 5 });
    alert('Review submitted successfully!');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col w-full text-gray-800">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 bg-transparent border-none cursor-pointer">Home</button>
          <i className="fa-solid fa-chevron-right text-[8px]"></i>
          <button onClick={() => onNavigate('catalog')} className="hover:text-blue-600 bg-transparent border-none cursor-pointer">Laptops</button>
          <i className="fa-solid fa-chevron-right text-[8px]"></i>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Main Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Left: Image Gallery & 360 View */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Main Display Screen */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm p-4 flex items-center justify-center min-h-[400px] border border-gray-200">
              <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
                {product.discount && (
                  <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold shadow-sm">
                    {product.discount}
                  </span>
                )}
              </div>
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <button onClick={() => alert('Zoom mode active')} className="bg-gray-100 hover:bg-gray-200 text-gray-800 p-2.5 rounded-full shadow-md transition-colors cursor-pointer" title="Zoom">
                  <i className="fa-solid fa-expand"></i>
                </button>
                <button onClick={() => alert('Added to wishlist')} className="bg-gray-100 hover:bg-gray-200 text-red-500 p-2.5 rounded-full shadow-md transition-colors cursor-pointer" title="Add to Wishlist">
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>
              <img src={currentImg} alt={product.name} className="w-full max-h-[450px] object-contain transition-all duration-300" />
            </div>

            {/* Thumbnails & 360 Toggle */}
            <div className="grid grid-cols-5 gap-3">
              {allImages.slice(0, 4).map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImgIndex(idx)}
                  className={`border-2 rounded-lg overflow-hidden bg-white p-2 h-20 flex items-center justify-center transition-all cursor-pointer ${selectedImgIndex === idx ? 'border-blue-600 shadow-sm' : 'border-gray-200'}`}
                >
                  <img src={imgUrl} alt="Thumb" className="w-full h-full object-contain" />
                </button>
              ))}
              <button
                onClick={() => setActiveTab('gallery')}
                className="border-2 border-dashed border-blue-400 hover:bg-blue-50 rounded-lg flex flex-col items-center justify-center p-2 h-20 text-blue-600 transition-all bg-blue-50/20 cursor-pointer"
              >
                <i className="fa-solid fa-rotate text-lg mb-1"></i>
                <span className="text-[10px] font-bold">360° View</span>
              </button>
            </div>
          </div>

          {/* Right: Product Info & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-600 tracking-wider uppercase">{product.brand} COMPUTING SERIES</span>
                <h1 className="text-xl font-bold text-gray-900 mt-1">{product.name}</h1>
              </div>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-amber-500 text-sm">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star-half-stroke"></i>
                </div>
                <span className="text-sm font-bold text-gray-900">{product.rating}</span>
                <span className="text-gray-500 text-xs">({product.reviewsCount} Verified Customer Reviews)</span>
              </div>

              {/* Pricing Card */}
              <div className="bg-gray-50 p-4 rounded-xl space-y-1 border border-gray-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-gray-900">{formatINR(product.price)}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm text-gray-400 line-through">{formatINR(product.originalPrice)}</span>
                      <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">Save {formatINR(product.originalPrice - product.price)}</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-gray-500">Inclusive of all taxes. Free delivery across India. 1-Year International Warranty.</p>
              </div>

              {/* Key Specs Summary Bullets */}
              <div className="grid grid-cols-2 gap-2 text-xs py-2 text-gray-700">
                {product.specs.processor && <div className="flex items-center gap-2"><i className="fa-solid fa-microchip text-blue-600"></i><span>{product.specs.processor}</span></div>}
                {product.specs.graphics && <div className="flex items-center gap-2"><i className="fa-solid fa-display text-blue-600"></i><span>{product.specs.graphics}</span></div>}
                {product.specs.ram && <div className="flex items-center gap-2"><i className="fa-solid fa-memory text-blue-600"></i><span>{product.specs.ram}</span></div>}
                {product.specs.storage && <div className="flex items-center gap-2"><i className="fa-solid fa-hard-drive text-blue-600"></i><span>{product.specs.storage}</span></div>}
              </div>

              {/* Stock Status & Quantity */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs font-semibold text-green-700">In Stock at YIDA Nashik & Akola Store</span>
                </div>
                <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">-</button>
                  <span className="px-4 py-1 text-center font-bold text-gray-900">{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer">+</button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-6 border-t border-gray-100 mt-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    onAddToCart(product, qty);
                    alert(`Added ${qty} x ${product.name} to cart!`);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>
                <button
                  onClick={() => {
                    onAddToCart(product, qty);
                    onNavigate('cart');
                  }}
                  className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer text-xs"
                >
                  <i className="fa-solid fa-bolt"></i> Buy Now
                </button>
              </div>
              <a
                href={`https://wa.me/919888888888?text=${encodeURIComponent(`Hello YIDA Computers, I want to order ${product.name} (Qty: ${qty}) for ${formatINR(product.price * qty)}. Please provide WhatsApp assistance.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-xs no-underline"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i> Order on WhatsApp (Instant Assistance)
              </a>
            </div>
          </div>
        </div>

        {/* Tabs Navigation Container */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200 gap-8 overflow-x-auto text-sm">
            <button onClick={() => setActiveTab('overview')} className={`pb-3 font-bold whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>Overview</button>
            <button onClick={() => setActiveTab('specs')} className={`pb-3 font-medium whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${activeTab === 'specs' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Specifications</button>
            <button onClick={() => setActiveTab('gallery')} className={`pb-3 font-medium whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${activeTab === 'gallery' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>360° & Gallery</button>
            <button onClick={() => setActiveTab('videos')} className={`pb-3 font-medium whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${activeTab === 'videos' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Videos</button>
            <button onClick={() => setActiveTab('reviews')} className={`pb-3 font-medium whitespace-nowrap transition-colors cursor-pointer bg-transparent border-none ${activeTab === 'reviews' ? 'text-blue-600 border-b-2 border-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'}`}>Customer Reviews ({reviewsList.length})</button>
          </div>

          {/* Tab Content: Overview */}
          {activeTab === 'overview' && (
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900">Engineered for Extreme Durability & Performance</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-600"></i> High refresh rate display with Adaptive-Sync</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-600"></i> Advanced thermal cooling with dual fan architecture</li>
                    <li className="flex items-center gap-2"><i className="fa-solid fa-check text-blue-600"></i> Dolby Atmos Powered Immersive Audio</li>
                  </ul>
                </div>
                <div>
                  <img src={product.image} alt="Overview" className="rounded-xl shadow-md w-full object-cover h-72 border" />
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Specifications */}
          {activeTab === 'specs' && (
            <div className="pt-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Technical Specifications Sheet</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between border"><span className="text-gray-500 font-medium">Brand</span><span className="font-bold text-gray-900">{product.brand}</span></div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between border"><span className="text-gray-500 font-medium">Processor</span><span className="font-bold text-gray-900">{product.specs.processor || 'High performance CPU'}</span></div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between border"><span className="text-gray-500 font-medium">Graphics</span><span className="font-bold text-gray-900">{product.specs.graphics || 'Integrated / Dedicated GPU'}</span></div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between border"><span className="text-gray-500 font-medium">Memory (RAM)</span><span className="font-bold text-gray-900">{product.specs.ram || '16GB'}</span></div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between border"><span className="text-gray-500 font-medium">Storage</span><span className="font-bold text-gray-900">{product.specs.storage || '512GB NVMe SSD'}</span></div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between border"><span className="text-gray-500 font-medium">Operating System</span><span className="font-bold text-gray-900">{product.specs.os || 'Windows 11 Home'}</span></div>
              </div>
            </div>
          )}

          {/* Tab Content: 360 & Gallery */}
          {activeTab === 'gallery' && (
            <div className="pt-6 space-y-6 text-center">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Interactive 360° Rotation Preview</h3>
              <p className="text-sm text-gray-500 mb-6">Drag or click arrows to rotate the product in full 360 degrees.</p>
              <div className="relative bg-gray-50 p-8 rounded-xl max-w-2xl mx-auto flex flex-col items-center justify-center border border-gray-200">
                <div className="absolute inset-0 flex items-center justify-between px-4 z-10 pointer-events-none">
                  <button onClick={() => setSelectedImgIndex((selectedImgIndex - 1 + allImages.length) % allImages.length)} className="pointer-events-auto bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-md cursor-pointer"><i className="fa-solid fa-chevron-left"></i></button>
                  <button onClick={() => setSelectedImgIndex((selectedImgIndex + 1) % allImages.length)} className="pointer-events-auto bg-white hover:bg-gray-100 text-gray-800 p-3 rounded-full shadow-md cursor-pointer"><i className="fa-solid fa-chevron-right"></i></button>
                </div>
                <img src={currentImg} alt="360 view" className="max-h-80 object-contain mx-auto" />
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-bold">
                  <i className="fa-solid fa-rotate animate-spin"></i> Use arrows or click thumbnails to inspect 360° angles
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Videos */}
          {activeTab === 'videos' && (
            <div className="pt-6 space-y-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Overviews & Reviews</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border p-4 text-center space-y-2">
                  <div className="h-40 bg-blue-900 text-white rounded-lg flex items-center justify-center text-3xl font-bold">
                    <i className="fa-solid fa-play"></i>
                  </div>
                  <h4 className="font-bold text-gray-900">Official {product.name} Feature Walkthrough</h4>
                  <p className="text-xs text-gray-500">Detailed benchmarks, thermals, and build quality breakdown.</p>
                </div>
                <div className="bg-gray-50 rounded-xl overflow-hidden shadow-sm border p-4 text-center space-y-2">
                  <div className="h-40 bg-blue-900 text-white rounded-lg flex items-center justify-center text-3xl font-bold">
                    <i className="fa-solid fa-play"></i>
                  </div>
                  <h4 className="font-bold text-gray-900">YIDA Computers Store Unboxing & Setup</h4>
                  <p className="text-xs text-gray-500">Nashik & Akola showroom unboxing and first boot test.</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Customer Reviews */}
          {activeTab === 'reviews' && (
            <div className="pt-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50 p-6 rounded-xl border">
                <div className="lg:col-span-4 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-gray-200 pb-6 lg:pb-0 lg:pr-6">
                  <span className="text-3xl font-bold text-gray-900">{product.rating}</span>
                  <div className="flex items-center justify-center lg:justify-start text-amber-500 my-1">
                    <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star-half-stroke"></i>
                  </div>
                  <p className="text-xs text-gray-500">Based on {reviewsList.length} verified reviews from YIDA customers</p>
                </div>
                <div className="lg:col-span-8">
                  <form onSubmit={handleAddReview} className="space-y-3">
                    <h4 className="font-bold text-sm text-gray-900">Write a Review</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={userReview.name}
                        onChange={(e) => setUserReview({ ...userReview, name: e.target.value })}
                        className="flex-1 px-3 py-1.5 border rounded text-xs bg-white"
                      />
                      <select
                        value={userReview.rating}
                        onChange={(e) => setUserReview({ ...userReview, rating: Number(e.target.value) })}
                        className="px-3 py-1.5 border rounded text-xs bg-white"
                      >
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                      </select>
                    </div>
                    <textarea
                      required
                      rows={2}
                      placeholder="Write your review about performance, battery, display..."
                      value={userReview.comment}
                      onChange={(e) => setUserReview({ ...userReview, comment: e.target.value })}
                      className="w-full px-3 py-1.5 border rounded text-xs bg-white"
                    />
                    <button type="submit" className="bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded cursor-pointer">
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="bg-gray-50 p-4 rounded-xl space-y-2 border">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">{rev.author}</span>
                        {rev.verified && (
                          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">
                            <i className="fa-solid fa-circle-check"></i> Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">{rev.date}</span>
                    </div>
                    <div className="flex text-amber-500 text-xs">
                      {[...Array(rev.rating)].map((_, i) => (
                        <i key={i} className="fa-solid fa-star"></i>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};
