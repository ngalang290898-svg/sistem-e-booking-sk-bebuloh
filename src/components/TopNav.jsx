import React from 'react'

export default function TopNav({ lang, onToggleLang }) {
  return (
    <header className="top-nav">
      <div className="nav-left">
        <img src="/logo.png" alt="SK Bebuloh" className="logo" />
        <span className="system-name">E-Booking SK Bebuloh</span>
      </div>

      <button
        className="lang-toggle"
        onClick={() => onToggleLang(lang === 'en' ? 'bm' : 'en')}
      >
        {lang === 'en' ? 'BM' : 'EN'}
      </button>
    </header>
  )
}
