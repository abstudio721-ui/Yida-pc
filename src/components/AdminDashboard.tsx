import React, { useState } from 'react';
import { Banner, Order, Product } from '../types';

interface AdminDashboardProps {
  products: Product[];
  banners: Banner[];
  orders: Order[];
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail', productId?: string) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onSaveBanner: (banner: Banner) => void;
  onDeleteBanner: (bannerId: string) => void;
  onUpdateOrderStatus: (orderId: string, newStatus: Order['status']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  banners,
  orders,
  onNavigate,
  onSaveProduct,
  onDeleteProduct,
  onSaveBanner,
  onDeleteBanner,
  onUpdateOrderStatus,
}) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'products' | 'productForm' | 'banners' | 'orders' | 'inventory'>('overview');
  
  // Product Form state for Add/Edit
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
    category: 'laptops',
    brand: 'ASUS',
    price: 69990,
    originalPrice: undefined,
    stockCount: 10,
    availability: 'In Stock',
    badges: ['NEW'],
    shortDescription: '',
    description: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmd_uEhfP1SFxIhoyLyFI1buXEuVWO4WOF7cn8ko5C_jim40qyQrskxewW9zem8X-hX9FLkDIPppCEla6QQGh0JDC3CkpRwsse36z4Lf3aFnhl-x9P0cYMpap2FydxxDNbx1Z__HxKf8xjf7APsXBHdfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hjOkTKmchHHf-t9MHTagjFCUCHG-t3TeXwwq3wduzsp2HN78g65e-uU5',
    thumbnails: [],
    specs: { processor: 'Intel Core i5', ram: '16GB', storage: '512GB SSD', graphics: 'RTX 3050' }
  });

  // Banner Form state for Add/Edit
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<Banner>>({
    title: '',
    subtitle: '',
    offerText: '',
    buttonLabel: 'Explore Now',
    destinationUrl: 'catalog',
    displayOrder: 1,
    isActive: true,
    isDraft: false,
    placement: 'Hero Carousel',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmd_uEhfP1SFxIhoyLyFI1buXEuVWO4WOF7cn8ko5C_jim40qyQrskxewW9zem8X-hX9FLkDIPppCEla6QQGh0JDC3CkpRwsse36z4Lf3aFnhl-x9P0cYMpap2FydxxDNbx1Z__HxKf8xjf7APsXBHdfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hjOkTKmchHHf-t9MHTagjFCUCHG-t3TeXwwq3wduzsp2HN78g65e-uU5'
  });

  // Filter & Search states for products
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');

  const formatINR = (amount: number) => '₹' + amount.toLocaleString('en-IN');

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      sku: 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      category: 'laptops',
      brand: 'ASUS',
      price: 69990,
      originalPrice: undefined,
      stockCount: 10,
      availability: 'In Stock',
      badges: ['NEW'],
      shortDescription: '',
      description: '',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmd_uEhfP1SFxIhoyLyFI1buXEuVWO4WOF7cn8ko5C_jim40qyQrskxewW9zem8X-hX9FLkDIPppCEla6QQGh0JDC3CkpRwsse36z4Lf3aFnhl-x9P0cYMpap2FydxxDNbx1Z__HxKf8xjf7APsXBHdfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hjOkTKmchHHf-t9MHTagjFCUCHG-t3TeXwwq3wduzsp2HN78g65e-uU5',
      thumbnails: [],
      specs: { processor: 'Intel Core i5', ram: '16GB', storage: '512GB SSD' }
    });
    setActiveSection('productForm');
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({ ...prod, badges: prod.badges || [prod.badge || 'NEW'] });
    setActiveSection('productForm');
  };

  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setProductForm(prev => ({ ...prev, image: uploadEvent.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      if (uploadEvent.target?.result) {
        setBannerForm(prev => ({ ...prev, image: uploadEvent.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || productForm.price <= 0) {
      alert('Please provide a valid product name and positive price.');
      return;
    }

    const finalProduct: Product = {
      id: editingProductId || ('p-' + Date.now()),
      sku: productForm.sku || ('SKU-' + Math.floor(1000 + Math.random() * 9000)),
      name: productForm.name,
      category: productForm.category || 'laptops',
      brand: productForm.brand || 'ASUS',
      price: Number(productForm.price),
      originalPrice: productForm.originalPrice ? Number(productForm.originalPrice) : undefined,
      discount: productForm.originalPrice && productForm.originalPrice > Number(productForm.price) 
        ? `${Math.round(((productForm.originalPrice - Number(productForm.price)) / productForm.originalPrice) * 100)}% OFF` 
        : undefined,
      badges: productForm.badges || ['NEW'],
      badge: productForm.badges?.[0] || 'NEW',
      inStock: productForm.availability === 'In Stock',
      availability: productForm.availability || 'In Stock',
      stockCount: Number(productForm.stockCount ?? 10),
      shortDescription: productForm.shortDescription || `${productForm.specs?.processor || ''} | ${productForm.specs?.ram || ''}`,
      description: productForm.description || productForm.name,
      image: productForm.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmd_uEhfP1SFxIhoyLyFI1buXEuVWO4WOF7cn8ko5C_jim40qyQrskxewW9zem8X-hX9FLkDIPppCEla6QQGh0JDC3CkpRwsse36z4Lf3aFnhl-x9P0cYMpap2FydxxDNbx1Z__HxKf8xjf7APsXBHdfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hjOkTKmchHHf-t9MHTagjFCUCHG-t3TeXwwq3wduzsp2HN78g65e-uU5',
      thumbnails: productForm.thumbnails || [],
      specs: productForm.specs || {},
      rating: 4.8,
      reviewsCount: 15
    };

    onSaveProduct(finalProduct);
    alert(`Product successfully ${editingProductId ? 'updated' : 'added'}! Changes are saved to browser storage.`);
    setActiveSection('products');
  };

  const handleBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title) {
      alert('Please provide a banner title.');
      return;
    }

    const finalBanner: Banner = {
      id: editingBannerId || ('b-' + Date.now()),
      title: bannerForm.title,
      subtitle: bannerForm.subtitle || '',
      offerText: bannerForm.offerText || '',
      buttonLabel: bannerForm.buttonLabel || 'Explore Now',
      destinationUrl: bannerForm.destinationUrl || 'catalog',
      displayOrder: Number(bannerForm.displayOrder || 1),
      isActive: Boolean(bannerForm.isActive),
      isDraft: Boolean(bannerForm.isDraft),
      placement: bannerForm.placement || 'Hero Carousel',
      image: bannerForm.image || ''
    };

    onSaveBanner(finalBanner);
    alert('Banner successfully saved!');
    setActiveSection('banners');
  };

  const filteredProducts = products.filter(p => {
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (stockFilter === 'inStock' && !p.inStock) return false;
    if (stockFilter === 'outOfStock' && p.inStock) return false;
    return true;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Admin Navigation Sidebar */}
        <aside className="w-full lg:w-64 bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex flex-col gap-2 shrink-0">
          <div className="px-3 py-2 border-b border-gray-100 mb-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Akola Management</span>
            <p className="text-sm font-black text-blue-600">YIDA Admin Portal</p>
          </div>

          <button
            onClick={() => setActiveSection('overview')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none text-left ${activeSection === 'overview' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700 bg-transparent'}`}
          >
            <i className="fa-solid fa-chart-pie w-4"></i> Overview
          </button>
          <button
            onClick={() => setActiveSection('products')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none text-left ${activeSection === 'products' || activeSection === 'productForm' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700 bg-transparent'}`}
          >
            <i className="fa-solid fa-laptop w-4"></i> Products ({products.length})
          </button>
          <button
            onClick={handleOpenAddProduct}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none text-left hover:bg-blue-50 text-blue-600 bg-blue-50/50"
          >
            <i className="fa-solid fa-plus w-4"></i> Add New Product
          </button>
          <button
            onClick={() => setActiveSection('banners')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none text-left ${activeSection === 'banners' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700 bg-transparent'}`}
          >
            <i className="fa-solid fa-image w-4"></i> Banners & Offers ({banners.length})
          </button>
          <button
            onClick={() => setActiveSection('orders')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none text-left ${activeSection === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700 bg-transparent'}`}
          >
            <i className="fa-solid fa-box-archive w-4"></i> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveSection('inventory')}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border-none text-left ${activeSection === 'inventory' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50 text-gray-700 bg-transparent'}`}
          >
            <i className="fa-solid fa-warehouse w-4"></i> Inventory & Stock
          </button>
        </aside>

        {/* Main Admin Content Area */}
        <div className="flex-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          
          {/* SECTION 1: OVERVIEW */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Akola Store Overview</h1>
                  <p className="text-xs text-gray-500">Live metrics and store management for YIDA Computers Akola.</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  <i className="fa-solid fa-plus mr-1.5"></i> Add Product
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <span className="text-xs font-bold text-gray-400 uppercase">Total Catalog</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{products.length} Products</h3>
                  <p className="text-xs text-green-600 mt-1 font-medium"><i className="fa-solid fa-check"></i> All items active</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <span className="text-xs font-bold text-gray-400 uppercase">Active Banners</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{banners.filter(b => b.isActive && !b.isDraft).length} Banners</h3>
                  <p className="text-xs text-blue-600 mt-1 font-medium">Hero carousel updated</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <span className="text-xs font-bold text-gray-400 uppercase">Customer Orders</span>
                  <h3 className="text-2xl font-black text-gray-900 mt-1">{orders.length} Orders</h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">WhatsApp & Store</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border">
                  <span className="text-xs font-bold text-gray-400 uppercase">Business WhatsApp</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-1">+91 9607643461</h3>
                  <p className="text-xs text-green-600 mt-1 font-medium"><i className="fa-brands fa-whatsapp"></i> Online</p>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                  <button onClick={handleOpenAddProduct} className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                    + Add New Product
                  </button>
                  <button onClick={() => { setEditingBannerId(null); setBannerForm({ title: '', subtitle: '', offerText: '', buttonLabel: 'Explore', displayOrder: banners.length + 1, isActive: true, isDraft: false, placement: 'Hero Carousel', image: products[0].image }); setActiveSection('banners'); }} className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                    + Create Promotional Banner
                  </button>
                  <button onClick={() => setActiveSection('products')} className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                    Manage Products Inventory
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: PRODUCTS TABLE */}
          {activeSection === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Product Management</h1>
                  <p className="text-xs text-gray-500">Add, edit, assign badges, or delete products.</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  <i className="fa-solid fa-plus mr-1.5"></i> Add New Product
                </button>
              </div>

              {/* Filters & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by name or brand..."
                  className="px-3 py-2 border rounded-xl text-xs bg-white"
                />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="laptops">Laptops</option>
                  <option value="desktops">Desktops</option>
                  <option value="monitors">Monitors</option>
                  <option value="components">Components</option>
                  <option value="accessories">Accessories</option>
                  <option value="printers">Printers</option>
                  <option value="software">Software</option>
                </select>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  <option value="all">All Stock Status</option>
                  <option value="inStock">In Stock Only</option>
                  <option value="outOfStock">Out of Stock</option>
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-800">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 font-bold border-b">
                      <th className="p-3">Product</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock / Status</th>
                      <th className="p-3">Badges</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map(prod => (
                      <tr key={prod.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 object-contain bg-white rounded p-1 border shrink-0" />
                          <div>
                            <p className="font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                            <span className="text-[10px] text-blue-600 font-semibold">{prod.brand}</span>
                          </div>
                        </td>
                        <td className="p-3 font-mono text-gray-500">{prod.sku || 'N/A'}</td>
                        <td className="p-3 capitalize text-gray-600">{prod.category}</td>
                        <td className="p-3 font-black text-gray-900">
                          {formatINR(prod.price)}
                          {prod.originalPrice && <span className="block text-[10px] text-gray-400 line-through">{formatINR(prod.originalPrice)}</span>}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${prod.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {prod.availability || (prod.inStock ? 'In Stock' : 'Out of Stock')} ({prod.stockCount ?? 10})
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {prod.badges?.map(b => (
                              <span key={b} className="bg-blue-50 text-blue-700 text-[9px] px-1.5 py-0.5 rounded font-bold">{b}</span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEditProduct(prod)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            <i className="fa-solid fa-pen mr-1"></i> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                onDeleteProduct(prod.id);
                              }
                            }}
                            className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                          >
                            <i className="fa-solid fa-trash mr-1"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECTION 3: ADD / EDIT PRODUCT FORM */}
          {activeSection === 'productForm' && (
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {editingProductId ? 'Edit Product' : 'Add New Product'}
                  </h1>
                  <p className="text-xs text-gray-500">Configure product specifications, pricing, stock and sales badges.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveSection('products')}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2 rounded-xl shadow cursor-pointer"
                  >
                    Save Product
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name || ''}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. ASUS ROG Strix G16"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">SKU / Product ID</label>
                  <input
                    type="text"
                    value={productForm.sku || ''}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Category</label>
                  <select
                    value={productForm.category || 'laptops'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as Product['category'] })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="laptops">Laptops</option>
                    <option value="desktops">Desktops</option>
                    <option value="monitors">Monitors</option>
                    <option value="components">Components</option>
                    <option value="accessories">Accessories</option>
                    <option value="printers">Printers</option>
                    <option value="software">Software</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Brand</label>
                  <input
                    type="text"
                    value={productForm.brand || ''}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="ASUS, Lenovo, HP, MSI, Dell..."
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={productForm.price ?? 69990}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Original / MRP Price (₹) [For Discount Badge]</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.originalPrice ?? ''}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    placeholder="e.g. 89990"
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    value={productForm.stockCount ?? 10}
                    onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 uppercase mb-1">Availability Status</label>
                  <select
                    value={productForm.availability || 'In Stock'}
                    onChange={(e) => setProductForm({ ...productForm, availability: e.target.value as Product['availability'], inStock: e.target.value === 'In Stock' })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Coming Soon">Coming Soon</option>
                  </select>
                </div>
              </div>

              {/* Sales Badges Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase">Sales Badges (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {['SALE', 'NEW', 'BESTSELLER', 'LIMITED OFFER', 'FEATURED', 'HOT DEAL'].map(badge => {
                    const selected = productForm.badges?.includes(badge);
                    return (
                      <button
                        key={badge}
                        type="button"
                        onClick={() => {
                          const current = productForm.badges || [];
                          const updated = selected ? current.filter(b => b !== badge) : [...current, badge];
                          setProductForm({ ...productForm, badges: updated, badge: updated[0] || 'NEW' });
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-50 text-gray-700 border-gray-200'}`}
                      >
                        {badge} {selected && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image Upload from Mobile Phone */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border">
                <label className="block text-xs font-bold text-gray-700 uppercase">Product Main Image (Upload from Phone / Gallery / Camera)</label>
                <div className="flex items-center gap-4">
                  <img src={productForm.image} alt="Preview" className="w-16 h-16 object-contain bg-white rounded-lg p-1 border" />
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      onChange={handleProductImageUpload}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                    />
                    <p className="text-[10px] text-gray-400">Supports JPG, JPEG, PNG, WebP up to 5MB. Stored locally in browser storage.</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Short Specifications (Processor, RAM, Storage)</label>
                <input
                  type="text"
                  value={productForm.shortDescription || ''}
                  onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                  placeholder="e.g. Intel i7-13620H | 16GB DDR5 | 512GB SSD"
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setActiveSection('products')}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          )}

          {/* SECTION 4: BANNERS & OFFERS */}
          {activeSection === 'banners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Promotional Banners & Offers</h1>
                  <p className="text-xs text-gray-500">Manage hero carousel banners and promotional slides displayed on the storefront.</p>
                </div>
                <button
                  onClick={() => {
                    setEditingBannerId(null);
                    setBannerForm({
                      title: 'NEW PROMOTIONAL OFFER',
                      subtitle: 'Akola Store Exclusive',
                      offerText: 'Special discounts on gaming gear.',
                      buttonLabel: 'Shop Now',
                      destinationUrl: 'catalog',
                      displayOrder: banners.length + 1,
                      isActive: true,
                      isDraft: false,
                      placement: 'Hero Carousel',
                      image: products[0].image
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  <i className="fa-solid fa-plus mr-1.5"></i> Add New Banner
                </button>
              </div>

              {/* Banner Add/Edit form */}
              <form onSubmit={handleBannerSubmit} className="bg-gray-50 p-5 rounded-2xl border space-y-4">
                <h3 className="text-sm font-bold text-gray-900">{editingBannerId ? 'Edit Banner' : 'Create New Banner'}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Banner Title *</label>
                    <input
                      type="text"
                      required
                      value={bannerForm.title || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                      placeholder="e.g. FIND YOUR NEXT POWERHOUSE"
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Subtitle / Brand</label>
                    <input
                      type="text"
                      value={bannerForm.subtitle || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                      placeholder="ASUS ROG & TUF Series"
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-gray-700 uppercase mb-1">Offer Text</label>
                    <input
                      type="text"
                      value={bannerForm.offerText || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, offerText: e.target.value })}
                      placeholder="Special Akola Store Offer: Free Gaming Mouse..."
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Button Label</label>
                    <input
                      type="text"
                      value={bannerForm.buttonLabel || ''}
                      onChange={(e) => setBannerForm({ ...bannerForm, buttonLabel: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 uppercase mb-1">Display Order</label>
                    <input
                      type="number"
                      value={bannerForm.displayOrder ?? 1}
                      onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-xl bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-6 pt-2 sm:col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={bannerForm.isActive ?? true}
                        onChange={(e) => setBannerForm({ ...bannerForm, isActive: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Active (Publish to Storefront)
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-bold">
                      <input
                        type="checkbox"
                        checked={bannerForm.isDraft ?? false}
                        onChange={(e) => setBannerForm({ ...bannerForm, isDraft: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      Save as Draft
                    </label>
                  </div>
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block font-bold text-gray-700 uppercase">Banner Image (Upload from Phone / Gallery)</label>
                    <div className="flex items-center gap-4">
                      <img src={bannerForm.image} alt="Banner Preview" className="w-28 h-14 object-cover bg-white rounded-lg border" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageUpload}
                        className="text-xs text-gray-500 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2 rounded-xl text-xs cursor-pointer shadow"
                  >
                    Save Banner
                  </button>
                </div>
              </form>

              {/* Banners List */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900">Existing Banners ({banners.length})</h3>
                {banners.map(b => (
                  <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                      <img src={b.image} alt={b.title} className="w-24 h-12 object-cover rounded border bg-gray-50 shrink-0" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-gray-900">{b.title}</h4>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${b.isActive && !b.isDraft ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                            {b.isDraft ? 'Draft' : b.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-500">{b.subtitle} • {b.offerText}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingBannerId(b.id);
                          setBannerForm(b);
                          window.scrollTo({ top: 100, behavior: 'smooth' });
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete banner "${b.title}"?`)) {
                            onDeleteBanner(b.id);
                          }
                        }}
                        className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 5: ORDERS */}
          {activeSection === 'orders' && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-gray-900">Customer Orders ({orders.length})</h1>
              <p className="text-xs text-gray-500">Orders submitted via checkout or WhatsApp inquiries.</p>
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="border p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
                    <div>
                      <p className="text-xs font-bold text-blue-600">{o.id} — {o.customerName} ({o.customerPhone})</p>
                      <p className="text-[11px] text-gray-500 mt-1">Date: {o.date}</p>
                      <p className="text-xs text-gray-700 mt-1 font-medium">Items: {o.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <p className="text-sm font-black text-gray-900">{formatINR(o.total)}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500 uppercase">Status:</span>
                        <select
                          value={o.status}
                          onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as Order['status'])}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 6: INVENTORY & STOCK */}
          {activeSection === 'inventory' && (
            <div className="space-y-4">
              <h1 className="text-xl font-bold text-gray-900">Inventory & Stock Alerts</h1>
              <p className="text-xs text-gray-500">Real-time stock monitoring for YIDA Computers Akola.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="border p-4 rounded-xl flex items-center justify-between bg-gray-50">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-contain bg-white rounded p-1 border" />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{p.name}</h4>
                        <p className="text-[10px] text-gray-500 font-mono">SKU: {p.sku || 'SKU-999'}</p>
                        <p className={`text-[10px] font-bold mt-1 ${p.inStock ? 'text-green-600' : 'text-red-600'}`}>
                          Stock Count: {p.stockCount ?? 10} units ({p.availability || (p.inStock ? 'In Stock' : 'Out of Stock')})
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const newStock = prompt('Enter new stock count:', String(p.stockCount ?? 10));
                        if (newStock !== null) {
                          const qty = Number(newStock);
                          onSaveProduct({ ...p, stockCount: qty, inStock: qty > 0, availability: qty > 0 ? 'In Stock' : 'Out of Stock' });
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Update Stock
                    </button>
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
