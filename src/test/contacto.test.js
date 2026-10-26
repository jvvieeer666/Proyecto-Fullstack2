const validarFormulario = (datos) => {
  const errores = {}
  if (!datos.nombre.trim()) errores.nombre = 'El nombre es obligatorio.'
  if (!datos.email.trim()) {
    errores.email = 'El correo electrónico es obligatorio.'
  } else if (!/\S+@\S+\.\S+/.test(datos.email)) {
    errores.email = 'El correo no tiene un formato válido.'
  }
  if (!datos.mensaje.trim()) {
    errores.mensaje = 'El mensaje no puede estar vacío.'
  } else if (datos.mensaje.length < 10) {
    errores.mensaje = 'El mensaje debe tener al menos 10 caracteres.'
  }
  return errores
}

describe('Validaciones del Formulario de Contacto', () => {
  it('Debería retornar errores si los campos están vacíos', () => {
    const errores = validarFormulario({ nombre: '', email: '', mensaje: '' })
    expect(Object.keys(errores).length).toBe(3)
  })

  it('Debería detectar un correo electrónico inválido', () => {
    const errores = validarFormulario({ nombre: 'Juan', email: 'correo-malo', mensaje: 'Hola, tengo una duda.' })
    expect(errores.email).toBe('El correo no tiene un formato válido.')
  })

  it('Debería validar que el mensaje tenga al menos 10 caracteres', () => {
    const errores = validarFormulario({ nombre: 'Juan', email: 'juan@test.cl', mensaje: 'Hola' })
    expect(errores.mensaje).toBe('El mensaje debe tener al menos 10 caracteres.')
  })

  it('Debería pasar la validación si todos los datos son correctos', () => {
    const errores = validarFormulario({ nombre: 'Juan', email: 'juan@test.cl', mensaje: 'Hola, quiero comprar una consola.' })
    expect(Object.keys(errores).length).toBe(0)
  })

  it('Debería pasar la validación si el mensaje tiene exactamente 10 caracteres', () => {
    const errores = validarFormulario({ nombre: 'Ana', email: 'ana@test.cl', mensaje: '1234567890' })
    expect(Object.keys(errores).length).toBe(0)
  })
})