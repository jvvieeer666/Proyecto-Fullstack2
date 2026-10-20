import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import App from './App.jsx'
import { CartProvider } from './context/CartContext' // 👈 1. Importamos el Provider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>  {/* 👈 2. Envolvemos la App */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>,
)