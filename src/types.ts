export interface Product {
  id: string;
  sku?: string;
  name: string;
  category: 'laptops' | 'desktops' | 'monitors' | 'components' | 'accessories' | 'printers' | 'software';
  brand: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  badge?: string;
  badges?: string[]; // e.g. ['SALE', 'NEW', 'BESTSELLER', 'HOT DEAL', 'FEATURED']
  inStock: boolean;
  availability?: 'In Stock' | 'Out of Stock' | 'Coming Soon';
  stockCount?: number;
  specs: {
    processor?: string;
    graphics?: string;
    ram?: string;
    storage?: string;
    display?: string;
    os?: string;
  };
  shortDescription: string;
  description: string;
  image: string;
  thumbnails: string[];
  rating: number;
  reviewsCount: number;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  offerText: string;
  buttonLabel?: string;
  destinationUrl?: string;
  displayOrder: number;
  isActive: boolean;
  isDraft: boolean;
  placement: 'Hero Carousel' | 'Promotional Section';
  startDate?: string;
  endDate?: string;
  image: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
