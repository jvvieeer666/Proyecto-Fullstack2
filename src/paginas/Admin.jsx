
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  getProductosV1,
  postProductoV1,
  putProductoV2,
  deleteProductoV2,
  getError500,
} from '../servicios/apiProductos.js'
import '../Admin.css'

const formatoCLP = (valor) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Number(valor) || 0)

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
  const { token, usuario } = useAuth()

  const [productos, setProductos] = useState([])
  const [seccion, setSeccion] = useState('productos')
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')
  const [estadoStock, setEstadoStock] = useState('Todos')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [productoEditando, setProductoEditando] = useState(null)
  const [formulario, setFormulario] = useState(productoVacio)
  const [logApi, setLogApi] = useState(null)
  const [cargando, setCargando] = useState(false)

  // ==========================================
  // CARGAR PRODUCTOS DESDE SPRING BOOT
  // ==========================================

  async function cargarProductos() {
    setCargando(true)

    try {
      const respuesta = await getProductosV1(token)

      setLogApi(respuesta)

      if (!respuesta.ok) {
        setProductos([])
        console.error('Error al consultar productos:', respuesta)
        return
      }

      if (!Array.isArray(respuesta.data)) {
        setProductos([])
        setLogApi({
          ...respuesta,
          ok: false,
          error: 'La API no devolvió una lista válida de productos.',
        })
        console.error('Respuesta inesperada:', respuesta.data)
        return
      }

      // Normalizar los datos recibidos desde Spring Boot
      const productosNormalizados = respuesta.data.map((producto) => ({
        ...producto,
        nombre: producto.nombre ?? '',
        codigo: producto.codigo ?? '',
        categoria: producto.categoria ?? 'Sin categoría',
        precio: Number(producto.precio) || 0,
        stock: Number(producto.stock) || 0,
        imagen: producto.imagen ?? '',
        descripcion: producto.descripcion ?? '',
      }))

      setProductos(productosNormalizados)

      console.log(
        'Productos cargados correctamente:',
        productosNormalizados,
      )
    } catch (error) {
      console.error('Error inesperado:', error)

      setProductos([])

      setLogApi({
        ok: false,
        method: 'GET',
        status: 0,
        statusText: 'Error de conexión',
        url: 'http://localhost:8081/api/productos',
        error: error.message || 'No se pudieron cargar los productos.',
        timestamp: new Date().toLocaleString('es-CL'),
      })
    } finally {
      setCargando(false)
    }
  }

  // Cargar automáticamente al entrar al panel
  useEffect(() => {
    cargarProductos()
  }, [token])

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const categorias = useMemo(() => {
    return [...new Set(productos.map((p) => p.categoria))]
  }, [productos])

  const stockTotal = useMemo(() => {
    return productos.reduce((total, p) => total + p.stock, 0)
  }, [productos])

  const valorInventario = useMemo(() => {
    return productos.reduce(
      (total, p) => total + p.precio * p.stock,
      0,
    )
  }, [productos])

  // ==========================================
  // BÚSQUEDA Y FILTROS
  // ==========================================

  const productosFiltrados = useMemo(() => {
    return productos.filter((producto) => {
      const texto = busqueda.toLowerCase().trim()

      const nombre = String(producto.nombre || '').toLowerCase()
      const codigo = String(producto.codigo || '').toLowerCase()

      const coincideTexto =
        nombre.includes(texto) || codigo.includes(texto)

      const coincideCategoria =
        categoria === 'Todas' || producto.categoria === categoria

      const coincideStock =
        estadoStock === 'Todos' ||
        (estadoStock === 'Disponible' && producto.stock > 5) ||
        (estadoStock === 'Agotado' && producto.stock === 0) ||
        (estadoStock === 'Stock bajo' &&
          producto.stock > 0 &&
          producto.stock <= 5)

      return coincideTexto && coincideCategoria && coincideStock
    })
  }, [productos, busqueda, categoria, estadoStock])

  // ==========================================
  // FORMULARIO DE PRODUCTOS
  // ==========================================

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

  function actualizarCampo(campo, valor) {
    setFormulario((anterior) => ({
      ...anterior,
      [campo]: valor,
    }))
  }

  // ==========================================
  // CREAR Y EDITAR PRODUCTOS
  // ==========================================

  async function guardarProducto(evento) {
    evento.preventDefault()

    const payload = {
      nombre: formulario.nombre.trim(),
      categoria: formulario.categoria,
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
      codigo: formulario.codigo.trim().toUpperCase(),
      imagen: formulario.imagen.trim(),
      descripcion: formulario.descripcion.trim(),
    }

    if (
      !payload.nombre ||
      !payload.codigo ||
      !payload.categoria ||
      !Number.isFinite(payload.precio) ||
      payload.precio <= 0 ||
      !Number.isInteger(payload.stock) ||
      payload.stock < 0
    ) {
      window.alert('Revisa los datos ingresados. El precio debe ser mayor que cero y el stock no puede ser negativo.')
      return
    }

    try {
      let respuesta

      if (productoEditando !== null) {
        respuesta = await putProductoV2(
          productoEditando,
          payload,
          token,
        )
      } else {
        respuesta = await postProductoV1(payload, token)
      }

      setLogApi(respuesta)

      if (!respuesta.ok) {
        window.alert(respuesta.error || 'No se pudo guardar el producto.')
        return
      }

      setModalAbierto(false)
      setFormulario(productoVacio)
      setProductoEditando(null)

      await cargarProductos()

      window.alert(
        productoEditando !== null
          ? 'Producto actualizado correctamente.'
          : 'Producto creado correctamente.',
      )
    } catch (error) {
      console.error('Error al guardar producto:', error)
      window.alert('Ocurrió un error al guardar el producto.')
    }
  }

  // ==========================================
  // ELIMINAR PRODUCTOS
  // ==========================================

  async function eliminarProducto(producto) {
    const confirmar = window.confirm(
      `¿Seguro que quieres eliminar "${producto.nombre}"?`,
    )

    if (!confirmar) return

    try {
      const respuesta = await deleteProductoV2(producto.id, token)

      setLogApi(respuesta)

      if (!respuesta.ok) {
        window.alert(respuesta.error || 'No se pudo eliminar el producto.')
        return
      }

      await cargarProductos()

      window.alert('Producto eliminado correctamente.')
    } catch (error) {
      console.error('Error al eliminar:', error)
      window.alert('Ocurrió un error al eliminar el producto.')
    }
  }

  // ==========================================
  // PRUEBAS DE ERRORES HTTP
  // ==========================================

  async function probarError400() {
    const respuesta = await postProductoV1(
      {
        nombre: '',
        categoria: '',
        precio: -10,
        stock: 0,
        codigo: '',
        imagen: '',
        descripcion: '',
      },
      token,
    )

    setLogApi(respuesta)
  }

  async function probarError404() {
    const respuesta = await putProductoV2(
      9999,
      {
        nombre: 'Inexistente',
        codigo: 'ERR404',
        categoria: 'Accesorios',
        precio: 1000,
        stock: 1,
        imagen: '',
        descripcion: '',
      },
      token,
    )

    setLogApi(respuesta)
  }

  async function probarError500() {
    const respuesta = await getError500(token)
    setLogApi(respuesta)
  }

  // ==========================================
  // MENÚ
  // ==========================================

  const menu = [
    { id: 'dashboard', nombre: 'Dashboard', icono: '▦' },
    { id: 'productos', nombre: 'Productos', icono: '📦' },
    { id: 'pedidos', nombre: 'Pedidos', icono: '🛒' },
    { id: 'usuarios', nombre: 'Usuarios', icono: '👥' },
  ]

  // ==========================================
  // INTERFAZ
  // ==========================================

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
              className={`admin-menu-item ${
                seccion === item.id ? 'activo' : ''
              }`}
              onClick={() => setSeccion(item.id)}
            >
              <span>{item.icono}</span>
              {item.nombre}
            </button>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <span className="admin-status-dot" />
          API Conectada ({usuario?.rol || 'ADMIN'})
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <p>LEVEL-UP GAMER / ADMIN</p>
            <h1>Panel de administración</h1>
          </div>

          <a href="/" className="admin-volver">
            ← Volver a la tienda
          </a>
        </header>

        {/* VISOR DE RESPUESTAS API */}

        {logApi && (
          <div
            style={{
              padding: '14px 18px',
              marginBottom: '20px',
              borderRadius: '10px',
              border: `1px solid ${logApi.ok ? '#198754' : '#dc3545'}`,
              backgroundColor: logApi.ok
                ? 'rgba(25, 135, 84, 0.15)'
                : 'rgba(220, 53, 69, 0.15)',
              color: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <strong
                style={{
                  color: logApi.ok ? '#39ff14' : '#ff6b6b',
                }}
              >
                [{logApi.method} {logApi.status} {logApi.statusText}]
              </strong>{' '}

              <code>{logApi.url}</code>

              <div
                style={{
                  fontSize: '13px',
                  marginTop: '4px',
                  color: '#d0e2ff',
                }}
              >
                {logApi.ok
                  ? `Operación exitosa (${logApi.timestamp}).`
                  : logApi.error}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: '6px',
                flexWrap: 'wrap',
              }}
            >
              <button
                type="button"
                className="admin-limpiar"
                onClick={cargarProductos}
              >
                GET productos
              </button>

              <button
                type="button"
                className="admin-limpiar"
                onClick={probarError400}
              >
                Test 400
              </button>

              <button
                type="button"
                className="admin-limpiar"
                onClick={probarError404}
              >
                Test 404
              </button>

              <button
                type="button"
                className="admin-limpiar"
                onClick={probarError500}
              >
                Test 500
              </button>
            </div>
          </div>
        )}

        {/* TÍTULO DE SECCIÓN */}

        <div className="admin-titulo-seccion">
          <div>
            <span className="admin-etiqueta">
              GESTIÓN DE TIENDA • API REST v1/v2
            </span>

            <h2>
              {seccion === 'productos'
                ? '📦 Productos'
                : menu.find((m) => m.id === seccion)?.nombre}
            </h2>

            <p>
              Administra el catálogo de Level-Up Gamer mediante endpoints REST.
            </p>
          </div>

          {seccion === 'productos' && (
            <button className="admin-boton" onClick={abrirNuevo}>
              + Agregar producto
            </button>
          )}
        </div>

        {/* ESTADÍSTICAS */}

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

        {/* SECCIÓN PRODUCTOS */}

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
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
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
              {cargando
                ? 'Cargando catálogo desde API...'
                : `Mostrando ${productosFiltrados.length} de ${productos.length} productos`}
            </p>

            {/* TARJETAS DE PRODUCTOS */}

            <section className="admin-productos-grid">
              {productosFiltrados.map((producto) => (
                <article
                  className="admin-producto-card"
                  key={producto.id}
                >
                  <div className="admin-producto-imagen">
                    {producto.imagen && (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}

                    <span className="admin-categoria">
                      {producto.categoria}
                    </span>
                  </div>

                  <div className="admin-producto-contenido">
                    <h3>{producto.nombre}</h3>

                    <p className="admin-codigo">
                      Código: {producto.codigo}
                    </p>

                    <strong className="admin-precio">
                      {formatoCLP(producto.precio)}
                    </strong>

                    <p
                      className={`admin-stock ${
                        producto.stock === 0
                          ? 'agotado'
                          : producto.stock <= 5
                            ? 'bajo'
                            : ''
                      }`}
                    >
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

            {!cargando && productosFiltrados.length === 0 && (
              <div className="admin-vacio">
                <span>🔎</span>

                <h3>
                  {productos.length === 0
                    ? 'No se pudieron cargar los productos'
                    : 'No se encontraron productos'}
                </h3>

                <p>
                  {productos.length === 0
                    ? 'Comprueba la conexión con Spring Boot y vuelve a intentar.'
                    : 'Prueba con otra búsqueda o cambia los filtros.'}
                </p>

                <button
                  className="admin-boton"
                  onClick={cargarProductos}
                >
                  Volver a cargar
                </button>
              </div>
            )}
          </>
        )}

        {/* DASHBOARD */}

        {seccion === 'dashboard' && (
          <section className="admin-info-card">
            <h2>Resumen de la tienda</h2>

            <p>
              Actualmente tienes {productos.length} productos registrados y{' '}
              {stockTotal} unidades en inventario.
            </p>

            <button
              className="admin-boton"
              onClick={() => setSeccion('productos')}
            >
              Administrar productos
            </button>
          </section>
        )}

        {/* PEDIDOS */}

        {seccion === 'pedidos' && (
          <section className="admin-info-card">
            <h2>Gestión de pedidos</h2>

            <p>
              Los pedidos confirmados desde el carrito se registran en el sistema.
            </p>
          </section>
        )}

        {/* USUARIOS */}

        {seccion === 'usuarios' && (
          <section className="admin-info-card">
            <h2>Gestión de usuarios</h2>

            <p>
              Administrador activo:{' '}
              <strong>{usuario?.nombre}</strong> ({usuario?.email}) —
              Rol: <strong>{usuario?.rol}</strong>.
            </p>
          </section>
        )}
      </main>

      {/* MODAL CREAR / EDITAR */}

      {modalAbierto && (
        <div
          className="admin-modal-fondo"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModalAbierto(false)
            }
          }}
        >
          <form className="admin-modal" onSubmit={guardarProducto}>
            <div className="admin-modal-header">
              <div>
                <span className="admin-etiqueta">
                  {productoEditando !== null
                    ? 'PUT /v2/productos/{id}'
                    : 'POST /v1/productos'}
                </span>

                <h2>
                  {productoEditando !== null
                    ? 'Editar producto'
                    : 'Nuevo producto'}
                </h2>
              </div>

              <button
                type="button"
                className="admin-cerrar"
                onClick={() => setModalAbierto(false)}
              >
                ×
              </button>
            </div>

            <label>
              Nombre del producto *
              <input
                required
                value={formulario.nombre}
                onChange={(e) =>
                  actualizarCampo('nombre', e.target.value)
                }
              />
            </label>

            <div className="admin-form-fila">
              <label>
                Código *
                <input
                  required
                  value={formulario.codigo}
                  onChange={(e) =>
                    actualizarCampo('codigo', e.target.value)
                  }
                />
              </label>

              <label>
                Categoría *
                <select
                  value={formulario.categoria}
                  onChange={(e) =>
                    actualizarCampo('categoria', e.target.value)
                  }
                >
                  {[
                    ...new Set([
                      ...categorias,
                      'Accesorios',
                      'Consolas',
                      'Sillas',
                      'Vestuario',
                      'Juegos de Mesa',
                      'Computadores',
                    ]),
                  ].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
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
                  onChange={(e) =>
                    actualizarCampo('precio', e.target.value)
                  }
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
                  onChange={(e) =>
                    actualizarCampo('stock', e.target.value)
                  }
                />
              </label>
            </div>

            <label>
              URL de imagen
              <input
                type="url"
                placeholder="https://..."
                value={formulario.imagen}
                onChange={(e) =>
                  actualizarCampo('imagen', e.target.value)
                }
              />
            </label>

            <label>
              Descripción
              <textarea
                rows="3"
                value={formulario.descripcion}
                onChange={(e) =>
                  actualizarCampo('descripcion', e.target.value)
                }
              />
            </label>

            <div className="admin-modal-acciones">
              <button
                type="button"
                className="admin-cancelar"
                onClick={() => setModalAbierto(false)}
              >
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
