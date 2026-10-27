import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'

function LoginAdmin() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const resultado = login(email, password)

    if (!resultado.ok) {
      return setError(resultado.error)
    }

    if (resultado.rol !== 'admin') {
      setError('Esta cuenta no tiene permisos de administrador.')
      return
    }

    navigate('/admin')
  }

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#07111f',
      }}
    >
      <div
        style={{
          backgroundColor: '#0d192a',
          padding: '40px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '400px',
          border: '1px solid #203653',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <span style={{ color: '#39ff14', fontSize: '32px' }}>⚡</span>
          <h2 style={{ color: '#fff', margin: '10px 0 5px' }}>
            Level-Up <span style={{ color: '#39ff14' }}>Admin</span>
          </h2>
          <p style={{ color: '#849dbb', fontSize: '12px', letterSpacing: '1.5px' }}>
            PANEL DE ADMINISTRACIÓN
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#3d1111',
              color: '#ff8a8a',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '13px',
            }}
          >
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
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={botonStyle}>
            Acceder al panel
          </button>
        </form>

        <div
          style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#102b27',
            border: '1px solid #1c483a',
            borderRadius: '6px',
            fontSize: '11px',
            color: '#91a8c5',
          }}
        >
          <strong style={{ color: '#39ff14' }}>Demo:</strong>
          <br />
          Email: admin@levelupgamer.cl
          <br />
          Contraseña: admin123
        </div>
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
  fontSize: '14px',
  outline: 'none',
}

const botonStyle = {
  padding: '12px',
  backgroundColor: '#39ff14',
  color: '#07111f',
  border: 'none',
  borderRadius: '7px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '14px',
}

export default LoginAdmin