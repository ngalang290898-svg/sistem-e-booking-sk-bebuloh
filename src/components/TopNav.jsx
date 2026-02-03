import React from 'react'
import { labels } from '../lib/labels'

export default function TopNav({ lang, onToggleLang, onAdminLogin }) {
  return (
    <header className="top-nav">
      <div className="nav-left">
        <img src="/logo.png" alt="SK Bebuloh" className="logo" />
        <div className="system-copy">
          <span className="system-name">{labels[lang].systemName}</span>
          <span className="system-meta">Internal booking</span>
        </div>
      </div>

      <div className="nav-actions">
        <button
          className="text-button"
          type="button"
          onClick={onAdminLogin}
        >
          {labels[lang].adminLogin}
        </button>
        <button
          className="lang-toggle"
          onClick={() => onToggleLang(lang === 'en' ? 'bm' : 'en')}
          type="button"
        >
          {lang === 'en' ? 'BM' : 'EN'}
        </button>
      </div>
    </header>
  )
}
