export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const getDiscountedPrice = (price, discount) => {
  if (!discount) return price;
  return Math.round(price - (price * discount) / 100);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const map = {
    Processing: 'badge-warning',
    Confirmed: 'badge-accent',
    Shipped: 'badge-accent',
    Delivered: 'badge-success',
    Cancelled: 'badge-danger',
  };
  return map[status] || 'badge-neutral';
};

export const truncateText = (text, maxLength = 80) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
