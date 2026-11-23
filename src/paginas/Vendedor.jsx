
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const API_URL = 'http://localhost:8081/api'

function formatoPrecio(precio) {
  return Number(precio || 0).toLocaleString('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  })
}

function formatoFecha(fecha) {
  if (!fecha) return 'Sin fecha'

  return new Date(fecha).toLocaleString('es-CL')
}

function Vendedor() {
  const { usuario, token, logout } = useAuth()

  const [productos, setProductos] = useState([])
  const [ordenes, setOrdenes] = useState([])

  const [cargando, setCargando] = useState(true)
  const [errorProductos, setErrorProductos] = useState('')
  const [errorOrdenes, setErrorOrdenes] = useState('')

  const [seccion, setSeccion] = useState('productos')
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null)

  async function cargarDatos() {
    setCargando(true)
    setErrorProductos('')
    setErrorOrdenes('')

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }

    try {
      const [respuestaProductos, respuestaOrdenes] = await Promise.all([
        fetch(`${API_URL}/productos`, { headers }),
        fetch(`${API_URL}/ordenes`, { headers }),
      ])

      const datosProductos = await respuestaProductos.json().catch(() => [])
      const datosOrdenes = await respuestaOrdenes.json().catch(() => [])

      if (respuestaProductos.ok) {
        setProductos(Array.isArray(datosProductos) ? datosProductos : [])
      } else {
        setErrorProductos(
          datosProductos.message || 'No se pudieron cargar los productos.'
        )
      }

      if (respuestaOrdenes.ok) {
        setOrdenes(Array.isArray(datosOrdenes) ? datosOrdenes : [])
      } else {
        setErrorOrdenes(
          datosOrdenes.message || 'No se pudieron cargar las órdenes.'
        )
      }
    } catch {
      setErrorProductos('No se pudo conectar con Spring Boot.')
      setErrorOrdenes('No se pudo conectar con Spring Boot.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    if (token) {
      cargarDatos()
    }
  }, [token])

  function cerrarSesion() {
    logout()
    window.location.href = '/login'
  }

  return (
    <div style={estilos.contenedor}>
      <header style={estilos.encabezado}>
        <div>
          <h1 style={estilos.titulo}>Panel de Vendedor</h1>
          <p style={estilos.subtitulo}>
            Bienvenido, {usuario?.nombre || 'Vendedor'}
          </p>
        </div>

        <button onClick={cerrarSesion} style={estilos.botonSalir}>
          Cerrar sesión
        </button>
      </header>

      <div style={estilos.tarjetas}>
        <div style={estilos.tarjeta}>
          <span style={estilos.icono}>🎮</span>
          <div>
            <p style={estilos.etiqueta}>Productos disponibles</p>
            <h2 style={estilos.numero}>{productos.length}</h2>
          </div>
        </div>

        <div style={estilos.tarjeta}>
          <span style={estilos.icono}>📦</span>
          <div>
            <p style={estilos.etiqueta}>Órdenes registradas</p>
            <h2 style={estilos.numero}>{ordenes.length}</h2>
          </div>
        </div>
      </div>

      <nav style={estilos.navegacion}>
        <button
          onClick={() => {
            setSeccion('productos')
            setOrdenSeleccionada(null)
          }}
          style={{
            ...estilos.botonSeccion,
            ...(seccion === 'productos' ? estilos.seccionActiva : {}),
          }}
        >
          🎮 Productos
        </button>

        <button
          onClick={() => {
            setSeccion('ordenes')
            setOrdenSeleccionada(null)
          }}
          style={{
            ...estilos.botonSeccion,
            ...(seccion === 'ordenes' ? estilos.seccionActiva : {}),
          }}
        >
          📋 Órdenes de compra
        </button>

        <button onClick={cargarDatos} style={estilos.botonActualizar}>
          ↻ Actualizar información
        </button>
      </nav>

      {cargando ? (
        <p style={estilos.mensaje}>Cargando información...</p>
      ) : (
        <>
          {seccion === 'productos' && (
            <section style={estilos.panel}>
              <h2 style={estilos.tituloSeccion}>Listado de productos</h2>

              {errorProductos && (
                <p style={estilos.error}>{errorProductos}</p>
              )}

              {!errorProductos && productos.length === 0 && (
                <p style={estilos.mensaje}>No hay productos registrados.</p>
              )}

              <div style={estilos.grid}>
                {productos.map((producto) => (
                  <article key={producto.id} style={estilos.producto}>
                    {producto.imagen ? (
                      <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        style={estilos.imagen}
                      />
                    ) : (
                      <div style={estilos.imagenVacia}>🎮</div>
                    )}

                    <div style={estilos.contenidoProducto}>
                      <h3 style={estilos.nombreProducto}>
                        {producto.nombre}
                      </h3>

                      <p style={estilos.categoria}>
                        {producto.categoria}
                      </p>

                      <p style={estilos.precio}>
                        {formatoPrecio(producto.precio)}
                      </p>

                      <p style={estilos.detalle}>
                        Código: {producto.codigo}
                      </p>

                      <p style={estilos.detalle}>
                        Stock: {producto.stock}
                      </p>

                      <p style={estilos.descripcion}>
                        {producto.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {seccion === 'ordenes' && (
            <section style={estilos.panel}>
              <h2 style={estilos.tituloSeccion}>
                Órdenes de compra de clientes
              </h2>

              {errorOrdenes && (
                <p style={estilos.error}>{errorOrdenes}</p>
              )}

              {!errorOrdenes && ordenes.length === 0 && (
                <p style={estilos.mensaje}>
                  Todavía no hay órdenes registradas.
                </p>
              )}

              {!errorOrdenes && ordenes.length > 0 && (
                <div style={estilos.tablaContenedor}>
                  <table style={estilos.tabla}>
                    <thead>
                      <tr>
                        <th style={estilos.th}>N° Orden</th>
                        <th style={estilos.th}>Cliente</th>
                        <th style={estilos.th}>Fecha</th>
                        <th style={estilos.th}>Total</th>
                        <th style={estilos.th}>Estado</th>
                        <th style={estilos.th}>Detalle</th>
                      </tr>
                    </thead>

                    <tbody>
                      {ordenes.map((orden) => (
                        <tr key={orden.id}>
                          <td style={estilos.td}>#{orden.id}</td>
                          <td style={estilos.td}>
                            {orden.clienteNombre || 'Cliente'}
                            <br />
                            <small>{orden.clienteEmail || ''}</small>
                          </td>
                          <td style={estilos.td}>
                            {formatoFecha(orden.fecha)}
                          </td>
                          <td style={estilos.td}>
                            {formatoPrecio(orden.total)}
                          </td>
                          <td style={estilos.td}>
                            <span style={estilos.estado}>
                              {orden.estado}
                            </span>
                          </td>
                          <td style={estilos.td}>
                            <button
                              onClick={() => setOrdenSeleccionada(orden)}
                              style={estilos.botonDetalle}
                            >
                              Ver detalle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {ordenSeleccionada && (
                <div style={estilos.detalleOrden}>
                  <div style={estilos.encabezadoDetalle}>
                    <h3>Detalle de orden #{ordenSeleccionada.id}</h3>

                    <button
                      onClick={() => setOrdenSeleccionada(null)}
                      style={estilos.botonCerrar}
                    >
                      Cerrar ✕
                    </button>
                  </div>

                  <p>
                    <strong>Cliente:</strong>{' '}
                    {ordenSeleccionada.clienteNombre}
                  </p>

                  <p>
                    <strong>Correo:</strong>{' '}
                    {ordenSeleccionada.clienteEmail}
                  </p>

                  <p>
                    <strong>Estado:</strong> {ordenSeleccionada.estado}
                  </p>

                  <h4>Productos comprados</h4>

                  {ordenSeleccionada.detalles?.map((detalle) => (
                    <div key={detalle.id} style={estilos.lineaDetalle}>
                      <div>
                        <strong>{detalle.productoNombre}</strong>
                        <p style={estilos.detalle}>
                          Código: {detalle.productoCodigo}
                        </p>
                        <p style={estilos.detalle}>
                          Cantidad: {detalle.cantidad}
                        </p>
                      </div>

                      <strong>
                        {formatoPrecio(
                          Number(detalle.precioUnitario) *
                          Number(detalle.cantidad)
                        )}
                      </strong>
                    </div>
                  ))}

                  <h3 style={estilos.total}>
                    Total: {formatoPrecio(ordenSeleccionada.total)}
                  </h3>
                </div>
              )}
            </section>
          )}
        </>
      )}

      <footer style={estilos.pie}>
        Level-Up Gamer | Panel de consulta de vendedor
      </footer>
    </div>
  )
}

const estilos = {
  contenedor: {
    minHeight: '100vh',
    background: '#10131b',
    color: '#ffffff',
    padding: '30px',
  },
  encabezado: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '30px',
  },
  titulo: {
    fontSize: '30px',
    margin: 0,
    color: '#8bff70',
  },
  subtitulo: {
    color: '#b7bdca',
  },
  botonSalir: {
    background: '#e34b4b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 18px',
    cursor: 'pointer',
  },
  tarjetas: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  tarjeta: {
    background: '#1c2230',
    border: '1px solid #30394b',
    borderRadius: '12px',
    padding: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
  },
  icono: {
    fontSize: '35px',
  },
  etiqueta: {
    color: '#b7bdca',
    margin: 0,
  },
  numero: {
    color: '#8bff70',
    fontSize: '28px',
    margin: '5px 0 0',
  },
  navegacion: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '25px',
  },
  botonSeccion: {
    padding: '12px 20px',
    background: '#1c2230',
    color: 'white',
    border: '1px solid #394255',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  seccionActiva: {
    background: '#8bff70',
    color: '#10131b',
    borderColor: '#8bff70',
    fontWeight: 'bold',
  },
  botonActualizar: {
    padding: '12px 20px',
    background: '#27364b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  panel: {
    background: '#191f2b',
    border: '1px solid #30394b',
    borderRadius: '12px',
    padding: '25px',
  },
  tituloSeccion: {
    marginTop: 0,
    marginBottom: '25px',
    color: '#8bff70',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
    gap: '20px',
  },
  producto: {
    background: '#242c3b',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #394255',
  },
  imagen: {
    width: '100%',
    height: '170px',
    objectFit: 'contain',
    background: '#ffffff',
  },
  imagenVacia: {
    height: '170px',
    display: 'grid',
    placeItems: 'center',
    fontSize: '50px',
    background: '#30394b',
  },
  contenidoProducto: {
    padding: '15px',
  },
  nombreProducto: {
    fontSize: '17px',
    margin: '0 0 8px',
  },
  categoria: {
    color: '#8bff70',
    fontSize: '13px',
  },
  precio: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  detalle: {
    color: '#b7bdca',
    fontSize: '13px',
    margin: '5px 0',
  },
  descripcion: {
    color: '#b7bdca',
    fontSize: '13px',
  },
  tablaContenedor: {
    width: '100%',
    overflowX: 'auto',
  },
  tabla: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '750px',
  },
  th: {
    textAlign: 'left',
    padding: '13px',
    background: '#27364b',
    color: '#8bff70',
  },
  td: {
    padding: '13px',
    borderBottom: '1px solid #394255',
  },
  estado: {
    background: '#354c38',
    color: '#aaff9b',
    padding: '5px 9px',
    borderRadius: '20px',
    fontSize: '12px',
  },
  botonDetalle: {
    background: '#8bff70',
    color: '#10131b',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  detalleOrden: {
    marginTop: '25px',
    padding: '20px',
    background: '#242c3b',
    borderRadius: '10px',
  },
  encabezadoDetalle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  botonCerrar: {
    background: '#e34b4b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '8px 12px',
    cursor: 'pointer',
  },
  lineaDetalle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '15px',
    padding: '12px 0',
    borderBottom: '1px solid #394255',
  },
  total: {
    textAlign: 'right',
    color: '#8bff70',
  },
  mensaje: {
    color: '#b7bdca',
    padding: '20px 0',
  },
  error: {
    background: '#542b32',
    color: '#ffb5b5',
    padding: '12px',
    borderRadius: '8px',
  },
  pie: {
    textAlign: 'center',
    color: '#737e91',
    marginTop: '35px',
    fontSize: '13px',
  },
}

export default Vendedor
