import { Component } from 'react'
import { Modal } from 'react-bootstrap'
import { reviewsUrl, reviewsHeaders, buildDetailUrl, STRIVE_BEARER } from '../config'
import ReviewDetails from './ReviewDetails'
import ReviewList from './ReviewList'
import ReviewForm from './ReviewForm'

// Modal delle recensioni di un film (progetto progressivo W9).
// Fa da "container": carica i dati (recensioni dal backend striveschool + dettagli da OMDB)
// e li passa ai sotto-componenti di presentazione (ReviewDetails, ReviewList, ReviewForm).
class ReviewModal extends Component {
  state = {
    reviews: [],   // recensioni ricevute dal backend
    loading: true, // sto caricando le recensioni?
    error: "",     // errore di caricamento recensioni
    details: null, // dettagli del film da OMDB (opzionali)
  }

  // Il modal resta montato ma "chiuso": intercetto l'APERTURA (show da false a true)
  // e solo allora carico i dati. Equivale a un useEffect che dipende da "show".
  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.loadReviews()
      this.loadDetails()
    }
  }

  // GET recensioni del film (il backend filtra per elementId = imdbID).
  loadReviews = async () => {
    this.setState({ loading: true, error: "" })

    // Senza bearer non posso chiamare l'API: messaggio chiaro invece di un 401 criptico.
    if (!STRIVE_BEARER) {
      this.setState({ loading: false, error: "Token recensioni mancante: imposta VITE_STRIVE_BEARER nel file .env" })
      return
    }

    try {
      const response = await fetch(reviewsUrl(this.props.movie.imdbID), { headers: reviewsHeaders() })
      if (!response.ok) {
        throw new Error("Errore nel caricamento recensioni (" + response.status + ")")
      }
      const data = await response.json()
      // Per sicurezza tengo solo se è un array (film senza recensioni -> array vuoto).
      let list = []
      if (Array.isArray(data)) {
        list = data
      }
      this.setState({ reviews: list, loading: false })
    } catch (err) {
      this.setState({ error: err.message, loading: false })
    }
  }

  // GET dettagli film da OMDB. Sono opzionali: se falliscono non blocco le recensioni.
  loadDetails = async () => {
    try {
      const response = await fetch(buildDetailUrl(this.props.movie.imdbID))
      const data = await response.json()
      let details = null
      if (data.Response !== "False") {
        details = data
      }
      this.setState({ details })
    } catch {
      this.setState({ details: null })
    }
  }

  // DELETE recensione tramite il suo _id, poi ricarico la lista aggiornata.
  handleDelete = async (id) => {
    try {
      const response = await fetch(reviewsUrl(id), { method: "DELETE", headers: reviewsHeaders() })
      if (!response.ok) {
        throw new Error("Eliminazione non riuscita (" + response.status + ")")
      }
      this.loadReviews()
    } catch (err) {
      this.setState({ error: err.message })
    }
  }

  render() {
    const movie = this.props.movie

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} centered scrollable contentClassName="review-modal-content">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">Recensioni · {movie.Title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Dettagli film + lista recensioni: dati calati dallo stato del container */}
          <ReviewDetails details={this.state.details} />
          <ReviewList
            reviews={this.state.reviews}
            loading={this.state.loading}
            error={this.state.error}
            onRetry={this.loadReviews}
            onDelete={this.handleDelete}
          />

          <hr className="review-sep" />

          {/* Dopo l'invio ReviewForm chiama onAdded -> ricarico la lista aggiornata */}
          <ReviewForm elementId={movie.imdbID} onAdded={this.loadReviews} />
        </Modal.Body>
      </Modal>
    )
  }
}

export default ReviewModal
