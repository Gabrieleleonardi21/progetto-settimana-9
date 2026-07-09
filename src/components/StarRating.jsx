// Mostra 5 stelle.
// - Senza onSelect: sola lettura (voto di una recensione, voto medio).
// - Con onSelect: stelle cliccabili, usate come input del voto nel form.
// Solo testo (nessun HTML dinamico): zero rischi XSS.
function StarRating({ value, onSelect }) {
  const stelle = [1, 2, 3, 4, 5]

  // Il voto puo' arrivare dall'API come stringa: lo normalizzo a numero.
  const voto = Number(value) || 0

  // Stella piena se il suo numero rientra nel voto, altrimenti vuota.
  function simbolo(n) {
    if (n <= voto) return "★"
    return "☆"
  }

  // Sola lettura: niente handler, solo span statici.
  if (!onSelect) {
    return (
      <span className="review-stars" aria-label={"Voto " + voto + " su 5"}>
        {stelle.map((n) => (
          <span key={n}>{simbolo(n)}</span>
        ))}
      </span>
    )
  }

  // Input voto: ogni stella e' un bottone, quindi raggiungibile da tastiera.
  return (
    <span className="review-stars fs-4">
      {stelle.map((n) => (
        <button
          key={n}
          type="button"
          className="btn btn-link p-0 text-decoration-none lh-1 review-star-btn"
          aria-label={"Assegna " + n + " stelle"}
          onClick={() => onSelect(n)}
        >
          {simbolo(n)}
        </button>
      ))}
    </span>
  )
}

export default StarRating
