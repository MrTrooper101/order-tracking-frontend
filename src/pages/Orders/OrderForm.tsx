import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsApi, ordersApi } from '../../api/index'
import { Card, Button, Input, Select, LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/UI'
import { ArrowLeft, Trash2, Plus } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  stockQuantity: number
}

interface OrderItem {
  productId: string | number
  quantity: number
}

interface FormDataType {
  customerName: string
  customerContactInfo: string
  paymentMethod: string | number
  items: OrderItem[]
}

const PAYMENT_METHODS = [
  { value: 1, label: 'Cash on Delivery (COD)' },
  { value: 2, label: 'Bank Transfer' },
  { value: 3, label: 'Wallet' }
]

export default function OrderForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [productsLoading, setProductsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [products, setProducts] = useState<Product[]>([])
  const [formData, setFormData] = useState<FormDataType>({
    customerName: '',
    customerContactInfo: '',
    paymentMethod: '',
    items: [{ productId: '', quantity: 1 }]
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setProductsLoading(true)
      const response = await productsApi.getAll()
      setProducts(response.data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setProductsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setFormData(prev => ({ ...prev, items: newItems }))
  }

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { productId: '', quantity: 1 }]
    }))
  }

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      const product = products.find(p => p.id === parseInt(String(item.productId)))
      return total + (product ? product.price * item.quantity : 0)
    }, 0)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      
      if (!formData.customerName || !formData.customerContactInfo) {
        setError('Customer name and contact are required')
        return
      }

      if (formData.items.some(item => !item.productId || !item.quantity)) {
        setError('All order items must have a product and quantity')
        return
      }

      await ordersApi.create({
        ...formData,
        paymentMethod: parseInt(String(formData.paymentMethod)),
        items: formData.items.map(item => ({
          productId: parseInt(String(item.productId)),
          quantity: parseInt(String(item.quantity))
        }))
      })
      setSuccess('Order created successfully')
      setTimeout(() => navigate('/orders'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  if (productsLoading) return <LoadingSpinner />

  return (
    <div>
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Orders</span>
      </button>

      <Card>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create New Order</h1>

        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit}>
          {/* Customer Info */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Customer Name"
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Contact Info (Phone/Email)"
                id="customerContactInfo"
                name="customerContactInfo"
                value={formData.customerContactInfo}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-8 pb-8 border-b">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
              <Button type="button" variant="secondary" onClick={addItem} className="flex items-center space-x-1">
                <Plus size={16} />
                <span>Add Item</span>
              </Button>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product</label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select Product</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() => removeItem(index)}
                    className="flex items-center justify-center w-full"
                  >
                    <Trash2 size={18} />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and Total */}
          <div className="mb-8 pb-8 border-b">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Payment Method"
                id="paymentMethod"
                name="paymentMethod"
                options={PAYMENT_METHODS}
                value={formData.paymentMethod}
                onChange={handleInputChange}
                required
              />
              <div className="flex items-end">
                <div className="w-full">
                  <p className="text-sm font-medium text-gray-700 mb-2">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-800">${calculateTotal().toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Order'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/orders')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
