// Mostra un voto da 0 a 5 come stelline piene/vuote.
// Solo testo (nessun HTML dinamico): zero rischi XSS.
function StarRating({ rate }) {
  // Normalizzo il voto tra 0 e 5 senza operatori ternari.
  let full = Number(rate)
  if (!full || full < 0) full = 0
  if (full > 5) full = 5

  return <span className="review-stars">{"★".repeat(full) + "☆".repeat(5 - full)}</span>
}

export default StarRating
