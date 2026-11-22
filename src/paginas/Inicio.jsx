import { useEffect, useState } from 'react'
import { Container, Alert, Spinner, Button, Badge } from 'react-bootstrap'
import { Link } from 'react-router'
import Catalogo from '../componentes/Catalogo.jsx'
import { getProductosV2 } from '../servicios/apiProductos.js'

function Inicio() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [respuestaApi, setRespuestaApi] = useState(null)

  async function cargarCatalogo(simularError = false) {
    setCargando(true)
    const res = await getProductosV2(simularError)
    setRespuestaApi(res)
    if (res.ok) {
      setProductos(res.data)
    } else {
      setProductos([])
    }
    setCargando(false)
  }

  useEffect(() => {
    cargarCatalogo(false)
  }, [])

  return (
    <div className="inicio-gamer">
      <section className="hero-gamer">
        <div className="hero-orb hero-orb-uno" />
        <div className="hero-orb hero-orb-dos" />
        <Container className="hero-contenido">
          <div className="hero-texto">
            <p className="eyebrow"><span className="punto-verde" /> TU PRÓXIMA PARTIDA COMIENZA AQUÍ</p>
            <h1>Equipa tu <span>universo gamer.</span></h1>
            <p className="hero-descripcion">
              Consolas, periféricos y componentes seleccionados para que cada partida
              se sienta como un nuevo nivel.
            </p>
            <div className="hero-acciones">
              <a className="boton-verde" href="#productos">Explorar productos</a>
              <Link className="boton-contorno" to="/nosotros">Conócenos</Link>
            </div>
            <div className="hero-estadisticas">
              <div><strong>{productos.length}+</strong><small>PRODUCTOS</small></div>
              <div><strong>24h</strong><small>DESPACHO</small></div>
              <div><strong>100%</strong><small>GAMER</small></div>
            </div>
          </div>
          <div className="hero-visual" aria-label="Ilustración de un control de videojuegos">
            <div className="anillo anillo-uno" />
            <div className="anillo anillo-dos" />
            <div className="control-gamer">
              <div className="control-cruz"><i /><b /></div>
              <div className="control-botones"><i /><i /><i /><i /></div>
              <span className="control-stick stick-uno" />
              <span className="control-stick stick-dos" />
            </div>
            <span className="visual-etiqueta">LEVEL UP</span>
          </div>
        </Container>
      </section>

      <section id="productos" className="seccion-productos">
        <Container>
          <div className="encabezado-productos">
            <div>
              <p className="eyebrow">ARMA TU SETUP • API REST v2 PÚBLICA</p>
              <h2>Explora nuestros <span>productos</span></h2>
              <p>Catálogo sincronizado mediante <code>GET /api/productos</code>.</p>
            </div>
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <span className="contador-productos">{productos.length} artículos disponibles</span>
              <Button variant="outline-success" size="sm" onClick={() => cargarCatalogo(false)}>
                ↻ Recargar API (200)
              </Button>
              <Button variant="outline-danger" size="sm" onClick={() => cargarCatalogo(true)}>
                ⚠ Simular Error (500)
              </Button>
            </div>
          </div>

          {respuestaApi && (
            <Alert variant={respuestaApi.ok ? 'success' : 'danger'} className="d-flex justify-content-between align-items-center">
              <div>
                <Badge bg={respuestaApi.ok ? 'success' : 'danger'} className="me-2">
                  {respuestaApi.method} {respuestaApi.status} {respuestaApi.statusText}
                </Badge>
                <small>
                  <strong>Endpoint:</strong> {respuestaApi.url} —{' '}
                  {respuestaApi.ok
                    ? `Catálogo cargado correctamente (${productos.length} registros).`
                    : respuestaApi.error}
                </small>
              </div>
              <small className="text-muted">{respuestaApi.timestamp}</small>
            </Alert>
          )}

          {cargando ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="success" />
              <p className="mt-2">Consultando GET /v2/productos...</p>
            </div>
          ) : (
            <Catalogo productos={productos} />
          )}
        </Container>
      </section>
    </div>
  )
}

export default Inicio
