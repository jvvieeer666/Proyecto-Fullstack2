import { useState } from 'react' // Importamos useState para el mensaje
import { useCart } from '../context/CartContext'
import { Button, Table, Alert } from 'react-bootstrap'

function formatearPrecio(valor) {
  // Protección por si valor es undefined o NaN
  if (isNaN(valor) || valor === undefined) return '$0';
  
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  })
}

function Carrito() {
  const { cart, removeOne, removeItem, clearCart, totalPrice } = useCart()
  
  // Estado para controlar el mensaje de compra realizada
  const [compraExitosa, setCompraExitosa] = useState(false)

  // Función para finalizar la compra
  const handleFinalizarCompra = () => {
    // 1. Mostrar mensaje
    setCompraExitosa(true)
    
    // 2. Vaciar el carrito usando la función de tu contexto
    clearCart()

    // 3. Ocultar el mensaje después de 3 segundos (opcional)
    setTimeout(() => {
      setCompraExitosa(false)
    }, 3000)
  }

  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <h1>🛒 Tu carrito</h1>
        {/* Si la compra fue exitosa, mostramos el mensaje de éxito incluso si el carrito está vacío */}
        {compraExitosa && (
          <Alert variant="success">¡Gracias por tu compra! Tu pedido ha sido procesado.</Alert>
        )}
        {!compraExitosa && (
          <Alert variant="info">Tu carrito está vacío. ¡Agrega productos desde el catálogo!</Alert>
        )}
      </div>
    )
  }

  return (
    <div className="container py-4">
      <h1 className="mb-4">🛒 Tu carrito</h1>
      
      {/* Mostramos el mensaje de éxito aquí también */}
      {compraExitosa && (
        <Alert variant="success">¡Gracias por tu compra! Tu pedido ha sido procesado.</Alert>
      )}

      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cart.map((item) => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>{formatearPrecio(item.precio)}</td>
              <td>
                <Button 
                  variant="outline-secondary" 
                  size="sm" 
                  onClick={() => removeOne(item.id)}
                >
                  -
                </Button>
                <span className="mx-2">{item.quantity}</span>
              </td>
              <td>{formatearPrecio(item.precio * item.quantity)}</td>
              <td>
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={() => removeItem(item.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex justify-content-between align-items-center mt-4">
        <h3>Total: {formatearPrecio(totalPrice)}</h3>
        <div>
          <Button variant="warning" className="me-2" onClick={clearCart}>
            Vaciar carrito
          </Button>
          {/* Aquí agregamos el onClick para que funcione */}
          <Button variant="success" onClick={handleFinalizarCompra}>
            Finalizar compra
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Carrito