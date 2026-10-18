import React, { useState } from 'react';
import { Product } from '../types';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose, onAddProduct }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Product['category']>('laptops');
  const [brand, setBrand] = useState('ASUS');
  const [price, setPrice] = useState(69990);
  const [processor, setProcessor] = useState('Intel Core i5');
  const [ram, setRam] = useState('16GB RAM');
  const [storage, setStorage] = useState('512GB SSD');
  const [imageUrl, setImageUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuDmd_uEhfP1SFxIhoyLyFI1buXEuVWO4WOF7cn8ko5C_jim40qyQrskxewW9zem8X-hX9FLkDIPppCEla6QQGh0JDC3CkpRwsse36z4Lf3aFnhl-x9P0cYMpap2FydxxDNbx1Z__HxKf8xjf7APsXBHdfK8uOl1dIJJd4Ssu7jXYxChF16YJF8LS30Nwto8hjOkTKmchHHf-t9MHTagjFCUCHG-t3TeXwwq3wduzsp2HN78g65e-uU5');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: 'p-' + Date.now(),
      name,
      category,
      brand,
      price: Number(price),
      inStock: true,
      stockCount: 10,
      specs: {
        processor,
        ram,
        storage,
        display: '15.6" FHD Display'
      },
      shortDescription: `${processor} | ${ram} | ${storage}`,
      description: 'Newly added high-performance item at YIDA Computers Akola & Nashik store.',
      image: imageUrl,
      thumbnails: [],
      rating: 4.8,
      reviewsCount: 1
    };
    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <i className="fa-solid fa-plus text-blue-600"></i> Add New Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ASUS ROG Zephyrus G14"
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Product['category'])}
                className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
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
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Brand</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Processor</label>
              <input
                type="text"
                value={processor}
                onChange={(e) => setProcessor(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">RAM</label>
              <input
                type="text"
                value={ram}
                onChange={(e) => setRam(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Storage</label>
              <input
                type="text"
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Image URL</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors mt-2"
          >
            Add Product to Catalog
          </button>
        </form>
      </div>
    </div>
  );
};
