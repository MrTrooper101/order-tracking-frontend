import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ordersApi } from '../../api/index'
import { Card, Button, LoadingSpinner, ErrorAlert, SuccessAlert, StatusBadge, PaymentStatusBadge } from '../../components/UI'
import { Plus, Eye } from 'lucide-react'

interface Order {
  id: number
  customerName: string
  totalAmount: number
  statusName: string
  paymentStatusName: string
  createdAt: string
}

interface Filters {
  filterStatus: string | number
  filterPaymentStatus: string | number
  searchCustomerName: string
}

const ORDER_STATUSES = [
  { value: 1, label: 'New' },
  { value: 2, label: 'Confirmed' },
  { value: 3, label: 'Paid' },
  { value: 4, label: 'Packed' },
  { value: 5, label: 'Shipped' },
  { value: 6, label: 'Delivered' },
  { value: 7, label: 'Cancelled' }
]

const PAYMENT_STATUSES = [
  { value: 1, label: 'Pending' },
  { value: 2, label: 'Paid' }
]

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success] = useState('')
  const [filters, setFilters] = useState<Filters>({
    filterStatus: '',
    filterPaymentStatus: '',
    searchCustomerName: ''
  })

  useEffect(() => {
    loadOrders()
  }, [filters])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await ordersApi.getAll(filters)
      setOrders(response.data)
    } catch (err) {
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <Link to="/orders/new">
          <Button className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Create Order</span>
          </Button>
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      {/* Filters */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              name="filterStatus"
              value={filters.filterStatus}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              name="filterPaymentStatus"
              value={filters.filterPaymentStatus}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">All Payment Status</option>
              {PAYMENT_STATUSES.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              name="searchCustomerName"
              value={filters.searchCustomerName}
              onChange={handleFilterChange}
              placeholder="Search customer..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold">Total</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Payment</th>
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">#{order.id}</td>
                    <td className="py-4 px-4">{order.customerName}</td>
                    <td className="py-4 px-4 font-semibold">${order.totalAmount.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={order.statusName} />
                    </td>
                    <td className="py-4 px-4">
                      <PaymentStatusBadge status={order.paymentStatusName} />
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Link to={`/orders/${order.id}`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Eye size={18} />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}
