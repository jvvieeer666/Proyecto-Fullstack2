import { useCart } from '../context/CartContext'
import { Button, Table, Alert } from 'react-bootstrap'

// Mantenemos la función para que los precios se vean en formato chileno
function formatearPrecio(valor) {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  })
}

function Carrito() {
  // Traemos todas las funciones y datos de nuestro contexto
  const { cart, removeOne, removeItem, clearCart, totalPrice } = useCart()

  // Si el carrito está vacío, mostramos un mensaje
  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <h1>🛒 Tu carrito</h1>
        <Alert variant="info">Tu carrito está vacío. ¡Agrega productos desde el catálogo!</Alert>
      </div>
    )
  }

  // Si hay productos, dibujamos la tabla
  return (
    <div className="container py-4">
      <h1 className="mb-4">🛒 Tu carrito</h1>
      
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
          <Button variant="success">
            Finalizar compra
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Carrito