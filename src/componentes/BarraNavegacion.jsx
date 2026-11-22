import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { NavLink, Link, useNavigate } from 'react-router'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function BarraNavegacion() {
  const { totalItems } = useCart()
  const { usuario, logout, esAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
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
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
            {esAdmin && (
              <Nav.Link as={NavLink} to="/admin">⚡ Admin</Nav.Link>
            )}
          </Nav>

          <div className="acciones-nav">
            <Button as={Link} to="/carrito" className="boton-carrito">
              🛒 Carrito <Badge bg="success">{totalItems}</Badge>
            </Button>

            {usuario ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ color: '#fff', fontWeight: 'bold' }}>
                  👤 {usuario.nombre} {esAdmin && '(Admin)'}
                </span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <>
                <Button as={Link} to="/login" className="boton-login">
                  Iniciar sesión
                </Button>
                <Button as={Link} to="/registro" variant="outline-light" size="sm">
                  Registrarse
                </Button>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default BarraNavegacion