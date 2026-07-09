import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import StarRating from './StarRating'

// Form per aggiungere una recensione. Gestisce da solo lo stato dei campi e la validazione,
// poi passa i dati al genitore con onAdd(): e' il genitore (ReviewSection) a fare la POST.
// Nessun campo "autore": il backend striveschool ricava l'autore dal bearer e ignora
// un eventuale campo author inviato nel body.
function ReviewForm({ onAdd }) {
  // Uno useState per ogni campo: input controllati, lo stato React e' l'unica fonte di verita'.
  const [rate, setRate] = useState(0)       // 0 = nessun voto scelto
  const [comment, setComment] = useState("")
  const [errore, setErrore] = useState("")
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault() // evito il reload della pagina causato dal submit del form

    // Voto e commento sono obbligatori.
    if (rate === 0) {
      setErrore("Seleziona un voto da 1 a 5 stelle.")
      return
    }
    if (comment.trim() === "") {
      setErrore("Scrivi un commento.")
      return
    }

    setSubmitting(true)
    try {
      // _id, author e createdAt li genera il server: qui invio solo i dati del form.
      await onAdd({ rate: rate, comment: comment.trim() })
    } catch {
      // La POST e' fallita: tengo i dati nel form cosi' l'utente puo' riprovare.
      setErrore("Invio non riuscito, riprova.")
      setSubmitting(false)
      return
    }

    // Reset del form solo dopo l'invio andato a buon fine.
    setRate(0)
    setComment("")
    setErrore("")
    setSubmitting(false)
  }

  // Etichetta del bottone calcolata senza ternario.
  let submitLabel = "Invia recensione"
  if (submitting) {
    submitLabel = "Invio in corso..."
  }

  return (
    <Form onSubmit={handleSubmit}>
      <h6>Aggiungi una recensione</h6>

      <Form.Group className="mb-2">
        <Form.Label className="mb-1 d-block">Voto</Form.Label>
        {/* Stesse stelle della lista, ma cliccabili: onSelect le trasforma in input */}
        <StarRating value={rate} onSelect={setRate} />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label className="mb-1">Commento</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Cosa ne pensi del film?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Form.Group>

      {/* Mostro l'errore solo se presente (&& non e' un ternario) */}
      {errore && <p className="text-danger small">{errore}</p>}

      <Button type="submit" variant="danger" disabled={submitting}>
        {submitLabel}
      </Button>
    </Form>
  )
}

export default ReviewForm
