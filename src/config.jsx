// ============================================================
// Configurazione centrale dell'applicazione
// ============================================================

// OMDB richiede una apikey PERSONALE (non un bearer): registrati gratis su
// https://www.omdbapi.com/apikey.aspx. La chiave si mette nel file .env (vedi .env.example),
// così NON finisce nel codice versionato su Git. Qui la leggo dalla variabile d'ambiente.
export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || "";

// URL base delle API OMDB. Uso https per evitare "mixed content" in produzione.
const OMDB_BASE_URL = "https://www.omdbapi.com/";

// Helper: costruisce l'URL di ricerca per titolo (?s=...).
// Centralizzato qui per non ripetere la stringa (e la apikey) in ogni componente.
export function buildSearchUrl(query, page = 1) {
  const params = new URLSearchParams({ apikey: OMDB_API_KEY, s: query, page });
  return OMDB_BASE_URL + "?" + params.toString();
}

// Helper: URL dei DETTAGLI di un singolo film su OMDB (ricerca per id: ?i=imdbID).
// Usato nel modal delle recensioni per mostrare trama, anno, voto IMDb.
export function buildDetailUrl(imdbID) {
  const params = new URLSearchParams({ apikey: OMDB_API_KEY, i: imdbID });
  return OMDB_BASE_URL + "?" + params.toString();
}

// ============================================================
// API RECENSIONI - backend "striveschool" (progetto progressivo W9)
// ============================================================

// Token JWT del backend "striveschool" (API recensioni/commenti dei film).
// ATTENZIONE: NON è una apikey OMDB. Le gallerie NON lo usano, solo il modal recensioni.
// Letto da .env (VITE_STRIVE_BEARER).
export const STRIVE_BEARER = import.meta.env.VITE_STRIVE_BEARER || "";

// URL base dell'API commenti.
const REVIEWS_BASE_URL = "https://striveschool-api.herokuapp.com/api/comments/";

// Header comuni a TUTTE le chiamate recensioni: JSON + autenticazione col bearer.
// Centralizzati qui per non riscrivere l'header Authorization in ogni fetch.
export function reviewsHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + STRIVE_BEARER,
  };
}

// URL delle recensioni:
//   reviewsUrl()          -> lista completa / creazione (POST)
//   reviewsUrl(imdbID)    -> array delle recensioni di quel film (GET, filtra per elementId)
//   reviewsUrl(commentId) -> singolo commento (DELETE / PUT)
export function reviewsUrl(idOrElement = "") {
  return REVIEWS_BASE_URL + idOrElement;
}

// Elenco delle gallerie in home page: titolo della sezione + saga da cercare su OMDB.
// Almeno 3 gallerie con 3 saghe diverse (requisito del progetto).
export const GALLERIES = [
  { title: "Trending Now", query: "Harry Potter" },
  { title: "Watch it Again", query: "Lord of the Rings" },
  { title: "New Releases", query: "Star Wars" },
];
