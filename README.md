# Netflix in React 🎬

Clone della home page di Netflix costruito in **React** con **class component** (niente hook) e stile **Bootstrap / react-bootstrap**. I film vengono scaricati in tempo reale dalle **API di OMDB** (The Open Movie Database) e ogni film ha un **modal recensioni** collegato al backend **striveschool** (progetto progressivo W9).

Progetto della "Settimana 9" — EPICODE.

---

## ✨ Requisiti soddisfatti

- ✅ Interfaccia della home Netflix ricreata con componenti React: **NavBar**, **Footer**, header di pagina.
- ✅ **3 gallerie**, ognuna con una saga diversa: *Harry Potter*, *Lord of the Rings*, *Star Wars*.
- ✅ Ogni galleria fa il **fetch da OMDB al caricamento** del componente (`componentDidMount`).
- ✅ **[EXTRA] Loader** durante il caricamento e **gestione errori** con messaggio + bottone "Riprova".
- ✅ **[W9 progressivo] Modal recensioni**: click sul poster → dettagli film da OMDB (`?i=imdbID`) + recensioni dal backend striveschool (GET/POST/DELETE col bearer).
- ✅ Solo **class component** (nessun hook), come richiesto.
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

Il token JWT `eyJhbGci...` **non è una apikey OMDB**: è un token utente del backend **striveschool**, l'API delle recensioni/commenti (`https://striveschool-api.herokuapp.com/api/comments/`). Cliccando un poster si apre il **modal recensioni**, che usa **due fonti**:

- **OMDB** (il "sito"): `GET ?i=<imdbID>` per i dettagli del film (trama, anno, voto IMDb).
- **striveschool** (il bearer): `GET /comments/<imdbID>` per leggere le recensioni, `POST /comments/` per aggiungerne una (`{ comment, rate, elementId }`), `DELETE /comments/<id>` per eliminarla. Ogni chiamata invia l'header `Authorization: Bearer <VITE_STRIVE_BEARER>`.

Il bearer si mette in `.env` (`VITE_STRIVE_BEARER`), come la apikey OMDB. Se manca, il modal mostra un messaggio che invita a configurarlo (le gallerie funzionano comunque, non dipendono dal bearer).

---

## 🧩 Struttura del progetto

```
.env.example              # modello delle variabili d'ambiente (copialo in .env)
src/
├─ config.jsx              # env, helper URL OMDB (ricerca+dettagli) e recensioni, elenco gallerie
├─ main.jsx                # entry point: monta <App/> e importa il CSS di Bootstrap
├─ App.jsx                 # componente radice: NavBar + gallerie + Footer
├─ App.css                 # stili di layout (gallerie, poster, header, modal)
├─ index.css               # tema "Netflix" (colori, navbar, footer)
└─ components/
   ├─ NavBar.jsx           # barra di navigazione in alto
   ├─ Footer.jsx           # footer con le colonne di link
   ├─ MovieGallery.jsx     # ⭐ fa il fetch da OMDB e gestisce loading/errore/lista
   ├─ MovieCard.jsx        # singolo poster del film; al click apre il modal recensioni
   ├─ ReviewModal.jsx      # 🗣️ dettagli film (OMDB) + recensioni (striveschool: GET/POST/DELETE)
   ├─ Loader.jsx           # spinner di caricamento
   └─ ErrorAlert.jsx       # messaggio d'errore + bottone "Riprova"
```

Vuoi la spiegazione dettagliata della logica? È in [`SPIEGAZIONE.txt`](SPIEGAZIONE.txt).

---

## 🛠️ Tecnologie

- [React 19](https://react.dev/) (class component)
- [Vite](https://vite.dev/) (build tool e dev server)
- [Bootstrap 5](https://getbootstrap.com/) + [react-bootstrap](https://react-bootstrap.github.io/)
- [OMDB API](https://www.omdbapi.com/)

---

## 💡 Miglioramenti

**Già applicati:**

- 🔐 Credenziali (apikey OMDB e bearer) in `.env`, non nel codice: non finiscono su Git, si possono cambiare tra sviluppo e produzione, e `.env.example` documenta cosa serve.
- 🗣️ **Modal recensioni** collegato a OMDB (dettagli) e striveschool (recensioni con `GET` / `POST` / `DELETE`).

**Prossimo passo consigliato:**

- ✏️ Aggiungere la **modifica** di una recensione (`PUT /comments/<id>`) per completare il CRUD: ora si può creare ed eliminare, ma non correggere. **Perché:** riusa lo stesso bearer e lo stesso pattern di fetch già presente in `ReviewModal`, quindi è poco codice, e completa la gestione delle recensioni.
- ⌨️ **Accessibilità da tastiera** sulla card: oggi il poster apre il modal solo col mouse (`onClick` su un `div`). Aggiungere `tabIndex={0}` e un `onKeyDown` che apre su Invio/Spazio. **Perché:** rende l'app usabile senza mouse e più corretta a livello semantico, senza cambiare la struttura.
