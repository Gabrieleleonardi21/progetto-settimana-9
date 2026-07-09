import { Spinner } from 'react-bootstrap'

// Loader mostrato mentre la galleria sta scaricando i film da OMDB.
// Componente "di presentazione": nessuno stato, solo il markup da mostrare.
function Loader() {
  return (
    <div className="d-flex align-items-center gap-2 text-secondary py-3">
      <Spinner animation="border" variant="light" size="sm" />
      <span>Caricamento film in corso...</span>
    </div>
  )
}

export default Loader
