import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
});

export const getAllProducts = () => api.get('/products');

export const getProductById = (id) => api.get(`/products/${id}`);

export const getProductImageUrl = (productId) => `${API_BASE}/product/${productId}/image`;

export const addProduct = (product, imageFile) => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  formData.append('imageFile', imageFile);
  return api.post('/product', formData);
};

export const updateProduct = (id, product, imageFile) => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
  formData.append('imageFile', imageFile);
  return api.put(`/product/${id}`, formData);
};

export const deleteProduct = (id) => api.delete(`/product/${id}`);

export const searchProducts = (query) => api.get(`/products/search?query=${encodeURIComponent(query)}`);

export default api;
