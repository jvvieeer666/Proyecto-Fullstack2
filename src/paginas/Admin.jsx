
import { useMemo, useState } from 'react'
import productosIniciales from '../datos/productos.js'
import '../Admin.css'

const formatoCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(valor)

const productoVacio = {
  nombre: '',
  categoria: 'Accesorios',
  precio: '',
  stock: '',
  codigo: '',
  imagen: '',
  descripcion: '',
}

function Admin() {
  const [productos, setProductos] = useState(productosIniciales)
  const [seccion, setSeccion] = useState('productos')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [estadoStock, setEstadoStock] = useState('Todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [formulario, setFormulario] = useState(productoVacio)

  const categorias = [...new Set(productos.map((p) => p.categoria))]

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const texto = busqueda.toLowerCase()

      const coincideTexto =
        producto.nombre.toLowerCase().includes(texto) ||
        producto.codigo.toLowerCase().includes(texto)

      const coincideCategoria =
        categoria === 'Todas' || producto.categoria === categoria

      const coincideStock =
        estadoStock === 'Todos' ||
        (estadoStock === 'Disponible' && producto.stock > 0) ||
        (estadoStock === 'Agotado' && producto.stock === 0) ||
        (estadoStock === 'Stock bajo' &&
          producto.stock > 0 &&
          producto.stock <= 5)

      return coincideTexto && coincideCategoria && coincideStock
    })
  }, [productos, busqueda, categoria, estadoStock])

  const stockTotal = productos.reduce((total, p) => total + p.stock, 0)

  const valorInventario = productos.reduce(
    (total, p) => total + p.precio * p.stock,
    0,
  )

  function abrirNuevo() {
    setProductoEditando(null)
    setFormulario(productoVacio)
    setModalAbierto(true)
  }

  function abrirEdicion(producto) {
    setProductoEditando(producto.id)
    setFormulario({
      ...producto,
      precio: String(producto.precio),
      stock: String(producto.stock),
    })
    setModalAbierto(true)
  }

  function guardarProducto(evento) {
    evento.preventDefault()

    const nombre = formulario.nombre.trim()
    const codigo = formulario.codigo.trim().toUpperCase()
    const precio = Number(formulario.precio)
    const stock = Number(formulario.stock)

    if (
      !nombre ||
      !codigo ||
      !Number.isFinite(precio) ||
      !Number.isInteger(stock) ||
      precio <= 0 ||
      stock < 0
    ) {
      window.alert('Revisa el nombre, código, precio y stock.')
      return
    }

    const codigoDuplicado = productos.some(
      (p) =>
        p.codigo.toLowerCase() === codigo.toLowerCase() &&
        p.id !== productoEditando,
    )

    if (codigoDuplicado) {
      window.alert('Ya existe un producto con ese código.')
      return
    }

    const productoGuardado = {
      ...formulario,
      id: productoEditando ?? Math.max(0, ...productos.map((p) => p.id)) + 1,
      nombre,
      codigo,
      precio,
      stock,
      imagen: formulario.imagen.trim(),
      descripcion: formulario.descripcion.trim(),
    }

    if (productoEditando !== null) {
      setProductos((actuales) =>
        actuales.map((p) =>
          p.id === productoEditando ? productoGuardado : p,
        ),
      )
    } else {
      setProductos((actuales) => [...actuales, productoGuardado])
    }

    setModalAbierto(false)
  }

  function eliminarProducto(producto) {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar "${producto.nombre}"?`,
    )

    if (!confirmar) return

    setProductos((actuales) =>
      actuales.filter((p) => p.id !== producto.id),
    )
  }

  const menu = [
    { id: 'dashboard', nombre: 'Dashboard', icono: '▦' },
    { id: 'productos', nombre: 'Productos', icono: '📦' },
    { id: 'pedidos', nombre: 'Pedidos', icono: '🛒' },
    { id: 'usuarios', nombre: 'Usuarios', icono: '👥' },
  ]

  return (
    <div className="admin">
      <aside className="admin-sidebar">
        <a href="/" className="admin-logo">
          <span>LEVEL-UP</span>
          <strong>GAMER</strong>
          <small>ADMINISTRACIÓN</small>
        </a>

        <p className="admin-menu-titulo">MENÚ PRINCIPAL</p>

        <nav className="admin-menu">
          {menu.map((item) => (
            <button
              key={item.id}
              className={`admin-menu-item ${seccion === item.id ? 'activo' : ''}`}
              onClick={() => setSeccion(item.id)}
            >
              <span>{item.icono}</span>
              {item.nombre}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-status-dot" />
          Catálogo cargado
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p>LEVEL-UP GAMER / ADMIN</p>
            <h1>Panel de administración</h1>
          </div>
          <a href="/" className="admin-volver">← Volver a la tienda</a>
        </header>

        <div className="admin-titulo-seccion">
          <div>
            <span className="admin-etiqueta">GESTIÓN DE TIENDA</span>
            <h2>
              {seccion === 'productos'
                ? '📦 Productos'
                : menu.find((m) => m.id === seccion)?.nombre}
            </h2>
            <p>Administra el catálogo de Level-Up Gamer.</p>
          </div>

          {seccion === 'productos' && (
            <button className="admin-boton" onClick={abrirNuevo}>
              + Agregar producto
            </button>
          )}
        </div>

        <section className="admin-estadisticas">
          <article className="admin-stat-card">
            <span className="admin-stat-icon">📦</span>
            <p>Total de productos</p>
            <strong>{productos.length}</strong>
            <small>Productos en el catálogo</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">🏷️</span>
            <p>Categorías</p>
            <strong>{categorias.length}</strong>
            <small>Categorías registradas</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">🛒</span>
            <p>Stock total</p>
            <strong>{stockTotal}</strong>
            <small>Unidades disponibles</small>
          </article>

          <article className="admin-stat-card">
            <span className="admin-stat-icon">💰</span>
            <p>Valor del inventario</p>
            <strong className="admin-valor">
              {formatoCLP(valorInventario)}
            </strong>
            <small>Precio × unidades en stock</small>
          </article>
        </section>

        {seccion === 'productos' && (
          <>
            <section className="admin-filtros">
              <input
                aria-label="Buscar producto"
                placeholder="⌕ Buscar por nombre o código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              <select
                aria-label="Filtrar por categoría"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="Todas">Todas las categorías</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select
                aria-label="Filtrar por stock"
                value={estadoStock}
                onChange={(e) => setEstadoStock(e.target.value)}
              >
                <option value="Todos">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="Stock bajo">Stock bajo (1–5)</option>
                <option value="Agotado">Agotado</option>
              </select>

              <button
                className="admin-limpiar"
                onClick={() => {
                  setBusqueda('')
                  setCategoria('Todas')
                  setEstadoStock('Todos')
                }}
              >
                Limpiar
              </button>
            </section>

            <p className="admin-resultados">
              Mostrando {productosFiltrados.length} de {productos.length} productos
            </p>

            <section className="admin-productos-grid">
              {productosFiltrados.map((producto) => (
                <article className="admin-producto-card" key={producto.id}>
                  <div className="admin-producto-imagen">
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : null}
                    <span className="admin-categoria">
                      {producto.categoria}
                    </span>
                  </div>

                  <div className="admin-producto-contenido">
                    <h3>{producto.nombre}</h3>
                    <p className="admin-codigo">Código: {producto.codigo}</p>
                    <strong className="admin-precio">
                      {formatoCLP(producto.precio)}
                    </strong>

                    <p className={`admin-stock ${
                      producto.stock === 0
                        ? 'agotado'
                        : producto.stock <= 5
                          ? 'bajo'
                          : ''
                    }`}>
                      <span />
                      {producto.stock === 0
                        ? 'Sin stock'
                        : `Stock: ${producto.stock} unidades`}
                    </p>

                    <div className="admin-producto-acciones">
                      <button
                        className="admin-editar"
                        onClick={() => abrirEdicion(producto)}
                      >
                        ✎ Editar
                      </button>
                      <button
                        className="admin-eliminar"
                        onClick={() => eliminarProducto(producto)}
                      >
                        × Eliminar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {productosFiltrados.length === 0 && (
              <div className="admin-vacio">
                <span>🔎</span>
                <h3>No se encontraron productos</h3>
                <p>Prueba con otra búsqueda o cambia los filtros.</p>
              </div>
            )}
          </>
        )}

        {seccion === 'dashboard' && (
          <section className="admin-info-card">
            <h2>Resumen de la tienda</h2>
            <p>Actualmente tienes {productos.length} productos registrados y {stockTotal} unidades en inventario.</p>
            <button className="admin-boton" onClick={() => setSeccion('productos')}>
              Administrar productos
            </button>
          </section>
        )}

        {seccion === 'pedidos' && (
          <section className="admin-info-card">
            <h2>Gestión de pedidos</h2>
            <p>Esta sección necesita conectarse a un sistema de pedidos. Todavía no hay pedidos reales conectados.</p>
          </section>
        )}

        {seccion === 'usuarios' && (
          <section className="admin-info-card">
            <h2>Gestión de usuarios</h2>
            <p>Esta sección necesita una fuente de datos de usuarios y permisos. Aún no está conectada.</p>
          </section>
        )}
      </main>

      {modalAbierto && (
        <div className="admin-modal-fondo" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setModalAbierto(false)
        }}>
          <form className="admin-modal" onSubmit={guardarProducto}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-etiqueta">CATÁLOGO</span>
                <h2>{productoEditando !== null ? 'Editar producto' : 'Nuevo producto'}</h2>
              </div>
              <button type="button" className="admin-cerrar" onClick={() => setModalAbierto(false)}>
                ×
              </button>
            </div>

            <label>
              Nombre del producto *
              <input
                required
                value={formulario.nombre}
                onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
              />
            </label>

            <div className="admin-form-fila">
              <label>
                Código *
                <input
                  required
                  value={formulario.codigo}
                  onChange={(e) => setFormulario({ ...formulario, codigo: e.target.value })}
                />
              </label>

              <label>
                Categoría *
                <select
                  value={formulario.categoria}
                  onChange={(e) => setFormulario({ ...formulario, categoria: e.target.value })}
                >
                  {[...new Set([...categorias, 'Accesorios', 'Consolas', 'Sillas', 'Vestuario', 'Juegos de Mesa', 'Computadores'])].map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="admin-form-fila">
              <label>
                Precio en CLP *
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={formulario.precio}
                  onChange={(e) => setFormulario({ ...formulario, precio: e.target.value })}
                />
              </label>

              <label>
                Stock *
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  value={formulario.stock}
                  onChange={(e) => setFormulario({ ...formulario, stock: e.target.value })}
                />
              </label>
            </div>

            <label>
              URL de imagen
              <input
                type="url"
                placeholder="https://..."
                value={formulario.imagen}
                onChange={(e) => setFormulario({ ...formulario, imagen: e.target.value })}
              />
            </label>

            <label>
              Descripción
              <textarea
                rows="3"
                value={formulario.descripcion}
                onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
              />
            </label>

            <div className="admin-modal-acciones">
              <button type="button" className="admin-cancelar" onClick={() => setModalAbierto(false)}>
                Cancelar
              </button>
              <button type="submit" className="admin-boton">
                Guardar producto
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Admin
