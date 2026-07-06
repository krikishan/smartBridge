export const CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Living',
  'Sports',
  'Books',
  'Beauty',
  'Toys',
  'Groceries',
];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'name_asc', label: 'Name: A to Z' },
  { value: 'name_desc', label: 'Name: Z to A' },
];

export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 500 },
  { label: '₹500 — ₹2,000', min: 500, max: 2000 },
  { label: '₹2,000 — ₹5,000', min: 2000, max: 5000 },
  { label: '₹5,000 — ₹15,000', min: 5000, max: 15000 },
  { label: '₹15,000 — ₹50,000', min: 15000, max: 50000 },
  { label: 'Above ₹50,000', min: 50000, max: null },
];

export const ORDER_STATUSES = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

export const PAYMENT_METHODS = [
  { value: 'COD', label: 'Cash on Delivery', icon: 'cash' },
  { value: 'UPI', label: 'UPI Payment', icon: 'upi' },
  { value: 'Card', label: 'Credit / Debit Card', icon: 'card' },
];
