import { useState } from 'react'
import ReviewModal from './ReviewModal'

// Singola "card" di un film: mostra il poster e, al click, apre il modal delle recensioni.
// OMDB a volte restituisce Poster === "N/A": in quel caso mostro un box con il titolo.
function MovieCard({ movie }) {
  // Stato locale: il modal di QUESTA card è aperto o chiuso.
  const [showModal, setShowModal] = useState(false)

  // Decido cosa mostrare senza operatore ternario, con un semplice if.
  let poster = (
    <img src={movie.Poster} alt={movie.Title} className="movie-poster" loading="lazy" />
  )
  if (movie.Poster === "N/A") {
    poster = <div className="movie-poster movie-poster--empty">{movie.Title}</div>
  }

  return (
    <>
      <div className="movie-card" title={movie.Title} role="button" onClick={() => setShowModal(true)}>
        {poster}
      </div>
      {/* Il modal viene MONTATO solo al click (&& non è un ternario): così il suo useEffect
          scarica i dati all'apertura, e alla chiusura lo stato viene buttato via.
          In più non tengo decine di modal nascosti nel DOM, uno per ogni poster. */}
      {showModal && <ReviewModal movie={movie} onHide={() => setShowModal(false)} />}
    </>
  )
}

export default MovieCard
