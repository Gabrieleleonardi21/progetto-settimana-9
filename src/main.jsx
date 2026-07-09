import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css' // CSS di Bootstrap (deve stare prima dei nostri stili)
import './index.css'                            // override con il tema "Netflix"
import App from './App.jsx'

// BrowserRouter sta qui e non dentro App: cosi' App resta un normale componente,
// e nei test lo si puo' avvolgere in un router diverso (es. in memoria).
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
