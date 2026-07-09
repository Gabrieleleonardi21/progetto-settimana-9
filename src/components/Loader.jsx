import { Spinner } from 'react-bootstrap'

// Spinner di caricamento, riusato dalle gallerie e dal modal recensioni.
// Il testo arriva dai props perche' cambia col contesto ("film" / "recensioni").
// Componente "di presentazione": nessuno stato, solo il markup da mostrare.
function Loader({ message = "Caricamento in corso..." }) {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-3">
      <Spinner animation="border" variant="light" size="sm" />
      <span>{message}</span>
    </div>
  )
}

export default Loader
