import { Outlet, useMatch } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'
import MovieGallery from './MovieGallery'

// Pagina di catalogo: la usano TUTTE E TRE le rotte statiche (Home, TV Shows, Movies).
// Cambiano solo i props, non il componente:
//   titolo   -> l'intestazione mostrata in cima
//   type     -> il filtro OMDB sul tipo ("" = tutto, "series", "movie")
//   basePath -> "" per la home, "/tv-shows" o "/movies": serve a costruire i link dei film
//   gallerie -> le file da mostrare (una per elemento): la pagina decide quante sono
function CatalogPage({ titolo, type, basePath, gallerie, search, genre }) {
  // La rotta del film e' ANNIDATA dentro questa pagina (es. /movies/film/tt0241527).
  // useMatch mi dice se l'indirizzo attuale la combacia: da li' ricavo quale film e' aperto.
  // E' l'indirizzo, non uno useState, a decidere cosa mostrare: il tasto Indietro del
  // browser chiude il pannello, e l'indirizzo si puo' condividere.
  const match = useMatch(basePath + "/film/:imdbID")
  let selectedId = ""
  if (match) {
    selectedId = match.params.imdbID
  }

  // Cosa mostrare: risultati di ricerca oppure le gallerie di default (senza ternario).
  function renderGalleries() {
    if (search) {
      // key = termine cercato: cambiandolo la MovieGallery riparte da zero (stato pulito).
      return (
        <MovieGallery
          key={search}
          title={'Risultati per "' + search + '"'}
          query={search}
          type={type}
          genre={genre}
          basePath={basePath}
          selectedId={selectedId}
        />
      )
    }
    return gallerie.map((gallery) => (
      <MovieGallery
        key={gallery.title}
        title={gallery.title}
        query={gallery.query}
        type={type}
        genre={genre}
        basePath={basePath}
        selectedId={selectedId}
      />
    ))
  }

  // Le gallerie occupano tutta la larghezza quando nessun film e' aperto,
  // altrimenti lasciano 5 colonne su 12 al pannello recensioni.
  let colonneGallerie = 12
  if (selectedId) colonneGallerie = 7

  return (
    <main className="main-content">
      <Row className="g-4">
        {/* Colonna sinistra: intestazione + gallerie (larghezza dinamica) */}
        <Col lg={colonneGallerie}>
          <div className="page-header">
            <h1 className="page-title">{titolo}</h1>
          </div>

          {renderGalleries()}
        </Col>

        {/* Colonna destra: c'e' solo se l'indirizzo contiene un film.
            <Outlet/> e' il "buco" dove il router inserisce la rotta annidata (ReviewSection).
            context: passa basePath al pannello, che lo usa per il bottone di chiusura.
            key={selectedId}: cambiando film il pannello si rimonta e riparte dal loader,
            invece di mostrare le recensioni del film precedente mentre carica le nuove. */}
        {selectedId && (
          <Col lg={5}>
            <div className="position-sticky review-sticky" key={selectedId}>
              <Outlet context={{ basePath }} />
            </div>
          </Col>
        )}
      </Row>
    </main>
  )
}

export default CatalogPage
