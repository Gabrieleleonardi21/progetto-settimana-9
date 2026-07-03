import { Component } from 'react'
import ReviewModal from './ReviewModal'

// Singola "card" di un film: mostra il poster e, al click, apre il modal delle recensioni.
// OMDB a volte restituisce Poster === "N/A": in quel caso mostro un box con il titolo.
class MovieCard extends Component {
  // Stato locale: il modal di QUESTA card è aperto o chiuso.
  state = {
    showModal: false,
  }

  openModal = () => this.setState({ showModal: true })
  closeModal = () => this.setState({ showModal: false })

  render() {
    const movie = this.props.movie

    // Decido cosa mostrare senza operatore ternario, con un semplice if.
    let poster = (
      <img src={movie.Poster} alt={movie.Title} className="movie-poster" loading="lazy" />
    )
    if (movie.Poster === "N/A") {
      poster = <div className="movie-poster movie-poster--empty">{movie.Title}</div>
    }

    return (
      <>
        <div className="movie-card" title={movie.Title} role="button" onClick={this.openModal}>
          {poster}
        </div>
        {/* Il modal resta montato ma parte chiuso: si apre quando showModal diventa true */}
        <ReviewModal movie={movie} show={this.state.showModal} onHide={this.closeModal} />
      </>
    )
  }
}

export default MovieCard
