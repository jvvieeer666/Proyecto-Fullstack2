import { Outlet } from 'react-router' // 👈 Sin -dom

import BarraNavegacion from './BarraNavegacion.jsx'
import PiePagina from './PiePagina.jsx'

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <BarraNavegacion />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  )
}

export default Layout 