import React from 'react'
import { motion } from 'framer-motion'
import { labels } from '../lib/labels'

export default function TopNav({ lang, onToggleLang }) {
  return (
    <header className="top-nav">
      <div className="nav-left">
        <img src="/logo.png" alt="SK Bebuloh" className="logo" />
        <div className="system-copy">
          <span className="system-name">{labels[lang].systemName}</span>
          <span className="system-meta">{labels[lang].systemMeta}</span>
        </div>
      </div>

      <div className="nav-actions">
        <motion.button
          className="lang-toggle"
          onClick={() => onToggleLang(lang === 'en' ? 'bm' : 'en')}
          type="button"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
        >
          {lang === 'en' ? 'BM' : 'EN'}
        </motion.button>
      </div>
    </header>
  )
}
