import { Component } from 'react'

// Mostra un voto da 0 a 5 come stelline piene/vuote.
// Solo testo (nessun HTML dinamico): zero rischi XSS.
class StarRating extends Component {
  render() {
    // Normalizzo il voto tra 0 e 5 senza operatori ternari.
    let full = Number(this.props.rate)
    if (!full || full < 0) full = 0
    if (full > 5) full = 5

    return <span className="review-stars">{"★".repeat(full) + "☆".repeat(5 - full)}</span>
  }
}

export default StarRating
