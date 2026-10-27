import { createContext, useState, useContext, useEffect } from 'react'

const AuthContext = createContext()

// Usuario admin por defecto (hardcodeado)
const ADMIN_POR_DEFECTO = {
  email: 'javier123@gmail.com',
  password: 'javier123',
  nombre: 'Administrador',
  rol: 'admin',
}

export function AuthProvider({ children }) {
  // Usuarios registrados (se cargan de localStorage o array vacío)
  const [usuarios, setUsuarios] = useState(() => {
    const guardados = localStorage.getItem('usuarios')
    return guardados ? JSON.parse(guardados) : []
  })

  // Usuario logueado actualmente
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('usuario')
    return guardado ? JSON.parse(guardado) : null
  })

  // Cada vez que cambian los usuarios, los guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('usuarios', JSON.stringify(usuarios))
  }, [usuarios])

  // Registrar un nuevo cliente
  const registrar = ({ nombre, email, password }) => {
    const emailNormalizado = email.trim().toLowerCase()

    // Verificar si ya existe
    const existe = usuarios.some((u) => u.email === emailNormalizado)
    if (existe) {
      return { ok: false, error: 'Ya existe una cuenta con ese correo.' }
    }

    // Verificar que no use el email del admin
    if (emailNormalizado === ADMIN_POR_DEFECTO.email) {
      return { ok: false, error: 'Ese correo no está disponible.' }
    }

    const nuevoUsuario = {
      nombre: nombre.trim(),
      email: emailNormalizado,
      password, // ⚠️ En un proyecto real NUNCA guardes contraseñas así
      rol: 'cliente',
    }

    setUsuarios((prev) => [...prev, nuevoUsuario])
    return { ok: true }
  }

  // Iniciar sesión (cliente o admin)
  const login = (email, password) => {
    const emailNormalizado = email.trim().toLowerCase()

    // 1. Verificar si es el admin por defecto
    if (
      emailNormalizado === ADMIN_POR_DEFECTO.email &&
      password === ADMIN_POR_DEFECTO.password
    ) {
      const adminLogueado = {
        nombre: ADMIN_POR_DEFECTO.nombre,
        email: ADMIN_POR_DEFECTO.email,
        rol: 'admin',
      }
      setUsuario(adminLogueado)
      localStorage.setItem('usuario', JSON.stringify(adminLogueado))
      return { ok: true, rol: 'admin' }
    }

    // 2. Buscar en usuarios registrados
    const encontrado = usuarios.find(
      (u) => u.email === emailNormalizado && u.password === password
    )

    if (!encontrado) {
      return { ok: false, error: 'Correo o contraseña incorrectos.' }
    }

    const clienteLogueado = {
      nombre: encontrado.nombre,
      email: encontrado.email,
      rol: 'cliente',
    }
    setUsuario(clienteLogueado)
    localStorage.setItem('usuario', JSON.stringify(clienteLogueado))
    return { ok: true, rol: 'cliente' }
  }

  // Cerrar sesión
  const logout = () => {
    setUsuario(null)
    localStorage.removeItem('usuario')
  }

  // Helpers
  const esAdmin = usuario?.rol === 'admin'
  const estaLogueado = !!usuario

  return (
    <AuthContext.Provider
      value={{
        usuario,
        usuarios,
        registrar,
        login,
        logout,
        esAdmin,
        estaLogueado,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>')
  }
  return ctx
}