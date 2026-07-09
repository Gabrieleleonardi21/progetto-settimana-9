import { Link } from 'react-router-dom'

// Singola "card" di un film: solo la locandina. E' un <Link>: cliccarla NAVIGA alla
// rotta del film (es. /movies/film/tt0241527) e il pannello recensioni si apre a destra.
// Cliccando la card gia' aperta si torna alla lista, quindi il link fa da interruttore.
// Nessuno stato locale: la galleria decide quali film mostrare.
function MovieCard({ movie, basePath, selected, onPosterError }) {
  // basePath e' "" per la home, "/movies" o "/tv-shows" per le altre pagine.
  // Se questa card e' gia' aperta, il link riporta alla pagina senza pannello.
  let destinazione = basePath + "/film/" + movie.imdbID
  if (selected) {
    destinazione = basePath || "/"
  }

  // Classe extra solo sulla card selezionata (niente ternario).
  let classi = "movie-card"
  if (selected) {
    classi = "movie-card movie-card--selected"
  }

  return (
    // state: allego il titolo alla navigazione, cosi' il pannello lo mostra subito
    // senza chiederlo di nuovo a OMDB (lo fa solo se l'indirizzo viene aperto a mano).
    // aria-current: dice agli screen reader qual e' il film attualmente aperto.
    <Link
      to={destinazione}
      state={{ title: movie.Title }}
      className={classi}
      title={movie.Title}
      aria-current={selected}
    >
      {/* onError: l'URL della locandina esiste ma risponde 404 (l'immagine e' sparita
          dai server di Amazon). Lo si scopre solo provando a caricarla: avviso la
          galleria, che toglie il film dalla lista invece di lasciare un buco. */}
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="movie-poster"
        loading="lazy"
        onError={() => onPosterError(movie.imdbID)}
      />
    </Link>
  )
}

export default MovieCard
