import React, { useState } from 'react';
import { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onNavigate: (view: 'home' | 'catalog' | 'cart' | 'admin' | 'detail') => void;
  onOpenCheckout: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onNavigate,
  onOpenCheckout,
}) => {
  const [fulfillment, setFulfillment] = useState<'Home Delivery' | 'Store Pickup in Akola'>('Home Delivery');
  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const inrFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = discountApplied ? Math.round(subtotal * 0.05) : 0;
  const total = subtotal - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'YIDA10') {
      setDiscountApplied(true);
      alert('Promo code YIDA10 applied successfully! 5% discount added.');
    } else {
      alert('Invalid promo code. Try "YIDA10".');
    }
  };

  const generateWhatsAppOrderText = () => {
    const orderRef = '#YD-' + Math.floor(1000 + Math.random() * 9000);
    let itemsText = '';
    cart.forEach((item, index) => {
      itemsText += `${index + 1}. ${item.product.name}\n   Quantity: ${item.quantity}\n   Unit Price: ${inrFormatter.format(item.product.price)}\n   Line Total: ${inrFormatter.format(item.product.price * item.quantity)}\n\n`;
    });

    const msg = `YIDA COMPUTERS AKOLA — NEW ORDER

Order Reference: ${orderRef}
Customer Name: Valued Customer
Phone: +91 9607643461
Fulfilment: ${fulfillment}

ITEMS:

${itemsText.trim()}

Subtotal: ${inrFormatter.format(subtotal)}
Discount: ${inrFormatter.format(discount)}
Final Total: ${inrFormatter.format(total)}

Please confirm product availability, final order details, and fulfilment with the customer.`;

    return encodeURIComponent(msg);
  };

  if (cart.length === 0) {
    return (
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-16 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-3xl">
          <i className="fa-solid fa-cart-shopping"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore our wide range of high-performance laptops, custom gaming desktops, and peripherals at YIDA Computers Akola.
        </p>
        <button
          onClick={() => onNavigate('catalog')}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md cursor-pointer"
        >
          Browse Catalog
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <div className="flex flex-col w-full text-gray-800">
        <div className="flex flex-col lg:flex-row gap-8 py-4">
          {/* Left Column: Cart Items & Delivery Info */}
          <div className="flex-1 flex flex-col gap-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)</h1>
              <p className="text-sm text-gray-500">Review your items before proceeding to secure checkout or instant WhatsApp ordering (+91 9607643461).</p>
            </div>

            {/* Cart Items List */}
            <div className="flex flex-col gap-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div
                      onClick={() => onNavigate('detail')}
                      className="w-20 h-20 rounded-lg bg-gray-50 bg-cover bg-center shrink-0 border cursor-pointer"
                      style={{ backgroundImage: `url('${item.product.image}')` }}
                    ></div>
                    <div className="flex flex-col gap-1 min-w-0">
                      <span className="text-[10px] text-blue-600 uppercase font-bold tracking-wider">{item.product.category}</span>
                      <h3 className="text-sm font-bold text-gray-900 truncate">{item.product.name}</h3>
                      <p className="text-xs text-gray-500">{item.product.shortDescription}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] bg-green-100 text-green-700 font-semibold">In Stock</span>
                        <span className="text-xs text-gray-400">Free Delivery in Akola</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-100">
                    {/* Quantity Adjuster */}
                    <div className="flex items-center rounded-lg bg-gray-100 p-1">
                      <button onClick={() => onUpdateQuantity(item.product.id, -1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-gray-800 font-bold transition-colors cursor-pointer">-</button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.product.id, 1)} className="w-7 h-7 flex items-center justify-center rounded hover:bg-white text-gray-800 font-bold transition-colors cursor-pointer">+</button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-base font-black text-gray-900">{inrFormatter.format(item.product.price * item.quantity)}</p>
                      {item.product.originalPrice && (
                        <p className="text-xs text-gray-400 line-through">{inrFormatter.format(item.product.originalPrice * item.quantity)}</p>
                      )}
                    </div>

                    {/* Remove Button */}
                    <button onClick={() => onRemoveItem(item.product.id)} className="text-red-500 hover:text-red-700 p-2 transition-colors cursor-pointer bg-transparent border-none" title="Remove item">
                      <i className="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Store Pickup vs Delivery Options */}
            <div className="flex flex-col gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
              <h3 className="text-base font-bold text-gray-900">Fulfillment Method</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all ${fulfillment === 'Home Delivery' ? 'border-blue-600 bg-blue-50/40' : 'border-gray-200 bg-white'}`}>
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={fulfillment === 'Home Delivery'}
                    onChange={() => setFulfillment('Home Delivery')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Home Delivery</span>
                    <span className="text-xs text-gray-500">Delivered securely within 2-3 business days. Free shipping across Akola & Maharashtra.</span>
                  </div>
                </label>
                <label className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer border-2 transition-all ${fulfillment === 'Store Pickup in Akola' ? 'border-blue-600 bg-blue-50/40' : 'border-gray-200 bg-white'}`}>
                  <input
                    type="radio"
                    name="fulfillment"
                    checked={fulfillment === 'Store Pickup in Akola'}
                    onChange={() => setFulfillment('Store Pickup in Akola')}
                    className="mt-1 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">Store Pickup (Akola)</span>
                    <span className="text-xs text-gray-500">Ready for instant pickup in 2 hours at our main Akola retail outlet.</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Actions */}
          <div className="w-full lg:w-[400px] flex flex-col gap-6">
            <div className="flex flex-col gap-6 p-6 bg-white rounded-xl shadow-md sticky top-6 border border-gray-200">
              <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h2>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (e.g. YIDA10)"
                  className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-gray-900 transition-colors cursor-pointer">Apply</button>
              </form>

              {/* Price Breakdown */}
              <div className="flex flex-col gap-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-gray-900">{inrFormatter.format(subtotal)}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>YIDA10 Discount (5%)</span>
                    <span>-{inrFormatter.format(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charges</span>
                  <span className="text-green-600 font-bold">FREE</span>
                </div>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total Amount</span>
                  <span className="text-xl font-black text-blue-600">{inrFormatter.format(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <button
                  onClick={onOpenCheckout}
                  className="w-full bg-blue-600 text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                >
                  <i className="fa-solid fa-lock text-sm"></i> Proceed to Secure Checkout
                </button>
                <a
                  href={`https://wa.me/919607643461?text=${generateWhatsAppOrderText()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#20ba5a] transition-colors shadow-sm no-underline text-center"
                >
                  <i className="fa-brands fa-whatsapp text-xl"></i> Complete Order via WhatsApp
                </a>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center">
                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-shield-halved text-blue-600 text-lg"></i>
                  <span className="text-[10px] text-gray-500">100% Genuine</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-truck-fast text-blue-600 text-lg"></i>
                  <span className="text-[10px] text-gray-500">Fast Akola Shipping</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <i className="fa-solid fa-headset text-blue-600 text-lg"></i>
                  <span className="text-[10px] text-gray-500">Expert Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
