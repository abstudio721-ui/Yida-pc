import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onOrderComplete: (orderData: { name: string; phone: string; fulfillment: string; address?: string; notes?: string; total: number; subtotal: number; discount: number }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  onOrderComplete,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [name, setName] = useState('Rahul Deshmukh');
  const [phone, setPhone] = useState('+91 9607643461');
  const [fulfillment, setFulfillment] = useState<'Home Delivery' | 'Store Pickup in Akola'>('Home Delivery');
  const [address, setAddress] = useState('Civil Lines, near Bus Stand, Akola, Maharashtra 444001');
  const [notes, setNotes] = useState('');
  const [promoInput, setPromoInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discount = appliedDiscount ? Math.round(subtotal * 0.05) : 0;
  const finalTotal = subtotal - discount;

  const inrFormatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === 'YIDA10') {
      setAppliedDiscount(true);
      alert('Promo code YIDA10 applied successfully! 5% discount added.');
    } else {
      alert('Invalid promo code. Try "YIDA10".');
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    if (!name.trim() || !phone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }
    if (fulfillment === 'Home Delivery' && !address.trim()) {
      alert('Please provide a delivery address for Home Delivery.');
      return;
    }

    const orderRef = '#YD-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedRef(orderRef);

    // Build WhatsApp message strictly according to requested structure
    let itemsText = '';
    cart.forEach((item, index) => {
      itemsText += `${index + 1}. ${item.product.name}\n   Quantity: ${item.quantity}\n   Unit Price: ${inrFormatter.format(item.product.price)}\n   Line Total: ${inrFormatter.format(item.product.price * item.quantity)}\n\n`;
    });

    const msg = `YIDA COMPUTERS AKOLA — NEW ORDER

Order Reference: ${orderRef}
Customer Name: ${name}
Phone: ${phone}
Fulfilment: ${fulfillment}

ITEMS:

${itemsText.trim()}

Subtotal: ${inrFormatter.format(subtotal)}
Discount: ${inrFormatter.format(discount)}
Final Total: ${inrFormatter.format(finalTotal)}

${fulfillment === 'Home Delivery' ? `Delivery Address: ${address}\n` : ''}${notes.trim() ? `Customer Notes: ${notes}\n` : ''}
Please confirm product availability, final order details, and fulfilment with the customer.`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/919607643461?text=${encodedMsg}`;

    // Record order locally as pending
    onOrderComplete({
      name,
      phone,
      fulfillment,
      address: fulfillment === 'Home Delivery' ? address : undefined,
      notes: notes.trim() ? notes : undefined,
      total: finalTotal,
      subtotal,
      discount
    });

    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    setStep('success');
  };

  const handleFinish = () => {
    setStep('form');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative my-8 border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        {step === 'form' ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                <i className="fa-solid fa-lock text-blue-600"></i> Checkout via WhatsApp
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Complete your order details. This will securely open WhatsApp with <strong className="text-gray-800">YIDA Computers Akola (+91 9607643461)</strong>.
              </p>
            </div>

            {/* Order summary box */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs">
              <div className="flex justify-between font-bold text-gray-700">
                <span>Items ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
                <span>{inrFormatter.format(subtotal)}</span>
              </div>
              {appliedDiscount && (
                <div className="flex justify-between text-green-600 font-bold">
                  <span>YIDA10 Discount (5%):</span>
                  <span>-{inrFormatter.format(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-gray-900 border-t pt-2">
                <span>Final Payable Total:</span>
                <span className="text-blue-600">{inrFormatter.format(finalTotal)}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="Enter promo code (e.g. YIDA10)"
                className="flex-1 px-3 py-2 border rounded-xl text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 cursor-pointer transition-colors">
                Apply Code
              </button>
            </form>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number (WhatsApp)</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Fulfillment Method</label>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <label className={`p-3 border-2 rounded-xl cursor-pointer text-center font-bold transition-all ${fulfillment === 'Home Delivery' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillment === 'Home Delivery'}
                      onChange={() => setFulfillment('Home Delivery')}
                      className="hidden"
                    />
                    <i className="fa-solid fa-truck mb-1 block text-base"></i> Home Delivery
                  </label>
                  <label className={`p-3 border-2 rounded-xl cursor-pointer text-center font-bold transition-all ${fulfillment === 'Store Pickup in Akola' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200'}`}>
                    <input
                      type="radio"
                      name="fulfillment"
                      checked={fulfillment === 'Store Pickup in Akola'}
                      onChange={() => setFulfillment('Store Pickup in Akola')}
                      className="hidden"
                    />
                    <i className="fa-solid fa-store mb-1 block text-base"></i> Store Pickup (Akola)
                  </label>
                </div>
              </div>

              {fulfillment === 'Home Delivery' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Delivery Address in Akola / Maharashtra</label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Customer Notes (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Need urgent delivery or specific RAM upgrade"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <i className="fa-brands fa-whatsapp text-xl"></i> Send Order via WhatsApp (+91 9607643461)
              </button>
            </form>
          </div>
        ) : (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900">WhatsApp Order Prepared!</h3>
            <p className="text-xs text-gray-600 max-w-xs mx-auto leading-relaxed">
              Reference: <strong className="text-gray-900 font-mono">{generatedRef}</strong><br />
              WhatsApp has opened with your order summary to <strong className="text-gray-900">+91 9607643461</strong>.<br /><br />
              <em className="text-gray-500">Note: Order confirmation happens after YIDA Computers Akola verifies and confirms your message.</em>
            </p>
            <button
              onClick={handleFinish}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors shadow-md cursor-pointer"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
