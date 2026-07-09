import { Form } from 'react-bootstrap'
import { GENRES } from '../config'

// Filtro per categoria dentro la navbar.
// Componente di sola presentazione: il genere scelto vive in App (serve alle gallerie),
// qui arrivano il valore corrente e la callback dai props.
// value="" = nessun filtro attivo, le gallerie mostrano tutti i film.
function GenreFilter({ genre, onChange }) {
  return (
    <Form.Select
      size="sm"
      className="genres-select"
      aria-label="Filtra i film per genere"
      value={genre}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Tutti i generi</option>
      {GENRES.map((g) => (
        <option key={g} value={g}>{g}</option>
      ))}
    </Form.Select>
  )
}

export default GenreFilter
