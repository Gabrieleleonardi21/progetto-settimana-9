import { Component } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import MovieGallery from './components/MovieGallery'
import { GALLERIES } from './config'

// Componente radice: assembla navbar + contenuto (le gallerie) + footer.
// Tiene lo stato della ricerca: la SearchBar (dentro la NavBar) la aggiorna,
// e il corpo mostra i risultati oppure le gallerie di default (array GALLERIES).
class App extends Component {
  state = {
    search: "", // termine di ricerca attivo ("" = mostro le gallerie di default)
  }

  // Riceve il termine dalla SearchBar (via NavBar) e aggiorna lo stato.
  handleSearch = (term) => this.setState({ search: term })

  // Cosa mostrare nel corpo: risultati di ricerca oppure gallerie di default (senza ternario).
  renderGalleries() {
    if (this.state.search) {
      // key = termine cercato: cambiandolo la MovieGallery si RIMONTA e rifà il fetch
      // (scarica i film solo in componentDidMount, quindi il remount è ciò che serve).
      return (
        <MovieGallery
          key={this.state.search}
          title={'Risultati per "' + this.state.search + '"'}
          query={this.state.search}
        />
      )
    }
    // Nessuna ricerca: una MovieGallery per ogni saga configurata.
    return GALLERIES.map((gallery) => (
      <MovieGallery key={gallery.title} title={gallery.title} query={gallery.query} />
    ))
  }

  render() {
    return (
      <>
        <NavBar onSearch={this.handleSearch} />

        <main className="main-content">
          {/* Intestazione della pagina */}
          <div className="page-header">
            <h1 className="page-title">TV Shows</h1>
            <select className="genres-select" aria-label="Generi">
              <option>Genres</option>
            </select>
          </div>

          {this.renderGalleries()}
        </main>

        <Footer />
      </>
    )
  }
}

export default App
