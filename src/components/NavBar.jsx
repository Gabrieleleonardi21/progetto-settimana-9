import { useState } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import SearchBar from "./SearchBar";
// Importo l'immagine così Vite la include nel bundle e ne gestisce il path finale
import profileImg from "../img/profile.jpeg";

// Array + map per non ripetere lo stesso markup 5 volte.
const NAV_LINKS = ["Home", "TV Shows", "Movies", "Recently Added", "My List"];

// Barra di navigazione in alto.
// Ha un piccolo stato locale: la modale della foto profilo aperta/chiusa.
function NavBar({ onSearch }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Navbar expand="lg" variant="dark" className="netflix-navbar">
      <Container fluid>
        <Navbar.Brand href="#home" className="netflix-brand">
          NETFLIX
        </Navbar.Brand>

        {/* Hamburger su schermi piccoli (funzionalità Bootstrap, responsive) */}
        <Navbar.Toggle aria-controls="netflix-nav" />

        <Navbar.Collapse id="netflix-nav">
          <Nav className="me-auto">
            {NAV_LINKS.map((label) => (
              <Nav.Link key={label} href="#">
                {label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Icone a destra: ricerca funzionante, nome utente, notifiche, profilo */}
          <Nav className="align-items-center gap-3 netflix-nav-right">
            {/* La ricerca vera: la SearchBar richiama onSearch ricevuto da App */}
            <SearchBar onSearch={onSearch} />
            <span className="fw-bold">Gabriele</span>
            <span aria-label="Notifiche" role="img">
              🔔
            </span>
            {/* Avatar cliccabile: uso un <button> così è accessibile anche da tastiera */}
            <button
              type="button"
              className="profile-btn"
              onClick={() => setShowProfile(true)}
              aria-label="Apri foto profilo"
            >
              <img
                src={profileImg}
                className="profile-avatar"
                alt="Profilo di Gabriele"
              />
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>

      {/* Modale con la foto profilo ingrandita */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)} centered>
        <Modal.Header closeButton closeVariant="white" className="border-0">
          <Modal.Title className="h6 mb-0">Gabriele</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={profileImg}
            className="profile-modal-img"
            alt="Profilo di Gabriele"
          />
        </Modal.Body>
      </Modal>
    </Navbar>
  );
}

export default NavBar;
