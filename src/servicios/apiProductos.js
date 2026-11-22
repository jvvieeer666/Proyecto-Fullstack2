
const API_URL = 'http://localhost:8081/api'

async function solicitud(endpoint, opciones = {}) {
  const url = `${API_URL}${endpoint}`

  try {
    const respuesta = await fetch(url, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...(opciones.token
          ? { Authorization: `Bearer ${opciones.token}` }
          : {}),
        ...opciones.headers,
      },
    })

    const texto = await respuesta.text()
    const data = texto ? JSON.parse(texto) : null

    return {
      ok: respuesta.ok,
      status: respuesta.status,
      statusText: respuesta.statusText,
      method: opciones.method || 'GET',
      url,
      data,
      error: respuesta.ok
        ? null
        : data?.message || data?.error || 'Error al comunicarse con el servidor.',
      timestamp: new Date().toLocaleString('es-CL'),
    }
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: 'Error de conexión',
      method: opciones.method || 'GET',
      url,
      data: null,
      error: 'No se pudo conectar con Spring Boot. Comprueba que esté iniciado.',
      timestamp: new Date().toLocaleString('es-CL'),
    }
  }
}

// Consultar todos los productos
export async function getProductosV2() {
  return solicitud('/productos')
}

// Consultar productos para administración
export async function getProductosV1(token) {
  return solicitud('/productos', { token })
}

// Consultar un producto
export async function getProductoPorIdV2(id) {
  return solicitud(`/productos/${id}`)
}

// Crear producto
export async function postProductoV1(producto, token) {
  return solicitud('/productos', {
    method: 'POST',
    token,
    body: JSON.stringify(producto),
  })
}

// Actualizar producto
export async function putProductoV2(id, producto, token) {
  return solicitud(`/productos/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(producto),
  })
}

// Eliminar producto
export async function deleteProductoV2(id, token) {
  return solicitud(`/productos/${id}`, {
    method: 'DELETE',
    token,
  })
}
