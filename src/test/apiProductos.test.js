import { describe, it, expect, beforeEach } from 'vitest'
import {
  getProductosV1,
  postProductoV1,
  getProductosV2,
  getProductoPorIdV2,
  putProductoV2,
  deleteProductoV2,
} from '../servicios/apiProductos.js'

const TOKEN_ADMIN = 'Bearer admin-token-test'

describe('Integración API REST Productos v1 y v2', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('GET /v2/productos público retorna 200 OK y el listado inicial', async () => {
    const res = await getProductosV2(false)
    expect(res.status).toBe(200)
    expect(res.ok).toBe(true)
    expect(res.data.length).toBeGreaterThan(0)
  })

  it('GET /v2/productos retorna 500 cuando ocurre error en el servidor', async () => {
    const res = await getProductosV2(true)
    expect(res.status).toBe(500)
    expect(res.ok).toBe(false)
  })

  it('GET /v1/productos bloquea acceso sin token Admin con 401 Unauthorized', async () => {
    const res = await getProductosV1(null, false)
    expect(res.status).toBe(401)
    expect(res.ok).toBe(false)
  })

  it('POST /v1/productos crea un nuevo producto (201) y valida datos inválidos (400)', async () => {
    const invalido = await postProductoV1({ nombre: '', codigo: '', precio: -1, stock: 0 }, TOKEN_ADMIN)
    expect(invalido.status).toBe(400)

    const creado = await postProductoV1(
      {
        nombre: 'Teclado Mecánico RGB',
        codigo: 'KB999',
        categoria: 'Accesorios',
        precio: 49990,
        stock: 8,
      },
      TOKEN_ADMIN
    )
    expect(creado.status).toBe(201)
    expect(creado.data.codigo).toBe('KB999')
  })

  it('PUT /v2/productos/{id} actualiza un producto (200) y retorna 404 si no existe', async () => {
    const noExiste = await putProductoV2(
      9999,
      { nombre: 'Test', codigo: 'T01', precio: 1000, stock: 1 },
      TOKEN_ADMIN
    )
    expect(noExiste.status).toBe(404)

    const actualizado = await putProductoV2(
      1,
      { nombre: 'Control Pro Editado', codigo: 'AC001', categoria: 'Accesorios', precio: 65990, stock: 12 },
      TOKEN_ADMIN
    )
    expect(actualizado.status).toBe(200)
    expect(actualizado.data.nombre).toBe('Control Pro Editado')
  })

  it('GET /v2/productos/{id} y DELETE /v2/productos/{id} funcionan correctamente', async () => {
    const detalle = await getProductoPorIdV2(1)
    expect(detalle.status).toBe(200)

    const eliminado = await deleteProductoV2(1, TOKEN_ADMIN)
    expect(eliminado.status).toBe(200)

    const trasEliminar = await getProductoPorIdV2(1)
    expect(trasEliminar.status).toBe(404)
  })
})