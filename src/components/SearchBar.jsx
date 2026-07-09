import { useState } from 'react'
import { Form } from 'react-bootstrap'

// Barra di ricerca della navbar. Gestisce da sola il testo digitato (input controllato)
// e al submit passa il termine al genitore con onSearch(term).
// Un termine vuoto azzera la ricerca (il genitore torna alle gallerie di default).
function SearchBar({ onSearch }) {
  // Input controllato: lo stato React è l'unica fonte di verità del campo.
  const [term, setTerm] = useState("")

  function handleSubmit(e) {
    e.preventDefault() // niente reload della pagina
    // .trim() così spazi vuoti valgono come ricerca vuota (reset alle gallerie).
    onSearch(term.trim())
  }

  return (
    <Form className="search-bar d-flex" onSubmit={handleSubmit} role="search">
      <Form.Control
        type="search"
        size="sm"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Cerca un film..."
        aria-label="Cerca un film"
      />
    </Form>
  )
}

export default SearchBar
