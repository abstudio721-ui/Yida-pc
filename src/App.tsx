/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { initialProducts } from './data/products';
import { initialBanners } from './data/banners';
import { Banner, CartItem, Order, Product } from './types';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartView } from './components/CartView';
import { AdminDashboard } from './components/AdminDashboard';
import { AccountModal } from './components/AccountModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AddProductModal } from './components/AddProductModal';

export default function App() {
  // Safe localStorage loading for products, banners, cart, and orders
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('yida_products_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading products from localStorage:', e);
    }
    return initialProducts;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    try {
      const saved = localStorage.getItem('yida_banners_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading banners from localStorage:', e);
    }
    return initialBanners;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('yida_cart_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading cart from localStorage:', e);
    }
    return [
      { product: initialProducts[0], quantity: 1 },
      { product: initialProducts[12], quantity: 1 }
    ];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('yida_orders_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Error loading orders from localStorage:', e);
    }
    return [
      { id: '#YD-9021', customerName: 'Rahul Deshmukh', customerPhone: '+91 9607643461', items: [{ name: 'ASUS ROG Strix G16', quantity: 1, price: 124999 }], total: 124999, status: 'Processing', date: 'Today, 2:15 PM' },
      { id: '#YD-9020', customerName: 'Sneha Kulkarni', customerPhone: '+91 9888822222', items: [{ name: 'HP Pavilion x360', quantity: 1, price: 68500 }], total: 68500, status: 'Shipped', date: 'Yesterday' }
    ];
  });

  const [currentView, setCurrentView] = useState<'home' | 'catalog' | 'cart' | 'admin' | 'detail'>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>(initialProducts[0].id);
  const [initialCategory, setInitialCategory] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('yida_products_v1', JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products:', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('yida_banners_v1', JSON.stringify(banners));
    } catch (e) {
      console.error('Failed to save banners:', e);
    }
  }, [banners]);

  useEffect(() => {
    try {
      localStorage.setItem('yida_cart_v1', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('yida_orders_v1', JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders:', e);
    }
  }, [orders]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleNavigate = (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail', productId?: string, category?: string) => {
    if (view === 'detail' && productId) {
      setSelectedProductId(productId);
    }
    if (category) {
      setInitialCategory(category);
    } else if (view === 'catalog') {
      setInitialCategory(undefined);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean) as CartItem[]);
  };

  const handleRemoveItem = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleSaveProduct = (product: Product) => {
    setProducts(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [product, ...prev];
    });
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleSaveBanner = (banner: Banner) => {
    setBanners(prev => {
      const exists = prev.some(b => b.id === banner.id);
      if (exists) {
        return prev.map(b => b.id === banner.id ? banner : b);
      }
      return [...prev, banner];
    });
  };

  const handleDeleteBanner = (bannerId: string) => {
    setBanners(prev => prev.filter(b => b.id !== bannerId));
  };

  const handleAddProductModalSave = (newProduct: Product) => {
    handleSaveProduct(newProduct);
  };

  const handleOrderComplete = (orderData: { name: string; phone: string; fulfillment: string; address?: string; notes?: string; total: number; subtotal: number; discount: number }) => {
    const newOrder: Order = {
      id: '#YD-' + Math.floor(1000 + Math.random() * 9000),
      customerName: orderData.name,
      customerPhone: orderData.phone,
      items: cart.map(i => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
      total: orderData.total,
      status: 'Processing',
      date: 'Just now'
    };
    setOrders([newOrder, ...orders]);
    setCart([]);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f4f6] text-gray-800 antialiased font-sans">
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        products={products}
        onNavigate={handleNavigate}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      <div className="flex-1">
        {currentView === 'home' && (
          <HomeView
            products={products}
            banners={banners}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'catalog' && (
          <CatalogView
            products={products}
            searchQuery={searchQuery}
            initialCategory={initialCategory}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'detail' && (
          <ProductDetailView
            product={selectedProduct}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentView === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onNavigate={handleNavigate}
            onOpenCheckout={() => setIsCheckoutOpen(true)}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard
            products={products}
            banners={banners}
            orders={orders}
            onNavigate={handleNavigate}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onSaveBanner={handleSaveBanner}
            onDeleteBanner={handleDeleteBanner}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}
      </div>

      <Footer />

      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        onLoginSuccess={(name) => {
          setCurrentUser(name);
          alert(`Welcome back, ${name} to YIDA Computers Akola!`);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderComplete={handleOrderComplete}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProductModalSave}
      />
    </div>
  );
}
