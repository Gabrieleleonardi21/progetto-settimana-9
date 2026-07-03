import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css' // CSS di Bootstrap (deve stare prima dei nostri stili)
import './index.css'                            // override con il tema "Netflix"
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <App />
)
