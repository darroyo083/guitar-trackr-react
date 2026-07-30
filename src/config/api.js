const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3020').replace(/\/+$/, '');

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}

export const apiUrl = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${cleanPath}`;
};

export const authHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});
