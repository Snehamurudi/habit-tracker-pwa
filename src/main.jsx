import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Workbox } from 'workbox-window'

// Register service worker (generated after build by workbox-build.mjs)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const wb = new Workbox('/sw.js')
    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('New content is available; please refresh.')
      }
    })
    wb.register()
  })
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
