import axios, { AxiosInstance } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

interface FilterParams {
  filterStatus?: string | number
  filterPaymentStatus?: string | number
  searchCustomerName?: string
}

interface ProductData {
  name: string
  price: number
  stockQuantity: number
}

interface OrderData {
  customerName: string
  customerContactInfo: string
  paymentMethod: number
  items: Array<{ productId: number; quantity: number }>
}

// Products API
export const productsApi = {
  getAll: () => api.get('/products'),
  getById: (id: string | number) => api.get(`/products/${id}`),
  create: (data: ProductData) => api.post('/products', data),
  update: (id: string | number, data: ProductData) => api.put(`/products/${id}`, data),
  delete: (id: string | number) => api.delete(`/products/${id}`)
}

// Orders API
export const ordersApi = {
  getAll: (filters: FilterParams) => api.get('/orders', { params: filters }),
  getDetail: (id: string | number) => api.get(`/orders/${id}`),
  create: (data: OrderData) => api.post('/orders', data),
  updateStatus: (id: string | number, status: number) => api.put(`/orders/${id}/status`, { status }),
  updatePaymentStatus: (id: string | number, paymentStatus: number) => api.put(`/orders/${id}/payment-status`, { paymentStatus }),
  cancel: (id: string | number) => api.post(`/orders/${id}/cancel`)
}

// Dashboard API
export const dashboardApi = {
  getMetrics: () => api.get('/dashboard/metrics')
}

export default api
