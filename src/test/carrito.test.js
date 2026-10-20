import { describe, it, expect } from 'vitest'

describe('Lógica del Carrito de Compras', () => {
  it('Debería calcular correctamente el total en dinero', () => {
    const carrito = [
      { id: 1, precio: 10000, quantity: 2 },
      { id: 2, precio: 5000, quantity: 1 }
    ]
    const total = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0)
    expect(total).toBe(25000)
  })

  it('Debería calcular correctamente el total de unidades', () => {
    const carrito = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 }
    ]
    const totalItems = carrito.reduce((acc, item) => acc + item.quantity, 0)
    expect(totalItems).toBe(5)
  })

  it('Debería eliminar un producto correctamente por su ID', () => {
    const carrito = [{ id: 1 }, { id: 2 }]
    const carritoFiltrado = carrito.filter(item => item.id !== 1)
    expect(carritoFiltrado.length).toBe(1)
    expect(carritoFiltrado[0].id).toBe(2)
  })

  it('Debería retornar un carrito vacío al aplicar clearCart', () => {
    let carrito = [{ id: 1 }, { id: 2 }]
    const clearCart = () => { carrito = [] }
    clearCart()
    expect(carrito.length).toBe(0)
  })

  it('Debería manejar un carrito vacío sin errores', () => {
    const carrito = []
    const total = carrito.reduce((acc, item) => acc + item.precio * item.quantity, 0)
    expect(total).toBe(0)
  })
})