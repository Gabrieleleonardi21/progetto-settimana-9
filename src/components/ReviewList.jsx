import { Button } from 'react-bootstrap'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'
import StarRating from './StarRating'

// Icona cestino: e' l'SVG "trash" di Bootstrap Icons copiato inline,
// cosi' non serve installare il pacchetto delle icone per una sola immagine.
// fill="currentColor" -> prende il colore del bottone che la contiene.
function IconaCestino() {
  return (
    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
      <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
    </svg>
  )
}

// Elenco delle recensioni di un film. Componente di sola presentazione:
// riceve dati e callback dai props (lo stato e le fetch restano nel container ReviewSection).
function ReviewList({ reviews, loading, error, onRetry, onDelete }) {
  // Gestisco loading / errore / lista vuota / lista piena con if + return (niente ternari).
  if (loading) {
    return <Loader message="Caricamento recensioni..." />
  }
  if (error) {
    return <ErrorAlert message={error} onRetry={onRetry} />
  }
  if (reviews.length === 0) {
    return <p className="text-body-secondary">Ancora nessuna recensione. Scrivi la prima!</p>
  }

  return (
    // Lista scrollabile: ogni recensione e' una mini-card separata.
    <ul className="list-unstyled review-list mb-3">
      {reviews.map((r) => (
        <li key={r._id} className="bg-body-tertiary rounded p-3 mb-2">
          {/* Intestazione: autore (troncato se lungo) + data a sinistra, voto a destra.
              min-w-0 permette il troncamento e impedisce che l'autore schiacci le stelle. */}
          <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
            <div className="min-w-0">
              <strong className="d-block text-truncate">{r.author}</strong>
              <span className="text-body-secondary small">
                {new Date(r.createdAt).toLocaleDateString("it-IT")}
              </span>
            </div>
            <StarRating value={r.rate} />
          </div>

          {/* Testo dell'utente: React lo tratta come testo, niente HTML -> niente XSS.
              text-break manda a capo parole lunghe senza sfondare la card. */}
          <p className="mb-2 text-break">{r.comment}</p>

          {/* Elimina la recensione tramite il suo _id. Bottone solo-icona:
              aria-label/title spiegano l'azione (accessibilita' + tooltip). */}
          <div className="text-end">
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => onDelete(r._id)}
              aria-label="Elimina recensione"
              title="Elimina recensione"
            >
              <IconaCestino />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default ReviewList
