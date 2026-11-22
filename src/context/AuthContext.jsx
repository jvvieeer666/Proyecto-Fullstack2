
import {
  createContext,
  useState,
  useContext,
} from 'react'

const AuthContext = createContext()

const API_URL = 'http://localhost:8081/api/auth'

function obtenerRol(datos) {
  const rol = datos?.rol || datos?.role || datos?.usuario?.rol || 'CLIENTE'
  return String(rol).toUpperCase()
}

function obtenerToken(datos) {
  return datos?.token || datos?.accessToken || datos?.jwt || datos?.usuario?.token
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('usuario')) || null
    } catch {
      return null
    }
  })

  const token = usuario?.token || null
  const estaLogueado = Boolean(token)
  const esAdmin = usuario?.rol === 'ADMIN'
  const esVendedor = usuario?.rol === 'VENDEDOR'

  async function registrar({ nombre, email, password }) {
    try {
      const respuesta = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        return {
          ok: false,
          error: data.message || data.error || 'No se pudo registrar el usuario.',
        }
      }

      return { ok: true, data }
    } catch {
      return {
        ok: false,
        error: 'No se pudo conectar con el servidor.',
      }
    }
  }

  async function login(email, password) {
    try {
      const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      })

      const data = await respuesta.json().catch(() => ({}))

      if (!respuesta.ok) {
        return {
          ok: false,
          error: data.message || data.error || 'Correo o contraseña incorrectos.',
        }
      }

      const jwt = obtenerToken(data)

      if (!jwt) {
        return {
          ok: false,
          error: 'El servidor no entregó un token JWT. Revisa AuthResponse en Spring Boot.',
        }
      }

      const usuarioLogueado = {
        nombre: data.nombre || data.usuario?.nombre || email,
        email: data.email || data.usuario?.email || email,
        rol: obtenerRol(data),
        token: jwt,
      }

      setUsuario(usuarioLogueado)
      localStorage.setItem('usuario', JSON.stringify(usuarioLogueado))

      return {
        ok: true,
        rol: usuarioLogueado.rol,
      }
    } catch {
      return {
        ok: false,
        error: 'No se pudo conectar con Spring Boot.',
      }
    }
  }

  function logout() {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        registrar,
        login,
        logout,
        esAdmin,
        esVendedor,
        estaLogueado,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }

  return contexto
}
