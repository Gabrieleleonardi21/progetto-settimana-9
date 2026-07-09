// Sezione dettagli del film presi da OMDB (trama, anno, generi, voto IMDb).
// Componente di sola presentazione: riceve "details" dai props, nessuno stato.
function ReviewDetails({ details }) {
  // Se i dettagli non sono ancora arrivati (o OMDB ha fallito) non mostro nulla.
  if (!details) return null

  // Il poster potrebbe non esserci: lo mostro solo se OMDB lo fornisce.
  let poster = null
  if (details.Poster !== "N/A") {
    poster = <img src={details.Poster} alt={details.Title} className="review-detail-poster" />
  }

  return (
    <div className="review-details d-flex gap-3 mb-3">
      {poster}
      <div>
        <div className="text-secondary small mb-1">{details.Year} · {details.Genre} · {details.Runtime}</div>
        <p className="mb-1">{details.Plot}</p>
        <span className="small">IMDb: <strong>{details.imdbRating}</strong></span>
      </div>
    </div>
  )
}

export default ReviewDetails
