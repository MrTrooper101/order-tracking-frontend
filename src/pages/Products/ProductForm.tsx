import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { productsApi } from '../../api/index'
import { Card, Button, Input, ErrorAlert, SuccessAlert } from '../../components/UI'
import { ArrowLeft } from 'lucide-react'

interface ProductFormData {
  name: string
  price: string | number
  stockQuantity: string | number
}

export default function ProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    stockQuantity: ''
  })

  useEffect(() => {
    if (id) {
      loadProduct()
    }
  }, [id])

  const loadProduct = async () => {
    try {
      setLoading(true)
      const response = await productsApi.getById(id!)
      setFormData(response.data)
    } catch (err) {
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const submitData = {
        name: formData.name,
        price: typeof formData.price === 'string' ? parseFloat(formData.price) : formData.price,
        stockQuantity: typeof formData.stockQuantity === 'string' ? parseInt(formData.stockQuantity) : formData.stockQuantity
      }
      if (id) {
        await productsApi.update(id, submitData)
        setSuccess('Product updated successfully')
      } else {
        await productsApi.create(submitData)
        setSuccess('Product created successfully')
      }
      setTimeout(() => navigate('/products'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate('/products')}
        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to Products</span>
      </button>

      <Card className="max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {id ? 'Edit Product' : 'Add New Product'}
        </h1>

        {error && <ErrorAlert message={error} />}
        {success && <SuccessAlert message={success} />}

        <form onSubmit={handleSubmit}>
          <Input
            label="Product Name"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Price"
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <Input
            label="Stock Quantity"
            id="stockQuantity"
            name="stockQuantity"
            type="number"
            min="0"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
          />

          <div className="flex space-x-3 mt-6">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/products')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
