import { Component } from 'react'
import { Navbar, Nav, Container } from 'react-bootstrap'
import SearchBar from './SearchBar'

// Link principali della navbar Netflix.
// Array + map per non ripetere lo stesso markup 5 volte.
const NAV_LINKS = ["Home", "TV Shows", "Movies", "Recently Added", "My List"]

// Barra di navigazione in alto. Componente solo di presentazione (nessuno stato).
class NavBar extends Component {
  render() {
    return (
      <Navbar expand="lg" variant="dark" className="netflix-navbar">
        <Container fluid>
          <Navbar.Brand href="#home" className="netflix-brand">NETFLIX</Navbar.Brand>

          {/* Hamburger su schermi piccoli (funzionalità Bootstrap, responsive) */}
          <Navbar.Toggle aria-controls="netflix-nav" />

          <Navbar.Collapse id="netflix-nav">
            <Nav className="me-auto">
              {NAV_LINKS.map((label) => (
                <Nav.Link key={label} href="#">{label}</Nav.Link>
              ))}
            </Nav>

            {/* Icone a destra: ricerca funzionante, KIDS, notifiche, profilo */}
            <Nav className="align-items-center gap-3 netflix-nav-right">
              {/* La ricerca vera: la SearchBar richiama onSearch ricevuto da App */}
              <SearchBar onSearch={this.props.onSearch} />
              <span className="fw-bold">KIDS</span>
              <span aria-label="Notifiche" role="img">🔔</span>
              <span className="profile-avatar" aria-label="Profilo" />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
  }
}

export default NavBar
