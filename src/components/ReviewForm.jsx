import { Component } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { reviewsUrl, reviewsHeaders } from '../config'

// Form per aggiungere una recensione. Gestisce da solo lo stato dei campi e l'invio (POST),
// poi avvisa il genitore con onAdded() perché ricarichi la lista aggiornata dal server.
// Riceve solo "elementId" (imdbID del film) e la callback "onAdded".
class ReviewForm extends Component {
  state = {
    comment: "",       // testo della recensione (input controllato)
    rate: "5",         // voto scelto (stringa dalla select)
    submitting: false, // sto inviando?
    submitError: "",   // errore in fase di invio
  }

  // Input controllati: lo stato React è l'unica fonte di verità del form.
  handleChangeComment = (e) => this.setState({ comment: e.target.value })
  handleChangeRate = (e) => this.setState({ rate: e.target.value })

  // POST nuova recensione: body { comment, rate, elementId }. elementId = imdbID del film.
  handleSubmit = async (e) => {
    e.preventDefault() // evito il reload della pagina causato dal submit del form
    this.setState({ submitting: true, submitError: "" })
    try {
      const body = {
        comment: this.state.comment,
        rate: this.state.rate,
        elementId: this.props.elementId,
      }
      const response = await fetch(reviewsUrl(), {
        method: "POST",
        headers: reviewsHeaders(),
        body: JSON.stringify(body),
      })
      if (!response.ok) {
        throw new Error("Invio non riuscito (" + response.status + ")")
      }
      // Svuoto il form e chiedo al genitore di ricaricare la lista aggiornata.
      this.setState({ comment: "", rate: "5", submitting: false })
      this.props.onAdded()
    } catch (err) {
      this.setState({ submitError: err.message, submitting: false })
    }
  }

  render() {
    // Etichetta del bottone calcolata senza ternario.
    let submitLabel = "Invia recensione"
    if (this.state.submitting) {
      submitLabel = "Invio in corso..."
    }

    return (
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
    )
  }
}

export default ReviewForm
