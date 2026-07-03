import { Component } from 'react'
import { Modal, Button, Form, ListGroup, Alert } from 'react-bootstrap'
import { reviewsUrl, reviewsHeaders, buildDetailUrl, STRIVE_BEARER } from '../config'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'

// Modal delle recensioni di un film (progetto progressivo W9).
// Usa DUE fonti dati:
//   - OMDB (il "sito")   -> dettagli del film (?i=imdbID): trama, anno, voto IMDb;
//   - striveschool (bearer) -> lettura/scrittura/eliminazione delle recensioni.
class ReviewModal extends Component {
  state = {
    reviews: [],       // recensioni ricevute dal backend
    loading: true,     // sto caricando le recensioni?
    error: "",         // errore di caricamento recensioni
    details: null,     // dettagli del film da OMDB (opzionali)
    comment: "",       // testo del form (input controllato)
    rate: "5",         // voto del form (stringa dalla select)
    submitting: false, // sto inviando una nuova recensione?
    submitError: "",   // errore in fase di invio
  }

  // Con i class component il modal resta montato ma "chiuso": intercetto l'APERTURA
  // (show passa da false a true) e solo allora carico i dati. Equivale a un useEffect
  // che dipende da "show".
  componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      this.loadReviews()
      this.loadDetails()
    }
  }

  // GET recensioni: il backend, se il path è un elementId, restituisce l'array dei commenti.
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

  // Input controllati: lo stato React è l'unica fonte di verità del form.
  handleChangeComment = (e) => this.setState({ comment: e.target.value })
  handleChangeRate = (e) => this.setState({ rate: e.target.value })

  // POST nuova recensione: body { comment, rate, elementId }. elementId = imdbID del film.
  handleSubmit = async (e) => {
    e.preventDefault() // evito il reload della pagina del form
    this.setState({ submitting: true, submitError: "" })
    try {
      const body = {
        comment: this.state.comment,
        rate: this.state.rate,
        elementId: this.props.movie.imdbID,
      }
      const response = await fetch(reviewsUrl(), {
        method: "POST",
        headers: reviewsHeaders(),
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error("Invio non riuscito (" + response.status + ")")
      }
      // Svuoto il form e ricarico la lista aggiornata dal server.
      this.setState({ comment: "", rate: "5", submitting: false })
      this.loadReviews()
    } catch (err) {
      this.setState({ submitError: err.message, submitting: false })
    }
  }

  // DELETE recensione tramite il suo _id.
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

  // Trasformo il voto numerico in stelline piene/vuote (solo testo, nessun HTML).
  renderStars(rate) {
    let full = Number(rate)
    if (!full || full < 0) full = 0
    if (full > 5) full = 5
    return "★".repeat(full) + "☆".repeat(5 - full)
  }

  // Sezione dettagli film (da OMDB). Se non ci sono, non mostro nulla.
  renderDetails() {
    const d = this.state.details
    if (!d) return null

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

  // Lista recensioni: gestisco loading / errore / lista vuota / lista piena (senza ternari).
  renderReviews() {
    if (this.state.loading) {
      return <Loader />
    }
    if (this.state.error) {
      return <ErrorAlert message={this.state.error} onRetry={this.loadReviews} />
    }
    if (this.state.reviews.length === 0) {
      return <p className="text-secondary">Ancora nessuna recensione. Scrivi la prima!</p>
    }
    return (
      <ListGroup variant="flush" className="review-list">
        {this.state.reviews.map((r) => (
          <ListGroup.Item key={r._id} className="review-item">
            <div className="d-flex justify-content-between align-items-center">
              <strong>{r.author}</strong>
              <span className="review-stars">{this.renderStars(r.rate)}</span>
            </div>
            <div className="my-1">{r.comment}</div>
            <Button variant="link" size="sm" className="review-delete p-0" onClick={() => this.handleDelete(r._id)}>
              Elimina
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    )
  }

  render() {
    const movie = this.props.movie

    // Etichetta del bottone di invio calcolata senza ternario.
    let submitLabel = "Invia recensione"
    if (this.state.submitting) {
      submitLabel = "Invio in corso..."
    }

    return (
      <Modal show={this.props.show} onHide={this.props.onHide} centered scrollable contentClassName="review-modal-content">
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title className="h6 mb-0">Recensioni · {movie.Title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.renderDetails()}
          {this.renderReviews()}

          <hr className="review-sep" />

          {/* Form per aggiungere una recensione */}
          <Form onSubmit={this.handleSubmit}>
            <Form.Group className="mb-2">
              <Form.Label className="small">Il tuo voto</Form.Label>
              <Form.Select value={this.state.rate} onChange={this.handleChangeRate}>
                <option value="1">1 - Pessimo</option>
                <option value="2">2 - Mediocre</option>
                <option value="3">3 - Sufficiente</option>
                <option value="4">4 - Buono</option>
                <option value="5">5 - Ottimo</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small">La tua recensione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={this.state.comment}
                onChange={this.handleChangeComment}
                placeholder="Scrivi qui la tua opinione..."
                required
              />
            </Form.Group>

            {/* Mostro l'errore di invio solo se presente (&& non è un ternario) */}
            {this.state.submitError && (
              <Alert variant="danger" className="py-1 px-2 small">{this.state.submitError}</Alert>
            )}

            <Button type="submit" variant="danger" disabled={this.state.submitting}>
              {submitLabel}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}

export default ReviewModal
