import { useState } from 'react'
import { Container, Form, Button, Alert } from 'react-bootstrap'

function Contacto() {
  // 1. Estado para guardar los datos del formulario
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    mensaje: ''
  })

  // 2. Estado para los errores de validación
  const [errores, setErrores] = useState({})
  
  // 3. Estado para saber si se envió con éxito
  const [enviado, setEnviado] = useState(false)

  // Función para actualizar los campos mientras el usuario escribe
  const manejarCambio = (e) => {
    const { name, value } = e.target
    setDatos({ ...datos, [name]: value })
    // Si había un error en este campo, lo borramos al escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: null })
    }
  }

  // Función que valida y envía el formulario
  const manejarEnvio = (e) => {
    e.preventDefault() // Evita que la página se recargue
    const nuevosErrores = {}

    // Validaciones
    if (!datos.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio.'
    }
    
    if (!datos.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio.'
    } else if (!/\S+@\S+\.\S+/.test(datos.email)) {
      nuevosErrores.email = 'El correo no tiene un formato válido.'
    }
    
    if (!datos.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje no puede estar vacío.'
    } else if (datos.mensaje.length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
    }

    // Si hay errores, los guardamos y no enviamos
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      setEnviado(false)
      return
    }

    // Si todo está bien, "enviamos" el formulario
    setErrores({})
    setEnviado(true)
    // Limpiamos los campos
    setDatos({ nombre: '', email: '', mensaje: '' })
  }

  return (
    <Container className="py-5" style={{ maxWidth: '600px' }}>
      <h1 className="mb-4">Contáctanos</h1>
      <p className="text-muted">¿Tienes alguna duda sobre tu setup? ¡Escríbenos!</p>

      {/* Mensaje de éxito al enviar */}
      {enviado && (
        <Alert variant="success">
          ¡Mensaje enviado con éxito! Te responderemos a la brevedad.
        </Alert>
      )}

      <Form onSubmit={manejarEnvio} noValidate>
        {/* Campo Nombre */}
        <Form.Group className="mb-3" controlId="formNombre">
          <Form.Label>Nombre completo</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            placeholder="Ej: Juan Pérez"
            value={datos.nombre}
            onChange={manejarCambio}
            isInvalid={!!errores.nombre} // Si hay error, se pone rojo
          />
          <Form.Control.Feedback type="invalid">
            {errores.nombre}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Campo Correo */}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            placeholder="Ej: juan@correo.cl"
            value={datos.email}
            onChange={manejarCambio}
            isInvalid={!!errores.email}
          />
          <Form.Control.Feedback type="invalid">
            {errores.email}
          </Form.Control.Feedback>
        </Form.Group>

        {/* Campo Mensaje */}
        <Form.Group className="mb-4" controlId="formMensaje">
          <Form.Label>Mensaje</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="mensaje"
            placeholder="Escribe tu consulta aquí..."
            value={datos.mensaje}
            onChange={manejarCambio}
            isInvalid={!!errores.mensaje}
          />
          <Form.Control.Feedback type="invalid">
            {errores.mensaje}
          </Form.Control.Feedback>
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Enviar mensaje
        </Button>
      </Form>
    </Container>
  )
}

export default Contacto