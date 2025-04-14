// src/utils/dateUtils.js

// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Format date to time
export const formatTime = (dateString) => {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('en-US', options);
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
};

// Group transactions by date
export const groupByDate = (transactions) => {
  const grouped = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toLocaleDateString('en-US');
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(transaction);
  });

  return grouped;
};

export const getMonthsArray = () => {
  return [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
};

export const getYearsArray = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString(),
  }));
};

export const getCurrentMonth = () => new Date().getMonth() + 1;
export const getCurrentYear = () => new Date().getFullYear();

// Add missing date utility functions
export const getStartOfMonth = (year, month) => {
  return new Date(year, month - 1, 1);
};

export const getEndOfMonth = (year, month) => {
  return new Date(year, month, 0, 23, 59, 59, 999);
};

export const getStartOfYear = (year) => {
  return new Date(year, 0, 1);
};

export const getEndOfYear = (year) => {
  return new Date(year, 11, 31, 23, 59, 59, 999);
};

export const getStartOfDay = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const getEndOfDay = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
};