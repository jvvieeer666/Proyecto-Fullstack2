
import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Container, Form, Button, Alert, Spinner } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor, llena ambos campos.')
      return
    }

    setCargando(true)

    try {
      const resultado = await login(email, password)

      if (!resultado.ok) {
        setError(resultado.error)
        return
      }

      // Redirección según el rol del usuario.
      if (resultado.rol === 'ADMIN') {
        navigate('/admin', { replace: true })
      } else if (resultado.rol === 'VENDEDOR') {
        navigate('/vendedor', { replace: true })
      } else if (resultado.rol === 'CLIENTE') {
        navigate('/', { replace: true })
      } else {
        setError('El usuario tiene un rol no reconocido.')
      }
    } catch {
      setError('Ocurrió un error al iniciar sesión.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '450px' }}>
      <h1 className="mb-3">Iniciar sesión</h1>
      <p className="text-muted">
        Accede a tu cuenta de Level-Up Gamer.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.cl"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
          />
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          className="w-100"
          disabled={cargando}
        >
          {cargando ? (
            <>
              <Spinner size="sm" className="me-2" />
              Ingresando...
            </>
          ) : (
            'Ingresar'
          )}
        </Button>
      </Form>

      <p className="text-center mt-3 text-muted">
        ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
      </p>

      <hr />

      <p className="text-center text-muted small">
        ¿Eres administrador? <Link to="/login-admin">Accede aquí</Link>
      </p>
    </Container>
  )
}

export default Login
