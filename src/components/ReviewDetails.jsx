// Dettagli del film presi da OMDB: riga con anno/generi/durata, la trama e il voto IMDb.
// Componente di sola presentazione: riceve "details" dai props, nessuno stato.
// Niente locandina: e' gia' nella card che apre il pannello, e ripeterla toglierebbe
// spazio verticale alle recensioni.
function ReviewDetails({ details }) {
  // Se i dettagli non sono ancora arrivati (o OMDB ha fallito) non mostro nulla.
  if (!details) return null

  // OMDB riempie i campi che non conosce con la stringa "N/A" (tipico delle serie TV,
  // che spesso non hanno una durata). Li scarto invece di stampare "N/A" a schermo.
  const meta = [details.Year, details.Genre, details.Runtime]
    .filter((valore) => valore && valore !== "N/A")
    .join(" · ")

  // Il voto IMDb lo mostro solo se esiste davvero.
  let voto = null
  if (details.imdbRating && details.imdbRating !== "N/A") {
    voto = <span className="small">IMDb: <strong>{details.imdbRating}</strong></span>
  }

  return (
    <div className="review-details mb-3">
      {meta && <div className="text-body-secondary small mb-1">{meta}</div>}
      {/* text-break: una trama senza spazi non sfonda la colonna */}
      <p className="mb-1 text-break">{details.Plot}</p>
      {voto}
    </div>
  )
}

export default ReviewDetails
