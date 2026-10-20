import { Outlet } from 'react-router'
import { Container } from 'react-bootstrap' // (Puedes borrar esta línea si no usas Container aquí)

import BarraNavegacion from './BarraNavegacion.jsx'
import PiePagina from './PiePagina.jsx'

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 👈 Le quitamos la prop 'cantidad' porque ahora la lee del contexto */}
      <BarraNavegacion />
      
      <main className="flex-grow-1">
        <Outlet />
      </main>
      
      <PiePagina />
    </div>
  )
}

export default Layout