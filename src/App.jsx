import { Routes, Route } from 'react-router'

import Layout from './componentes/Layout.jsx'
import Inicio from './paginas/Inicio.jsx'
import Nosotros from './paginas/Nosotros.jsx'
import Contacto from './paginas/Contacto.jsx'
import Carrito from './paginas/Carrito.jsx'
import NoEncontrada from './paginas/NoEncontrada.jsx'
import Admin from './paginas/Admin.jsx'
import Login from './paginas/Login.jsx'
import Registro from './paginas/Registro.jsx'
import LoginAdmin from './paginas/LoginAdmin.jsx'
import RutaProtegida from './componentes/RutaProtegida.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="login-admin" element={<LoginAdmin />} />
        <Route
          path="admin"
          element={
            <RutaProtegida soloAdmin>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default App