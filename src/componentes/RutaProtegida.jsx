import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function RutaProtegida({ children, soloAdmin = false }) {
  const { estaLogueado, esAdmin } = useAuth()

  if (!estaLogueado) {
    return <Navigate to="/login" replace />
  }

  if (soloAdmin && !esAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RutaProtegida