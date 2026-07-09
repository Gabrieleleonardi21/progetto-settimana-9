import { ListGroup, Button } from 'react-bootstrap'
import Loader from './Loader'
import ErrorAlert from './ErrorAlert'
import StarRating from './StarRating'

// Elenco delle recensioni di un film. Componente di sola presentazione:
// riceve dati e callback dai props (lo stato e le fetch restano nel container ReviewModal).
function ReviewList({ reviews, loading, error, onRetry, onDelete }) {
  // Gestisco loading / errore / lista vuota / lista piena con if + return (niente ternari).
  if (loading) {
    return <Loader />
  }
  if (error) {
    return <ErrorAlert message={error} onRetry={onRetry} />
  }
  if (reviews.length === 0) {
    return <p className="text-secondary">Ancora nessuna recensione. Scrivi la prima!</p>
  }

  return (
    <ListGroup variant="flush" className="review-list">
      {reviews.map((r) => (
        <ListGroup.Item key={r._id} className="review-item">
          <div className="d-flex justify-content-between align-items-center">
            <strong>{r.author}</strong>
            <StarRating rate={r.rate} />
          </div>
          <div className="my-1">{r.comment}</div>
          <Button variant="link" size="sm" className="review-delete p-0" onClick={() => onDelete(r._id)}>
            Elimina
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  )
}

export default ReviewList
