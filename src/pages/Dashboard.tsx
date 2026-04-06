import { useState, useEffect } from 'react'
import { dashboardApi } from '../api/index'
import { Card, LoadingSpinner, ErrorAlert, StatusBadge } from '../components/UI'
import { TrendingUp, AlertCircle, Clock, Package } from 'lucide-react'

interface DashboardMetrics {
  totalOrders: number
  pendingPayments: number
  ordersNotDelivered: number
  lowStockProducts: number
  recentOrders?: Array<any>
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadMetrics()
  }, [])

  const loadMetrics = async () => {
    try {
      setLoading(true)
      const response = await dashboardApi.getMetrics()
      setMetrics(response.data)
    } catch (err) {
      setError('Failed to load dashboard metrics')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorAlert message={error} />

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{metrics?.totalOrders}</p>
            </div>
            <TrendingUp size={40} className="text-blue-500 opacity-20" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600">{metrics?.pendingPayments}</p>
            </div>
            <AlertCircle size={40} className="text-yellow-500 opacity-20" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Orders Not Delivered</p>
              <p className="text-3xl font-bold text-orange-600">{metrics?.ordersNotDelivered}</p>
            </div>
            <Clock size={40} className="text-orange-500 opacity-20" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Low Stock Products</p>
              <p className="text-3xl font-bold text-red-600">{metrics?.lowStockProducts}</p>
            </div>
            <Package size={40} className="text-red-500 opacity-20" />
          </div>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Orders</h2>
        {metrics?.recentOrders && metrics.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Order ID</th>
                  <th className="text-left py-2 px-2">Customer</th>
                  <th className="text-left py-2 px-2">Total</th>
                  <th className="text-left py-2 px-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2 px-2 font-medium">#{order.id}</td>
                    <td className="py-2 px-2">{order.customerName}</td>
                    <td className="py-2 px-2 font-semibold">${order.totalAmount?.toFixed(2)}</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={order.statusName} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No recent orders</p>
        )}
      </Card>
    </div>
  )
}
