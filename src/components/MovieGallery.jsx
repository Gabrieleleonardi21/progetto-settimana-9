import { Component } from 'react'
import { buildSearchUrl, OMDB_API_KEY } from '../config'
import MovieCard from './MovieCard'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

// Galleria di una saga di film. Riceve dai props "title" (sezione) e "query" (ricerca OMDB).
// Fa il fetch al montaggio del componente (componentDidMount) e gestisce loader + errori.
class MovieGallery extends Component {
  // Stato locale della galleria: lista film, se sta caricando e l'eventuale errore.
  state = {
    movies: [],
    loading: true,
    error: "",
  }

  // Lifecycle: parte una sola volta appena il componente entra nel DOM -> qui lancio il fetch.
  componentDidMount() {
    this.fetchMovies()
  }

  // Scarica i film da OMDB per la query ricevuta dai props.
  async fetchMovies() {
    // Reset dello stato prima di ogni tentativo (utile anche per il "Riprova").
    this.setState({ loading: true, error: "" })

    // Controllo che l'apikey sia stata configurata: messaggio chiaro invece di un errore criptico.
    if (!OMDB_API_KEY) {
      this.setState({
        loading: false,
        error: "Apikey OMDB mancante: registrati su omdbapi.com e mettila in .env (VITE_OMDB_API_KEY)",
      })
      return
    }

    try {
      const response = await fetch(buildSearchUrl(this.props.query))
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

      // L'array dei film è nella proprietà "Search", non nella risposta stessa (vedi slide OMDB).
      this.setState({ movies: data.Search, loading: false })
    } catch (err) {
      // Qualsiasi problema (rete, JSON, API) finisce qui e viene mostrato all'utente.
      this.setState({ error: err.message, loading: false })
    }
  }

  // Arrow function come class field: "this" resta legato al componente quando la passo al bottone.
  handleRetry = () => {
    this.fetchMovies()
  }

  // Decido cosa mostrare in base allo stato, senza operatori ternari (if + return anticipato).
  renderContent() {
    if (this.state.loading) {
      return <Loader />
    }
    if (this.state.error) {
      return <ErrorAlert message={this.state.error} onRetry={this.handleRetry} />
    }
    return (
      <div className="movie-row d-flex">
        {this.state.movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    )
  }

  render() {
    return (
      <section className="gallery">
        <h2 className="gallery-title">{this.props.title}</h2>
        {this.renderContent()}
      </section>
    )
  }
}

export default MovieGallery
