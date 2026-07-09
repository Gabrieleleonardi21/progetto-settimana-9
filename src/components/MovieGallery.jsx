import { useState, useEffect } from 'react'
import { buildSearchUrl, OMDB_API_KEY } from '../config'
import MovieCard from './MovieCard'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

// Galleria di una saga di film. Riceve dai props "title" (sezione) e "query" (ricerca OMDB).
// Fa il fetch quando il componente compare (useEffect) e gestisce loader + errori.
function MovieGallery({ title, query }) {
  // Stato locale della galleria: lista film, se sta caricando e l'eventuale errore.
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Contatore dei tentativi: il bottone "Riprova" lo incrementa e, cambiando una
  // dipendenza dell'useEffect, fa ripartire il fetch. Sostituisce la vecchia handleRetry().
  const [attempt, setAttempt] = useState(0)

  // Equivalente di componentDidMount: gira dopo il primo render.
  // Rigira se cambia "query" (nuova ricerca) o "attempt" (click su "Riprova").
  useEffect(() => {
    // Flag di cleanup: se la galleria sparisce o riparte il fetch prima della risposta,
    // ignoro il risultato vecchio invece di scriverlo nello stato.
    let annullato = false

    async function scaricaFilm() {
      try {
        // Controllo che l'apikey sia configurata: messaggio chiaro invece di un errore criptico.
        if (!OMDB_API_KEY) {
          throw new Error("Apikey OMDB mancante: registrati su omdbapi.com e mettila in .env (VITE_OMDB_API_KEY)")
        }

        const response = await fetch(buildSearchUrl(query))
        const data = await response.json()

        // OMDB mette l'eventuale errore (apikey errata, nessun risultato) DENTRO il JSON, con
        // Response === "False", anche quando lo status HTTP è 401. Lo controllo per primo così
        // mostro il messaggio esatto di OMDB (es. "Invalid API key!") e non un generico "401".
        if (data.Response === "False") {
          throw new Error(data.Error || "Nessun film trovato")
        }
        // Altri problemi HTTP che non seguono il formato OMDB (fetch non lancia da solo).
        if (!response.ok) {
          throw new Error("Errore di rete (" + response.status + ")")
        }

        if (annullato) return
        // L'array dei film è nella proprietà "Search", non nella risposta stessa (vedi slide OMDB).
        setMovies(data.Search)
        setLoading(false)
      } catch (err) {
        // Qualsiasi problema (rete, JSON, API) finisce qui e viene mostrato all'utente.
        if (annullato) return
        setError(err.message)
        setLoading(false)
      }
    }

    scaricaFilm()
    return () => { annullato = true }
  }, [query, attempt])

  // Il click su "Riprova" è un evento utente: qui posso aggiornare lo stato liberamente.
  // Rimetto loader + errore pulito e incremento attempt, così l'useEffect rilancia il fetch.
  function handleRetry() {
    setLoading(true)
    setError("")
    setAttempt(attempt + 1)
  }

  // Decido cosa mostrare in base allo stato, senza operatori ternari (if + return anticipato).
  function renderContent() {
    if (loading) {
      return <Loader />
    }
    if (error) {
      return <ErrorAlert message={error} onRetry={handleRetry} />
    }
    return (
      <div className="movie-row d-flex">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    )
  }

  return (
    <section className="gallery">
      <h2 className="gallery-title">{title}</h2>
      {renderContent()}
    </section>
  )
}

export default MovieGallery
