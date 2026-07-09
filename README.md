# Netflix in React 🎬

Clone della home page di Netflix costruito in **React** con **function component e hook** (`useState`, `useEffect`) e stile **Bootstrap / react-bootstrap**. I film vengono scaricati in tempo reale dalle **API di OMDB** (The Open Movie Database) e ogni film ha un **pannello recensioni** collegato al backend **striveschool** (progetto progressivo W9).

Progetto della "Settimana 9" — EPICODE.

---

## ✨ Requisiti soddisfatti

- ✅ Interfaccia della home Netflix ricreata con componenti React: **NavBar**, **Footer**, header di pagina.
- ✅ **3 gallerie**, ognuna con una saga diversa: *Harry Potter*, *Lord of the Rings*, *Star Wars*.
- ✅ Ogni galleria fa il **fetch da OMDB al caricamento** del componente (`useEffect`).
- ✅ **[EXTRA] Loader** durante il caricamento e **gestione errori** con messaggio + bottone "Riprova".
- ✅ **[W9 progressivo] Pannello recensioni** nella colonna destra: click sul poster → descrizione del film da OMDB (`?i=imdbID`) + recensioni dal backend striveschool (GET/POST/DELETE col bearer), con voto medio, stelle cliccabili nel form ed eliminazione con conferma. Un secondo click sullo stesso poster chiude il pannello.
- ✅ **Filtro per genere** nella navbar (`GenreFilter`): mostra solo i film della categoria scelta. OMDB non sa cercare per genere, quindi ogni film viene arricchito col suo `Genre` tramite `GET ?i=<imdbID>`.
- ✅ Solo **function component con hook** (`useState`, `useEffect`): nessun class component.
- ✅ **Rotte statiche**: `/` (Home), `/tv-shows` (solo serie, `&type=series`), `/movies` (solo film, `&type=movie`), più una pagina "non trovata" per ogni altro indirizzo.
- ✅ **Rotta dinamica** `/film/:imdbID`, annidata nella pagina: apre il pannello recensioni lasciando visibili le gallerie. L'indirizzo è condivisibile e il tasto Indietro del browser chiude il pannello.
- ✅ **Link e bottoni per navigare**: `NavLink` nella navbar (si marca da solo come attivo), `Link` sul poster, e un bottone di chiusura che naviga via codice con `useNavigate`.
- ✅ Codice **sicuro da XSS**: nessun `innerHTML`/`dangerouslySetInnerHTML`, React fa l'escape del testo.

---

## 🚀 Come avviare il progetto

```bash
# 1. Installa le dipendenze
npm install

# 2. Avvia il server di sviluppo
npm run dev
```

Poi apri l'indirizzo che ti mostra Vite (es. http://localhost:5173).

### ⚠️ Passaggio obbligatorio: la apikey OMDB

Le gallerie NON funzionano senza una apikey personale di OMDB (è gratis). La chiave si mette in un file `.env` (così non finisce su Git):

1. Registrati su **https://www.omdbapi.com/apikey.aspx** (piano *FREE*).
2. Controlla la mail e attiva la chiave con il link che ricevi.
3. Copia `.env.example` in `.env` (se non è già presente) e incolla la chiave:

```bash
cp .env.example .env
```

```bash
# dentro .env
VITE_OMDB_API_KEY=la-tua-chiave-qui
```

4. **Riavvia** `npm run dev` (Vite legge il `.env` solo all'avvio).

Se non la inserisci, l'app parte comunque ma ogni galleria mostra un messaggio d'errore che ti ricorda di configurarla (è la gestione errori richiesta dall'EXTRA).

### 🗣️ Le recensioni (backend striveschool + bearer)

Il token JWT `eyJhbGci...` **non è una apikey OMDB**: è un token utente del backend **striveschool**, l'API delle recensioni/commenti (`https://striveschool-api.herokuapp.com/api/comments/`). L'app usa quindi **due fonti**:

- **OMDB** (il "sito"): `GET ?s=<saga>` per i poster delle gallerie e `GET ?i=<imdbID>` per il **genere** di ogni film (serve al filtro della navbar).
- **striveschool** (il bearer): cliccando un poster si apre il **pannello recensioni** a destra. `GET /comments/<imdbID>` per leggerle, `POST /comments/` per aggiungerne una (`{ comment, rate, elementId }`), `DELETE /comments/<id>` per eliminarla. Ogni chiamata invia l'header `Authorization: Bearer <VITE_STRIVE_BEARER>`.

Il bearer si mette in `.env` (`VITE_STRIVE_BEARER`), come la apikey OMDB. Se manca, il pannello mostra un messaggio che invita a configurarlo (le gallerie funzionano comunque, non dipendono dal bearer).

---

## 🧩 Struttura del progetto

```
.env.example              # modello delle variabili d'ambiente (copialo in .env)
src/
├─ config.jsx              # env, helper URL OMDB (ricerca+dettagli), recensioni, gallerie, generi
├─ main.jsx                # entry point: avvolge <App/> nel router e importa il CSS di Bootstrap
├─ App.jsx                 # componente radice: NavBar + le rotte + Footer
├─ App.css                 # stili di layout (gallerie, poster, header, pannello recensioni)
├─ index.css               # tema "Netflix" (colori, navbar, footer)
└─ components/
   ├─ NavBar.jsx           # barra in alto: link alle pagine, ricerca, filtro generi
   ├─ CatalogPage.jsx      # 🧭 la pagina usata da tutte le rotte: gallerie + pannello
   ├─ GenreFilter.jsx      # 🎭 select delle categorie, filtra i film delle gallerie
   ├─ Footer.jsx           # footer con le colonne di link
   ├─ MovieGallery.jsx     # ⭐ fetch da OMDB (+genere di ogni film), loading/errore/filtro
   ├─ MovieCard.jsx        # singolo poster (con ripiego se la locandina manca o è rotta)
   ├─ ReviewSection.jsx    # 🗣️ pannello destro: descrizione (OMDB) + recensioni (striveschool)
   ├─ ReviewDetails.jsx    # anno, generi, durata, trama e voto IMDb del film
   ├─ Loader.jsx           # spinner di caricamento
   └─ ErrorAlert.jsx       # messaggio d'errore + bottone "Riprova"
```

Vuoi la spiegazione dettagliata della logica? È in [`SPIEGAZIONE.txt`](SPIEGAZIONE.txt).

---

## 🛠️ Tecnologie

- [React 19](https://react.dev/) (function component + hook)
- [React Router](https://reactrouter.com/) (rotte statiche, rotta dinamica annidata)
- [Vite](https://vite.dev/) (build tool e dev server)
- [Bootstrap 5](https://getbootstrap.com/) + [react-bootstrap](https://react-bootstrap.github.io/)
- [OMDB API](https://www.omdbapi.com/)

---

## 💡 Miglioramenti

**Già applicati:**

- 🔐 Credenziali (apikey OMDB e bearer) in `.env`, non nel codice: non finiscono su Git, si possono cambiare tra sviluppo e produzione, e `.env.example` documenta cosa serve.
- 🗣️ **Pannello recensioni** nella colonna destra, collegato a OMDB (descrizione) e striveschool (`GET` / `POST` / `DELETE`).
- ⌨️ **Accessibilità da tastiera** sui poster: essendo diventati `<Link>` (cioè `<a href>`), ora ricevono il focus con Tab e si aprono con Invio, senza codice aggiuntivo.
- 🎭 **Filtro per genere** nella navbar. **Costo da tenere presente:** il genere non è nella risposta della ricerca OMDB, quindi ogni galleria fa una `GET ?i=<imdbID>` per film (circa 30 richieste al caricamento della home). Il piano FREE di OMDB ne concede 1000 al giorno.
- 🖼️ **Solo film con locandina**: OMDB a volte dichiara `Poster: "N/A"`, altre volte dà un URL che risponde 404 (frequente sulle serie TV, dove escono titoli minori). I primi vengono scartati subito — risparmiando anche la loro richiesta di dettaglio — i secondi appena il browser scopre che l'immagine non c'è. Le gallerie mostrano quindi solo locandine vere, senza riquadri grigi né buchi.

**Prossimi passi consigliati:**

- ✏️ Aggiungere la **modifica** di una recensione (`PUT /comments/<id>`) per completare il CRUD: ora si può creare ed eliminare, ma non correggere. **Perché:** riusa lo stesso bearer e lo stesso pattern di fetch già presente in `ReviewSection`, quindi è poco codice, e completa la gestione delle recensioni.
- 🔎 **Paginazione dei risultati**: OMDB restituisce 10 film per pagina e dichiara il totale in `totalResults`, ma l'app mostra solo la prima pagina. **Perché:** `buildSearchUrl` accetta già il parametro `page`, quindi serve solo uno stato `pagina` e due bottoni; oggi buona parte dei risultati di una ricerca resta invisibile.
