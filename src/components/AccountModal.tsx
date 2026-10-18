import React, { useState } from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (name: string) => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLoginSuccess(email ? email.split('@')[0] : 'Valued Customer');
    } else {
      onLoginSuccess(name || 'New Customer');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-blue-600">YIDA COMPUTERS</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? 'Login to your account' : 'Create a new customer account'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address / Phone</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com or +91..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-md"
          >
            {isLogin ? 'Login' : 'Register Account'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-bold hover:underline"
          >
            {isLogin ? 'Register now' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
