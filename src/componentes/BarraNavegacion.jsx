import { Navbar, Nav, Container, Button, Badge } from 'react-bootstrap'
import { NavLink } from 'react-router'

function BarraNavegacion({ cantidad }) {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">
          🎮 Level-Up Gamer
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-principal" />
        <Navbar.Collapse id="menu-principal">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>Inicio</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros">Nosotros</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto">Contacto</Nav.Link>
          </Nav>
          <Button as={NavLink} to="/carrito" variant="outline-light">
            🛒 Carrito <Badge bg="primary">{cantidad}</Badge>
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default BarraNavegacion