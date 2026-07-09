import { useState, useEffect } from 'react'
import { useParams, useOutletContext, useNavigate, useLocation } from 'react-router-dom'
import { CloseButton } from 'react-bootstrap'
import { reviewsUrl, reviewsHeaders, buildDetailUrl, STRIVE_BEARER } from '../config'
import ReviewDetails from './ReviewDetails'
import ReviewList from './ReviewList'
import ReviewForm from './ReviewForm'
import StarRating from './StarRating'

// Media dei voti (0 se non ci sono recensioni).
// Number(): il voto arriva dall'API, cosi' evito somme errate se fosse una stringa.
function mediaVoti(reviews) {
  if (reviews.length === 0) return 0
  const somma = reviews.reduce((tot, r) => tot + Number(r.rate), 0)
  return somma / reviews.length
}

// "1 recensione" / "N recensioni" (evita il plurale con 1 elemento).
function labelRecensioni(n) {
  if (n === 1) return "1 recensione"
  return n + " recensioni"
}

// Pannello recensioni: e' la rotta annidata /film/:imdbID, e vive nella colonna
// destra di CatalogPage (dentro il suo <Outlet/>). Non e' una modale.
// Il film da mostrare arriva dall'INDIRIZZO (useParams), non dai props: cosi' il
// link e' condivisibile e il tasto Indietro del browser chiude il pannello.
// CatalogPage lo monta con key={imdbID}: cambiando film si rimonta e lo stato riparte pulito.
function ReviewSection() {
  // ":imdbID" della rotta: e' la parte variabile dell'indirizzo.
  const { imdbID } = useParams()
  // basePath arriva da CatalogPage tramite il context dell'Outlet ("", "/movies", ...).
  const { basePath } = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()

  // Il titolo viaggia insieme alla navigazione: la MovieCard lo allega al suo <Link>,
  // quindi compare subito, senza aspettare la rete. Se l'indirizzo viene aperto
  // direttamente (link condiviso, refresh) lo state non c'e' e il titolo arriva
  // dai dettagli OMDB, insieme a trama, anno e voto.
  let titoloDalLink = ""
  if (location.state && location.state.title) {
    titoloDalLink = location.state.title
  }

  const [details, setDetails] = useState(null) // dettagli del film da OMDB (trama, anno, voto)
  const [reviews, setReviews] = useState([])   // recensioni ricevute dal backend
  const [loading, setLoading] = useState(true) // sto caricando le recensioni?
  const [error, setError] = useState("")       // errore di caricamento recensioni
  // Contatore che fa ripartire l'effect delle recensioni quando si clicca "Riprova".
  const [attempt, setAttempt] = useState(0)

  // GET dettagli film da OMDB (?i=imdbID): trama, anno, generi, durata, voto IMDb.
  // Effect separato da quello delle recensioni: sono dati opzionali, e se falliscono
  // il pannello continua a mostrare le recensioni. Non dipende da "attempt", cosi'
  // il bottone "Riprova" delle recensioni non rifa' anche questa chiamata.
  useEffect(() => {
    let annullato = false

    async function caricaDettagli() {
      try {
        const response = await fetch(buildDetailUrl(imdbID))
        const data = await response.json()
        if (annullato) return
        if (data.Response !== "False") {
          setDetails(data)
        }
      } catch {
        // Dettagli non recuperabili: mostro comunque titolo e recensioni.
      }
    }

    caricaDettagli()
    return () => { annullato = true }
  }, [imdbID])

  // GET recensioni del film (il backend filtra per elementId = imdbID).
  useEffect(() => {
    // Flag di cleanup: se il pannello si chiude prima della risposta, ignoro il risultato.
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

        // Per sicurezza tengo solo se e' un array (film senza recensioni -> array vuoto).
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

  // POST nuova recensione. Il server risponde con la recensione creata (con _id e createdAt):
  // la aggiungo in fondo alla lista, senza rifare la GET di tutte le recensioni.
  // Se la fetch fallisce l'errore risale a ReviewForm, che avvisa l'utente e tiene i dati.
  async function handleAdd(nuova) {
    const response = await fetch(reviewsUrl(), {
      method: "POST",
      headers: reviewsHeaders(),
      body: JSON.stringify({ ...nuova, elementId: imdbID }),
    })
    if (!response.ok) {
      throw new Error("Invio non riuscito (" + response.status + ")")
    }
    const creata = await response.json()
    setReviews((precedenti) => [...precedenti, creata])
  }

  // DELETE recensione tramite il suo _id, con conferma: e' un'azione irreversibile.
  async function handleDelete(id) {
    if (!window.confirm("Eliminare questa recensione?")) return

    try {
      const response = await fetch(reviewsUrl(id), { method: "DELETE", headers: reviewsHeaders() })
      if (!response.ok) {
        throw new Error("Eliminazione non riuscita (" + response.status + ")")
      }
      // Tolgo la recensione dalla lista locale invece di riscaricarle tutte.
      setReviews((precedenti) => precedenti.filter((r) => r._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  // Il "Riprova" della lista: rimette il loader e fa ripartire l'effect della GET.
  function ricaricaRecensioni() {
    setLoading(true)
    setError("")
    setAttempt((n) => n + 1)
  }

  // Chiusura da bottone: navigazione PROGRAMMATICA verso la pagina senza film.
  // basePath e' "" sulla home, quindi ci torno con "/".
  function chiudi() {
    navigate(basePath || "/")
  }

  const media = mediaVoti(reviews)

  // Titolo: quello allegato al link, altrimenti quello arrivato dai dettagli OMDB.
  let titolo = titoloDalLink
  if (!titolo && details) {
    titolo = details.Title
  }

  return (
    // review-panel: colonna flex alta al massimo quanto la viewport, cosi' il form
    // resta sempre visibile e scorre solo la lista in mezzo.
    // data-bs-theme="dark": dice a Bootstrap 5.3 che qui dentro il tema e' scuro,
    // cosi' bg-body-tertiary, text-body-secondary e i campi del form restano scuri.
    <div className="review-panel" data-bs-theme="dark">
      <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
        <h5 className="mb-0">{titolo}</h5>
        <CloseButton variant="white" onClick={chiudi} aria-label="Chiudi le recensioni" />
      </div>

      {/* Descrizione del film presa da OMDB: anno/generi/durata, trama, voto IMDb */}
      <ReviewDetails details={details} />

      {/* Riepilogo voto medio: media arrotondata per le stelle piene.
          Lo mostro solo quando le recensioni sono davvero caricate. */}
      {!loading && !error && (
        <div className="d-flex align-items-center gap-2 mb-3">
          <StarRating value={Math.round(media)} />
          <span className="text-body-secondary small">
            {media.toFixed(1)} · {labelRecensioni(reviews.length)}
          </span>
        </div>
      )}

      <ReviewList
        reviews={reviews}
        loading={loading}
        error={error}
        onRetry={ricaricaRecensioni}
        onDelete={handleDelete}
      />

      <hr className="review-sep" />

      <ReviewForm onAdd={handleAdd} />
    </div>
  )
}

export default ReviewSection
