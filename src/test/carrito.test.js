
import { describe, it, expect } from 'vitest';

describe('Lógica del Carrito de Compras', () => {
  it('calcula correctamente el total en dinero', () => {
    const carrito = [
      { id: 1, price: 10000, quantity: 2 },
      { id: 2, price: 5000, quantity: 1 }
    ];

    const total = carrito.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    expect(total).toBe(25000);
  });

  it('calcula correctamente el total de unidades', () => {
    const carrito = [
      { id: 1, quantity: 2 },
      { id: 2, quantity: 3 }
    ];

    const totalItems = carrito.reduce(
      (acc, item) => acc + item.quantity,
      0
    );

    expect(totalItems).toBe(5);
  });

  it('elimina un producto por su ID', () => {
    const carrito = [{ id: 1 }, { id: 2 }];
    const resultado = carrito.filter(item => item.id !== 1);

    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe(2);
  });

  it('vacía el carrito', () => {
    let carrito = [{ id: 1 }, { id: 2 }];
    carrito = [];

    expect(carrito).toHaveLength(0);
  });

  it('maneja un carrito vacío', () => {
    const carrito = [];

    const total = carrito.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    expect(total).toBe(0);
  });
});
