import { useState, useEffect } from 'react'
import { Modal } from 'react-bootstrap'
import { reviewsUrl, reviewsHeaders, buildDetailUrl, STRIVE_BEARER } from '../config'
import ReviewDetails from './ReviewDetails'
import ReviewList from './ReviewList'
import ReviewForm from './ReviewForm'

// Modal delle recensioni di un film (progetto progressivo W9).
// Fa da "container": carica i dati (recensioni dal backend striveschool + dettagli da OMDB)
// e li passa ai sotto-componenti di presentazione (ReviewDetails, ReviewList, ReviewForm).
// Viene montato da MovieCard solo quando si apre, quindi qui basta un useEffect "al montaggio".
function ReviewModal({ movie, onHide }) {
  const [reviews, setReviews] = useState([])   // recensioni ricevute dal backend
  const [loading, setLoading] = useState(true) // sto caricando le recensioni?
  const [error, setError] = useState("")       // errore di caricamento recensioni
  const [details, setDetails] = useState(null) // dettagli del film da OMDB (opzionali)
  // Contatore che fa ripartire l'effect delle recensioni dopo invio / eliminazione / "Riprova".
  const [attempt, setAttempt] = useState(0)

  const imdbID = movie.imdbID

  // GET recensioni del film (il backend filtra per elementId = imdbID).
  useEffect(() => {
    // Flag di cleanup: se il modal si chiude prima della risposta, ignoro il risultato.
    let annullato = false

    async function caricaRecensioni() {
      try {
        // Senza bearer non posso chiamare l'API: messaggio chiaro invece di un 401 criptico.
        if (!STRIVE_BEARER) {
          throw new Error("Token recensioni mancante: imposta VITE_STRIVE_BEARER nel file .env")
        }

        const response = await fetch(reviewsUrl(imdbID), { headers: reviewsHeaders() })
        if (!response.ok) {
          throw new Error("Errore nel caricamento recensioni (" + response.status + ")")
        }
        const data = await response.json()

        // Per sicurezza tengo solo se è un array (film senza recensioni -> array vuoto).
        let list = []
        if (Array.isArray(data)) {
          list = data
        }

        if (annullato) return
        setReviews(list)
        setLoading(false)
      } catch (err) {
        if (annullato) return
        setError(err.message)
        setLoading(false)
      }
    }

    caricaRecensioni()
    return () => { annullato = true }
  }, [imdbID, attempt])

  // GET dettagli film da OMDB. Effect separato: sono opzionali e non dipendono da "attempt",
  // così il bottone "Riprova" delle recensioni non rifà anche questa chiamata.
  useEffect(() => {
    let annullato = false

    async function caricaDettagli() {
      try {
        const response = await fetch(buildDetailUrl(imdbID))
        const data = await response.json()
        let found = null
        if (data.Response !== "False") {
          found = data
        }
        if (annullato) return
        setDetails(found)
      } catch {
        // Se OMDB fallisce non blocco le recensioni: semplicemente non mostro i dettagli.
        if (annullato) return
        setDetails(null)
      }
    }

    caricaDettagli()
    return () => { annullato = true }
  }, [imdbID])

  // Rilancia l'effect delle recensioni. La chiamano il "Riprova", l'invio e l'eliminazione.
  function ricaricaRecensioni() {
    setLoading(true)
    setError("")
    setAttempt((n) => n + 1)
  }

  // DELETE recensione tramite il suo _id, poi ricarico la lista aggiornata.
  async function handleDelete(id) {
    try {
      const response = await fetch(reviewsUrl(id), { method: "DELETE", headers: reviewsHeaders() })
      if (!response.ok) {
        throw new Error("Eliminazione non riuscita (" + response.status + ")")
      }
      ricaricaRecensioni()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show onHide={onHide} centered scrollable contentClassName="review-modal-content">
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="h6 mb-0">Recensioni · {movie.Title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* Dettagli film + lista recensioni: dati calati dallo stato del container */}
        <ReviewDetails details={details} />
        <ReviewList
          reviews={reviews}
          loading={loading}
          error={error}
          onRetry={ricaricaRecensioni}
          onDelete={handleDelete}
        />

        <hr className="review-sep" />

        {/* Dopo l'invio ReviewForm chiama onAdded -> ricarico la lista aggiornata */}
        <ReviewForm elementId={imdbID} onAdded={ricaricaRecensioni} />
      </Modal.Body>
    </Modal>
  )
}

export default ReviewModal
