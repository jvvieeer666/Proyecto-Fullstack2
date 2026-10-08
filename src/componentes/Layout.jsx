import { Outlet } from 'react-router'
import { Container } from 'react-bootstrap'

import BarraNavegacion from './BarraNavegacion.jsx'
import PiePagina from './PiePagina.jsx'

// El Layout dibuja el marco de la página.
// <Outlet /> marca dónde se dibuja cada página hija según la ruta.
function Layout() {
  // Por ahora el carrito está vacío. Lo conectaremos después.
  const cantidadCarrito = 0

  return (
    <div className="d-flex flex-column min-vh-100">
      <BarraNavegacion cantidad={cantidadCarrito} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}

export default Layout