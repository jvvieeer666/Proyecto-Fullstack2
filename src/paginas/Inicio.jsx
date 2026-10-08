import { Container } from 'react-bootstrap'
import productos from '../datos/productos.js'
import Catalogo from '../componentes/Catalogo.jsx'

function Inicio() {
  return (
    <>
      {/* Portada */}
      <header className="portada py-5 mb-4">
        <Container>
          <h1 className="display-5 fw-bold">🎮 Level-Up Gamer</h1>
          <p className="lead mb-0">
            Tu mundo gamer, todo en un solo lugar · Sube de nivel tu setup
          </p>
        </Container>
      </header>

      {/* Catálogo */}
      <Container>
        <h2 className="mb-4">Nuestros productos</h2>
        <Catalogo productos={productos} />
      </Container>
    </>
  )
}

export default Inicio