import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Container, Form, Button, Alert } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'

function Registro() {
  const navigate = useNavigate()
  const { registrar } = useAuth()

  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmar: '',
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState(false)

  const manejarCambio = (e) => {
    setDatos({ ...datos, [e.target.name]: e.target.value })
    if (error) setError('')
  }

  const manejarEnvio = (e) => {
    e.preventDefault()

    if (!datos.nombre.trim()) {
      return setError('El nombre es obligatorio.')
    }
    if (!/\S+@\S+\.\S+/.test(datos.email)) {
      return setError('El correo no tiene un formato válido.')
    }
    if (datos.password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres.')
    }
    if (datos.password !== datos.confirmar) {
      return setError('Las contraseñas no coinciden.')
    }

    const resultado = registrar(datos)
    if (!resultado.ok) {
      return setError(resultado.error)
    }

    setExito(true)
    setTimeout(() => navigate('/login'), 1500)
  }

  return (
    <Container className="py-5" style={{ maxWidth: '500px' }}>
      <h1 className="mb-3">Crear cuenta</h1>
      <p className="text-muted">Regístrate para comprar en Level-Up Gamer.</p>

      {error && <Alert variant="danger">{error}</Alert>}
      {exito && (
        <Alert variant="success">
          ¡Cuenta creada con éxito! Redirigiendo al login...
        </Alert>
      )}

      <Form onSubmit={manejarEnvio} noValidate>
        <Form.Group className="mb-3">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={datos.nombre}
            onChange={manejarCambio}
            placeholder="Ej: Juan Pérez"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={datos.email}
            onChange={manejarCambio}
            placeholder="Ej: juan@correo.cl"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={datos.password}
            onChange={manejarCambio}
            placeholder="Mínimo 6 caracteres"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Confirmar contraseña</Form.Label>
          <Form.Control
            type="password"
            name="confirmar"
            value={datos.confirmar}
            onChange={manejarCambio}
          />
        </Form.Group>

        <Button variant="success" type="submit" className="w-100">
          Registrarme
        </Button>
      </Form>

      <p className="text-center mt-3 text-muted">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </Container>
  )
}

export default Registro