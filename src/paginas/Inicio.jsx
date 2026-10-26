import { Container } from 'react-bootstrap'
import { Link } from 'react-router'
import productos from '../datos/productos.js'
import Catalogo from '../componentes/Catalogo.jsx'

function Inicio() {
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
              <div><strong>12+</strong><small>PRODUCTOS</small></div>
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
              <p className="eyebrow">ARMA TU SETUP</p>
              <h2>Explora nuestros <span>productos</span></h2>
              <p>Todo lo que necesitas para tu siguiente nivel.</p>
            </div>
            <span className="contador-productos">{productos.length} artículos disponibles</span>
          </div>
          <Catalogo productos={productos} />
        </Container>
      </section>
    </div>
  )
}

export default Inicio
