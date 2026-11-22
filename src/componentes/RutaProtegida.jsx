
import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function RutaProtegida({
  children,
  soloAdmin = false,
  rolesPermitidos = [],
}) {
  const { estaLogueado, usuario } = useAuth()

  if (!estaLogueado) {
    return <Navigate to="/login" replace />
  }

  const rol = usuario?.rol

  if (soloAdmin && rol !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaProtegida
