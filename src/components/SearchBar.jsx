import { Component } from 'react'
import { Form } from 'react-bootstrap'

// Barra di ricerca della navbar. Gestisce da sola il testo digitato (input controllato)
// e al submit passa il termine al genitore con onSearch(term).
// Un termine vuoto azzera la ricerca (il genitore torna alle gallerie di default).
class SearchBar extends Component {
  state = {
    term: "", // testo digitato (input controllato)
  }

  handleChange = (e) => this.setState({ term: e.target.value })

  handleSubmit = (e) => {
    e.preventDefault() // niente reload della pagina
    // .trim() così spazi vuoti valgono come ricerca vuota (reset alle gallerie).
    this.props.onSearch(this.state.term.trim())
  }

  render() {
    return (
      <Form className="search-bar d-flex" onSubmit={this.handleSubmit} role="search">
        <Form.Control
          type="search"
          size="sm"
          value={this.state.term}
          onChange={this.handleChange}
          placeholder="Cerca un film..."
          aria-label="Cerca un film"
        />
      </Form>
    )
  }
}

export default SearchBar
