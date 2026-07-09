import { useState } from "react";
import { Navbar, Nav, Container, Modal } from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import GenreFilter from "./GenreFilter";
// Importo l'immagine così Vite la include nel bundle e ne gestisce il path finale
import profileImg from "../img/profile.jpeg";

// Le pagine del sito: etichetta + indirizzo. Array + map per non ripetere il markup.
// Ogni voce porta davvero da qualche parte, nessun link finto.
const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "TV Shows", to: "/tv-shows" },
  { label: "Movies", to: "/movies" },
];

// Barra di navigazione in alto: link, ricerca e filtro per genere.
// Ricerca e filtro non hanno stato qui: lo tiene App, che li passa alle gallerie.
// L'unico stato locale e' la modale della foto profilo aperta/chiusa.
function NavBar({ onSearch, genre, onGenreChange }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <Navbar expand="lg" variant="dark" className="netflix-navbar">
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="netflix-brand">
          NETFLIX
        </Navbar.Brand>

        {/* Hamburger su schermi piccoli (funzionalità Bootstrap, responsive) */}
        <Navbar.Toggle aria-controls="netflix-nav" />

        <Navbar.Collapse id="netflix-nav">
          <Nav className="me-auto">
            {/* as={NavLink}: il link naviga senza ricaricare la pagina e si marca da solo
                come "active" quando l'indirizzo corrisponde.
                end serve alla Home: senza, "/" risulterebbe attiva su ogni pagina,
                perche' ogni indirizzo comincia con "/". */}
            {NAV_LINKS.map((link) => (
              <Nav.Link
                key={link.to}
                as={NavLink}
                to={link.to}
                end={link.to === "/"}
              >
                {link.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* A destra: filtro categorie, ricerca, nome utente, notifiche, profilo */}
          <Nav className="align-items-center gap-3 netflix-nav-right">
            {/* Il filtro vero: le gallerie mostrano solo i film del genere scelto */}
            <GenreFilter genre={genre} onChange={onGenreChange} />
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
