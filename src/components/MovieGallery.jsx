import { useState, useEffect } from 'react'
import { buildSearchUrl, buildDetailUrl, OMDB_API_KEY } from '../config'
import MovieCard from './MovieCard'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

// Scarica il GENERE di un singolo film. La ricerca OMDB (?s=) restituisce solo
// titolo, anno, tipo e poster: il genere sta nei dettagli (?i=imdbID), uno per film.
// Se la chiamata fallisce torno "" invece di far cadere l'intera galleria:
// quel film semplicemente non comparira' quando un filtro e' attivo.
async function scaricaGenere(imdbID) {
  try {
    const response = await fetch(buildDetailUrl(imdbID))
    const data = await response.json()
    if (data.Response === "False") return ""
    return data.Genre || ""
  } catch {
    return ""
  }
}

// Galleria di una saga di film. Riceve dai props "title" (sezione) e "query" (ricerca OMDB).
// "type" e' il filtro OMDB sul tipo ("movie" / "series" / "" = tutti): cambia la ricerca.
// "genre" filtra i film gia' scaricati; "basePath" e "selectedId" servono alle MovieCard
// per costruire il link della rotta del film.
function MovieGallery({ title, query, type, genre, basePath, selectedId }) {
  // Stato locale della galleria: lista film, se sta caricando e l'eventuale errore.
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  // Contatore dei tentativi: il bottone "Riprova" lo incrementa e, cambiando una
  // dipendenza dell'useEffect, fa ripartire il fetch.
  const [attempt, setAttempt] = useState(0)

  // Gira dopo il primo render e ogni volta che cambia la ricerca ("query"), il tipo
  // di contenuto ("type", cioe' la pagina) o "attempt" (click su "Riprova").
  // NON dipende da "genre": quel filtro lavora sui film gia' in memoria, senza rete.
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

        const response = await fetch(buildSearchUrl(query, type))
        const data = await response.json()

        // "Movie not found!" NON e' un errore: e' una ricerca senza risultati, e capita
        // spesso filtrando per tipo (es. una saga senza serie TV). Mostro la galleria vuota.
        if (data.Response === "False" && String(data.Error).includes("not found")) {
          if (annullato) return
          setMovies([])
          setLoading(false)
          return
        }

        // OMDB mette gli errori veri (apikey errata) DENTRO il JSON, con Response === "False",
        // anche quando lo status HTTP è 401. Lo controllo prima di response.ok così mostro
        // il messaggio esatto di OMDB (es. "Invalid API key!") e non un generico "401".
        if (data.Response === "False") {
          throw new Error(data.Error || "Nessun film trovato")
        }
        // Altri problemi HTTP che non seguono il formato OMDB (fetch non lancia da solo).
        if (!response.ok) {
          throw new Error("Errore di rete (" + response.status + ")")
        }

        // L'array dei film è nella proprietà "Search", non nella risposta stessa.
        // Scarto subito i film che OMDB dichiara senza locandina (Poster === "N/A"):
        // una galleria di riquadri grigi non serve a nessuno. Filtrando PRIMA di chiedere
        // i generi risparmio anche le loro richieste di dettaglio.
        const conLocandina = data.Search.filter((movie) => movie.Poster !== "N/A")

        // Arricchisco ogni film col suo genere: Promise.all lancia le richieste TUTTE INSIEME,
        // non una dopo l'altra, quindi l'attesa e' quella della piu' lenta, non la somma.
        const generi = await Promise.all(conLocandina.map((movie) => scaricaGenere(movie.imdbID)))
        const conGenere = conLocandina.map((movie, i) => ({ ...movie, Genre: generi[i] }))

        if (annullato) return
        setMovies(conGenere)
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
  }, [query, type, attempt])

  // Il click su "Riprova" è un evento utente: qui posso aggiornare lo stato liberamente.
  function handleRetry() {
    setLoading(true)
    setError("")
    setAttempt(attempt + 1)
  }

  // I "N/A" li ho gia' scartati, ma una locandina puo' avere un URL valido che risponde 404.
  // Se ne accorge solo il browser provando a caricarla: la MovieCard me lo dice e io tolgo
  // il film dalla lista, cosi' la galleria resta fatta di sole locandine vere.
  function rimuoviFilm(imdbID) {
    setMovies((precedenti) => precedenti.filter((movie) => movie.imdbID !== imdbID))
  }

  // Filtro per categoria, lato client. "Genre" e' una stringa tipo "Adventure, Family, Fantasy",
  // quindi basta controllare se contiene il genere scelto. "" = nessun filtro, mostro tutto.
  let visibili = movies
  if (genre) {
    visibili = movies.filter((movie) => movie.Genre.includes(genre))
  }

  // Decido cosa mostrare in base allo stato, senza operatori ternari (if + return anticipato).
  function renderContent() {
    if (loading) {
      return <Loader message="Caricamento film in corso..." />
    }
    if (error) {
      return <ErrorAlert message={error} onRetry={handleRetry} />
    }
    // Nessun film utilizzabile: o OMDB non ha restituito niente per questa saga con
    // questo tipo di contenuto, oppure tutti i risultati erano privi di locandina.
    if (movies.length === 0) {
      return <p className="text-secondary">Nessun film con locandina per questa saga.</p>
    }
    // C'erano film, ma il filtro per genere li ha esclusi tutti.
    if (visibili.length === 0) {
      return <p className="text-secondary">Nessun film del genere "{genre}" in questa galleria.</p>
    }
    return (
      <div className="movie-row d-flex">
        {visibili.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            basePath={basePath}
            selected={movie.imdbID === selectedId}
            onPosterError={rimuoviFilm}
          />
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
