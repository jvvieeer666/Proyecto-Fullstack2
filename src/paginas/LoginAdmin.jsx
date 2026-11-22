
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function LoginAdmin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    const resultado = await login(email, password)

    setCargando(false)

    if (!resultado.ok) {
      setError(resultado.error)
      return
    }

    if (resultado.rol !== 'ADMIN') {
      setError('Esta cuenta no tiene permisos de administrador.')
      return
    }

    navigate('/admin')
  }

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#07111f',
    }}>
      <div style={{
        backgroundColor: '#0d192a',
        padding: '40px',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid #203653',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ color: '#39ff14', fontSize: '32px' }}>⚡</span>
          <h2 style={{ color: '#fff' }}>
            Level-Up <span style={{ color: '#39ff14' }}>Admin</span>
          </h2>
          <p style={{ color: '#849dbb' }}>
            PANEL DE ADMINISTRACIÓN
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#3d1111',
            color: '#ff8a8a',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
          }}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <input
            type="email"
            placeholder="Correo de administrador"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={botonStyle} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Acceder al panel'}
          </button>
        </form>
      </div>
    </div>
  )
}

const inputStyle = {
  padding: '12px',
  borderRadius: '7px',
  border: '1px solid #29415f',
  backgroundColor: '#0b192b',
  color: '#edf4ff',
}

const botonStyle = {
  padding: '12px',
  backgroundColor: '#39ff14',
  color: '#07111f',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontWeight: 'bold',
}

export default LoginAdmin
