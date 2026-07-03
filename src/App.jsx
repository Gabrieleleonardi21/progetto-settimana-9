import { Component } from 'react'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import MovieGallery from './components/MovieGallery'
import { GALLERIES } from './config'

// Componente radice: assembla navbar + contenuto (le gallerie) + footer.
// Le gallerie vengono generate dall'array GALLERIES (config.jsx) con un map.
class App extends Component {
  render() {
    return (
      <>
        <NavBar />

        <main className="main-content">
          {/* Intestazione della pagina */}
          <div className="page-header">
            <h1 className="page-title">TV Shows</h1>
            <select className="genres-select" aria-label="Generi">
              <option>Genres</option>
            </select>
          </div>

          {/* Una MovieGallery per ogni saga configurata */}
          {GALLERIES.map((gallery) => (
            <MovieGallery key={gallery.title} title={gallery.title} query={gallery.query} />
          ))}
        </main>

        <Footer />
      </>
    )
  }
}

export default App
