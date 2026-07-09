import { Alert, Button } from 'react-bootstrap'

// Messaggio di errore mostrato quando il fetch fallisce (rete, apikey errata, nessun risultato).
// Riceve dai props il messaggio e la funzione di retry (destrutturati nella firma).
function ErrorAlert({ message, onRetry }) {
  return (
    <Alert variant="danger" className="d-flex justify-content-between align-items-center">
      {/* React fa l'escape del testo: nessun rischio XSS anche se il messaggio arriva dall'API */}
      <span>{message}</span>
      <Button variant="outline-light" size="sm" onClick={onRetry}>
        Riprova
      </Button>
    </Alert>
  )
}

export default ErrorAlert
