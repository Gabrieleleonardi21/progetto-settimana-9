import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import MovieGallery from './components/MovieGallery'
import { GALLERIES } from './config'

// Componente radice: assembla navbar + contenuto (le gallerie) + footer.
// Tiene lo stato della ricerca: la SearchBar (dentro la NavBar) la aggiorna,
// e il corpo mostra i risultati oppure le gallerie di default (array GALLERIES).
function App() {
  // Termine di ricerca attivo ("" = mostro le gallerie di default).
  // setSearch si passa direttamente alla NavBar: riceve già il termine come unico argomento.
  const [search, setSearch] = useState("")

  // Cosa mostrare nel corpo: risultati di ricerca oppure gallerie di default (senza ternario).
  function renderGalleries() {
    if (search) {
      // key = termine cercato: cambiandolo la MovieGallery riparte da zero (stato pulito).
      return (
        <MovieGallery
          key={search}
          title={'Risultati per "' + search + '"'}
          query={search}
        />
      )
    }
    // Nessuna ricerca: una MovieGallery per ogni saga configurata.
    return GALLERIES.map((gallery) => (
      <MovieGallery key={gallery.title} title={gallery.title} query={gallery.query} />
    ))
  }

  return (
    <>
      <NavBar onSearch={setSearch} />

      <main className="main-content">
        {/* Intestazione della pagina */}
        <div className="page-header">
          <h1 className="page-title">TV Shows</h1>
          <select className="genres-select" aria-label="Generi">
            <option>Genres</option>
          </select>
        </div>

        {renderGalleries()}
      </main>

      <Footer />
    </>
  )
}

export default App
