import React from 'react'
import ReactDOM from 'react-dom/client'
import { AnimatePresence, motion } from 'framer-motion'
import App from './App'
import './styles/index.css'

if (typeof window !== 'undefined') {
  window.motion = motion
  window.AnimatePresence = AnimatePresence
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
