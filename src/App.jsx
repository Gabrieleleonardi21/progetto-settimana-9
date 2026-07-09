import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import CatalogPage from './components/CatalogPage'
import ReviewSection from './components/ReviewSection'

// Le tre pagine del sito. Sono lo STESSO componente (CatalogPage) con props diversi:
// cambia il tipo di contenuto chiesto a OMDB, non la logica. Array + map per non
// ripetere tre volte lo stesso <Route>.
const PAGINE = [
  { path: "/", titolo: "Home", type: "", basePath: "" },
  { path: "/tv-shows", titolo: "TV Shows", type: "series", basePath: "/tv-shows" },
  { path: "/movies", titolo: "Movies", type: "movie", basePath: "/movies" },
]

// Componente radice: navbar + le rotte + footer.
// Tiene due stati "elevati", perche' servono a piu' componenti figli:
//  - search: la SearchBar (dentro la NavBar) lo aggiorna, le gallerie lo cercano su OMDB
//  - genre:  il GenreFilter (dentro la NavBar) lo aggiorna, le gallerie ci filtrano i film
// Il film aperto NON e' uno stato: sta nell'indirizzo (rotta /film/:imdbID).
function App() {
  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("")

  return (
    <>
      {/* NavBar e Footer stanno FUORI da <Routes>: restano uguali su ogni pagina */}
      <NavBar onSearch={setSearch} genre={genre} onGenreChange={setGenre} />

      <Routes>
        {PAGINE.map((pagina) => (
          <Route
            key={pagina.path}
            path={pagina.path}
            element={
              <CatalogPage
                titolo={pagina.titolo}
                type={pagina.type}
                basePath={pagina.basePath}
                search={search}
                genre={genre}
              />
            }
          >
            {/* Rotta ANNIDATA e DINAMICA: ":imdbID" e' un segnaposto, il valore vero
                arriva dall'indirizzo. Il pannello recensioni compare nell'<Outlet/>
                di CatalogPage, quindi le gallerie restano visibili a sinistra. */}
            <Route path="film/:imdbID" element={<ReviewSection />} />
          </Route>
        ))}

        {/* Qualsiasi altro indirizzo: meglio un messaggio chiaro di una pagina bianca */}
        <Route
          path="*"
          element={
            <main className="main-content">
              <h1 className="page-title">Pagina non trovata</h1>
              <p className="text-secondary">L&apos;indirizzo che hai aperto non esiste.</p>
            </main>
          }
        />
      </Routes>

      <Footer />
    </>
  )
}

export default App
