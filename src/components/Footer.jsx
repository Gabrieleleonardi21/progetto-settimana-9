import { Container, Row, Col } from 'react-bootstrap'

// Le 4 colonne di link del footer Netflix.
// Dati in un array di array: il render diventa un doppio map, zero markup ripetuto.
const FOOTER_COLUMNS = [
  ["Audio and Subtitles", "Media Center", "Privacy", "Contact us"],
  ["Audio Description", "Investor Relations", "Legal Notices"],
  ["Help Center", "Jobs", "Cookie Preferences"],
  ["Gift Cards", "Terms of Use", "Corporate Information"],
]

// Footer del sito. Componente di presentazione (nessuno stato).
function Footer() {
  return (
    <footer className="netflix-footer">
      <Container>
        <Row>
          {FOOTER_COLUMNS.map((column, index) => (
            // L'indice come key va bene: l'elenco è statico e non cambia mai ordine.
            <Col xs={6} md={3} key={index}>
              <ul className="footer-list">
                {column.map((link) => (
                  <li key={link}>
                    <a href="#">{link}</a>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>

        <button type="button" className="service-code">Service Code</button>
        <p className="copyright">© 1997-2023 Netflix, Inc.</p>
      </Container>
    </footer>
  )
}

export default Footer
