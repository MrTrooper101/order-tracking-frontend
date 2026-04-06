import { Outlet, Link } from 'react-router-dom'
import { Package, ShoppingCart, Home } from 'lucide-react'

export default function Layout() {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">OTS</h1>
          <p className="text-sm text-gray-500">Order Tracking System</p>
        </div>
        
        <nav className="mt-6 space-y-2 px-4">
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-primary">
            <Home size={20} />
            <span>Dashboard</span>
          </Link>
          
          <Link to="/products" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-primary">
            <Package size={20} />
            <span>Products</span>
          </Link>
          
          <Link to="/orders" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 text-gray-700 hover:text-primary">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b px-8 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Welcome to Order Tracking System</h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
