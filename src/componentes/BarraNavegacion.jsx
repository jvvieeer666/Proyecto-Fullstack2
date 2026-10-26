import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { NavLink, Link, useNavigate } from 'react-router' // 👈 Sin -dom
import { useCart } from '../context/CartContext'

function BarraNavegacion() {
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuario'))

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    navigate('/')
    window.location.reload()
  }

  return (
    <Navbar className="navbar-gamer" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="marca-gamer">
          <span className="marca-icono">👾</span>
          <span>Level-Up Gamer</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="mx-auto menu-gamer">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/#productos">Productos</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          
          <div className="acciones-nav">
            <Button as={Link} to="/carrito" className="boton-carrito">
              🛒 Carrito <Badge bg="success">{totalItems}</Badge>
            </Button>

            {usuarioLogueado ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  👤 {usuarioLogueado.nombre}
                </span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button as={Link} to="/login" className="boton-login">
                Iniciar sesión
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default BarraNavegacion