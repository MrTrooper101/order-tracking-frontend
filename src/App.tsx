import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import OrderDetail from './pages/Orders/OrderDetail'
import OrderForm from './pages/Orders/OrderForm'
import OrdersList from './pages/Orders/OrdersList'
import ProductForm from './pages/Products/ProductForm'
import ProductsList from './pages/Products/ProductsList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="orders" element={<OrdersList />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="orders/:id" element={<OrderDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
