import { Component } from 'react'
import { Spinner } from 'react-bootstrap'

// Loader mostrato mentre la galleria sta scaricando i film da OMDB.
// È un class component "di presentazione": non ha stato, solo render.
class Loader extends Component {
  render() {
    return (
      <div className="d-flex align-items-center gap-2 text-secondary py-3">
        <Spinner animation="border" variant="light" size="sm" />
        <span>Caricamento film in corso...</span>
      </div>
    )
  }
}

export default Loader
