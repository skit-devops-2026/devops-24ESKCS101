// Small helper functions used by many pages

export const formatPrice = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

export const imageUrl = (fileName) => `/uploads/${fileName}`;

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

// Gets a readable error message from an Axios error
export const getError = (error) =>
  error.response?.data?.message || 'Cannot reach the server. Is the backend running?';

// WhatsApp link: wa.me needs only digits (with country code)
export const whatsappLink = (phone) => `https://wa.me/${phone.replace(/\D/g, '')}`;

export const statusText = {
  pending: 'In negotiation',
  agreed: 'Price agreed',
  completed: 'Completed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  closed: 'Book sold elsewhere',
};
