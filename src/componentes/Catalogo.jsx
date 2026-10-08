import { Row, Col, Alert } from 'react-bootstrap'
import TarjetaProducto from './TarjetaProducto.jsx'

// Recibe un arreglo de productos y los dibuja en una grilla responsiva:
// 1 columna en móvil, 2 en tablet, 3 en escritorio.
function Catalogo({ productos }) {
  if (productos.length === 0) {
    return <Alert variant="warning">No hay productos para mostrar.</Alert>
  }

  return (
    <Row xs={1} sm={2} lg={3} className="g-4">
      {productos.map((producto) => (
        // key: identificador único para que React sepa qué tarjeta es cuál
        <Col key={producto.id}>
          <TarjetaProducto producto={producto} />
        </Col>
      ))}
    </Row>
  )
}

export default Catalogo