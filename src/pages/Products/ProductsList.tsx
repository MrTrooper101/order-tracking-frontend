import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productsApi } from '../../api/index'
import { Card, Button, LoadingSpinner, ErrorAlert, SuccessAlert } from '../../components/UI'
import { Plus, Edit2, Trash2 } from 'lucide-react'

interface Product {
  id: number
  name: string
  price: number
  stockQuantity: number
}

export default function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const response = await productsApi.getAll()
      setProducts(response.data)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await productsApi.delete(id)
      setSuccess('Product deleted successfully')
      loadProducts()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Products</h1>
        <Link to="/products/new">
          <Button className="flex items-center space-x-2">
            <Plus size={20} />
            <span>Add Product</span>
          </Button>
        </Link>
      </div>

      {error && <ErrorAlert message={error} />}
      {success && <SuccessAlert message={success} />}

      <Card>
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products found. Create your first product!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Price</th>
                  <th className="text-left py-3 px-4 font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">{product.name}</td>
                    <td className="py-4 px-4 font-semibold">${product.price.toFixed(2)}</td>
                    <td className="py-4 px-4">
                      <span className={product.stockQuantity < 10 ? 'text-red-600 font-semibold' : ''}>
                        {product.stockQuantity}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex space-x-2">
                      <Link to={`/products/${product.id}/edit`}>
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit2 size={18} />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
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
