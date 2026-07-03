import { Component } from 'react'

// Sezione dettagli del film presi da OMDB (trama, anno, generi, voto IMDb).
// Componente di sola presentazione: riceve "details" dai props, nessuno stato.
class ReviewDetails extends Component {
  render() {
    const d = this.props.details
    // Se i dettagli non sono ancora arrivati (o OMDB ha fallito) non mostro nulla.
    if (!d) return null

    // Il poster potrebbe non esserci: lo mostro solo se OMDB lo fornisce.
    let poster = null
    if (d.Poster !== "N/A") {
      poster = <img src={d.Poster} alt={d.Title} className="review-detail-poster" />
    }

    return (
      <div className="review-details d-flex gap-3 mb-3">
        {poster}
        <div>
          <div className="text-secondary small mb-1">{d.Year} · {d.Genre} · {d.Runtime}</div>
          <p className="mb-1">{d.Plot}</p>
          <span className="small">IMDb: <strong>{d.imdbRating}</strong></span>
        </div>
      </div>
    )
  }
}

export default ReviewDetails
