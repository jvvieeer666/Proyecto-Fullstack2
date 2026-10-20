import { Card, Badge, Button } from 'react-bootstrap'
import { useCart } from '../context/CartContext' // 👈 1. Importamos el hook

// Convierte 59990 en "$59.990"
function formatearPrecio(valor) {
  return valor.toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
  })
}

function TarjetaProducto({ producto }) {
  // 👈 2. Traemos la función addToCart del contexto
  const { addToCart } = useCart(); 
  
  // 👈 Agregamos 'id' a la desestructuración
  const { id, nombre, categoria, precio, stock, imagen, descripcion } = producto
  const agotado = stock === 0

  return (
    <Card className="tarjeta-producto shadow-sm">
      <Card.Img
        variant="top"
        src={imagen}
        alt={nombre}
        style={{ height: '200px', objectFit: 'cover' }}
      />
      <Card.Body className="d-flex flex-column">
        <Badge bg="secondary" className="align-self-start mb-2">
          {categoria}
        </Badge>
        <Card.Title className="h6">{nombre}</Card.Title>
        <Card.Text className="text-muted small">{descripcion}</Card.Text>
        <Card.Text className="fs-5 fw-semibold mt-auto">
          {formatearPrecio(precio)}
        </Card.Text>
        <Card.Text className={agotado ? 'text-danger' : 'text-success'}>
          {agotado ? 'Sin stock' : `Quedan ${stock} unidades`}
        </Card.Text>
        
        {/* 👈 3. Conectamos el botón */}
        <Button 
          variant="primary" 
          disabled={agotado}
          onClick={() => addToCart(producto)}
        >
          Agregar al carrito
        </Button>
      </Card.Body>
    </Card>
  )
}

export default TarjetaProducto