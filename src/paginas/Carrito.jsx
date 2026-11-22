import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { Button, Table, Alert } from 'react-bootstrap'
import { getProductosV2, putProductoV2 } from '../servicios/apiProductos.js'

function formatearPrecio(valor) {
  if (isNaN(valor) || valor === undefined) return '$0'

  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  })
}

function Carrito() {
  const { cart, removeOne, removeItem, clearCart, totalPrice } = useCart()
  const [compraExitosa, setCompraExitosa] = useState(false)
  const [procesando, setProcesando] = useState(false)

  const handleFinalizarCompra = async () => {
    setProcesando(true)

    // Actualiza el stock en la API REST v2 al confirmar la compra
    const resCatalogo = await getProductosV2(false)
    if (resCatalogo.ok) {
      for (const item of cart) {
        const prodActual = resCatalogo.data.find((p) => p.id === item.id)
        if (prodActual) {
          const nuevoStock = Math.max(0, prodActual.stock - item.quantity)
          await putProductoV2(
            prodActual.id,
            { ...prodActual, stock: nuevoStock },
            'Bearer admin-token-checkout'
          )
        }
      }
    }

    setProcesando(false)
    setCompraExitosa(true)
    clearCart()

    setTimeout(() => {
      setCompraExitosa(false)
    }, 4000)
  }

  if (cart.length === 0) {
    return (
      <div className="container py-4">
        <h1>🛒 Tu carrito</h1>
        {compraExitosa && (
          <Alert variant="success">
            ¡Gracias por tu compra! Tu pedido ha sido procesado y el stock fue actualizado.
          </Alert>
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

      {compraExitosa && (
        <Alert variant="success">
          ¡Gracias por tu compra! Tu pedido ha sido procesado y el stock fue actualizado.
        </Alert>
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
          <Button variant="warning" className="me-2" onClick={clearCart} disabled={procesando}>
            Vaciar carrito
          </Button>
          <Button variant="success" onClick={handleFinalizarCompra} disabled={procesando}>
            {procesando ? 'Procesando...' : 'Finalizar compra'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Carrito