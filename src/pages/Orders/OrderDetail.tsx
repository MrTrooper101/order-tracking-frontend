import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ordersApi } from '../../api/index'
import { Card, Button, LoadingSpinner, ErrorAlert, SuccessAlert, StatusBadge, PaymentStatusBadge } from '../../components/UI'
import { ArrowLeft } from 'lucide-react'

interface OrderDetailData {
  id: number
  customerName: string
  totalAmount: number
  statusName: string
  paymentStatusName: string
  status: number
  paymentStatus: number
  items?: Array<any>
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

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState<OrderDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<number>(0)
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<number>(0)

  useEffect(() => {
    loadOrder()
  }, [id])

  const loadOrder = async () => {
    try {
      setLoading(true)
      const response = await ordersApi.getDetail(id!)
      setOrder(response.data)
      setSelectedStatus(response.data.status)
      setSelectedPaymentStatus(response.data.paymentStatus)
    } catch (err) {
      setError('Failed to load order details')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (selectedStatus === order?.status) {
      setError('Please select a different status')
      return
    }

    try {
      await ordersApi.updateStatus(id!, selectedStatus)
      setSuccess('Order status updated')
      setTimeout(() => loadOrder(), 1000)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update status')
      setSelectedStatus(order?.status || 0)
    }
  }

  const handlePaymentStatusUpdate = async () => {
    if (selectedPaymentStatus === order?.paymentStatus) {
      setError('Please select a different payment status')
      return
    }

    try {
      await ordersApi.updatePaymentStatus(id!, selectedPaymentStatus)
      setSuccess('Payment status updated')
      setTimeout(() => loadOrder(), 1000)
    } catch (err) {
      setError('Failed to update payment status')
      setSelectedPaymentStatus(order?.paymentStatus || 0)
    }
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order? Stock will be restored.')) return

    try {
      await ordersApi.cancel(id!)
      setSuccess('Order cancelled and stock restored')
      setTimeout(() => navigate('/orders'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to cancel order')
    }
  }

  if (loading) return <LoadingSpinner />
  if (!order) return <ErrorAlert message="Order not found" />

  return (
    <div>
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </button>

      <Card className="mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order #{order.id}</h1>
            <p className="text-gray-600">{order.customerName}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="text-3xl font-bold text-gray-800">${order.totalAmount.toFixed(2)}</p>
          </div>
        </div>

        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}

        {/* Order Status Management */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Status</label>
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                {ORDER_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Button onClick={handleStatusUpdate} variant="primary">
                Update
              </Button>
            </div>
            <div className="mt-2">
              <StatusBadge status={order.statusName} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <div className="flex gap-2">
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(parseInt(e.target.value))}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              >
                {PAYMENT_STATUSES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Button onClick={handlePaymentStatusUpdate} variant="primary">
                Update
              </Button>
            </div>
            <div className="mt-2">
              <PaymentStatusBadge status={order.paymentStatusName} />
            </div>
          </div>
        </div>

        {/* Order Items */}
        {order.items && order.items.length > 0 && (
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2">Product</th>
                    <th className="text-left py-2 px-2">Quantity</th>
                    <th className="text-left py-2 px-2">Price</th>
                    <th className="text-left py-2 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-2">{item.productName}</td>
                      <td className="py-2 px-2">{item.quantity}</td>
                      <td className="py-2 px-2">${item.price?.toFixed(2)}</td>
                      <td className="py-2 px-2">${(item.price * item.quantity)?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Cancel Button */}
        <Button onClick={handleCancel} variant="danger">
          Cancel Order
        </Button>
      </Card>
    </div>
  )
}
