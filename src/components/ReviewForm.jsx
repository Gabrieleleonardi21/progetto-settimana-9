import { useState } from 'react'
import { Form, Button, Alert } from 'react-bootstrap'
import { reviewsUrl, reviewsHeaders } from '../config'

// Form per aggiungere una recensione. Gestisce da solo lo stato dei campi e l'invio (POST),
// poi avvisa il genitore con onAdded() perché ricarichi la lista aggiornata dal server.
// Riceve solo "elementId" (imdbID del film) e la callback "onAdded".
function ReviewForm({ elementId, onAdded }) {
  // Uno useState per ogni pezzo di stato: input controllati + stato dell'invio.
  const [comment, setComment] = useState("")     // testo della recensione
  const [rate, setRate] = useState("5")          // voto scelto (stringa dalla select)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // POST nuova recensione: body { comment, rate, elementId }. elementId = imdbID del film.
  async function handleSubmit(e) {
    e.preventDefault() // evito il reload della pagina causato dal submit del form
    setSubmitting(true)
    setSubmitError("")
    try {
      const response = await fetch(reviewsUrl(), {
        method: "POST",
        headers: reviewsHeaders(),
        body: JSON.stringify({ comment, rate, elementId }),
      })
      if (!response.ok) {
        throw new Error("Invio non riuscito (" + response.status + ")")
      }
      // Svuoto il form e chiedo al genitore di ricaricare la lista aggiornata.
      setComment("")
      setRate("5")
      setSubmitting(false)
      onAdded()
    } catch (err) {
      setSubmitError(err.message)
      setSubmitting(false)
    }
  }

  // Etichetta del bottone calcolata senza ternario.
  let submitLabel = "Invia recensione"
  if (submitting) {
    submitLabel = "Invio in corso..."
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-2">
        <Form.Label className="small">Il tuo voto</Form.Label>
        <Form.Select value={rate} onChange={(e) => setRate(e.target.value)}>
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Scrivi qui la tua opinione..."
          required
        />
      </Form.Group>

      {/* Mostro l'errore di invio solo se presente (&& non è un ternario) */}
      {submitError && (
        <Alert variant="danger" className="py-1 px-2 small">{submitError}</Alert>
      )}

      <Button type="submit" variant="danger" disabled={submitting}>
        {submitLabel}
      </Button>
    </Form>
  )
}

export default ReviewForm
