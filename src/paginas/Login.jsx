import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      return setError('Por favor, llena ambos campos.')
    }

    const resultado = login(email, password)

    if (!resultado.ok) {
      return setError(resultado.error)
    }

    // Si es admin, va al panel; si es cliente, va al inicio
    if (resultado.rol === 'admin') {
      navigate('/admin')
    } else {
      navigate('/')
    }
  }

  return (
    <Container className="py-5" style={{ maxWidth: '450px' }}>
      <h1 className="mb-3">Iniciar sesión</h1>
      <p className="text-muted">Accede a tu cuenta de Level-Up Gamer.</p>

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
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Ingresar
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