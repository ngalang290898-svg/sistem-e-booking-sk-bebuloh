import React from 'react'

const Icon = ({ name, className='' }) => {
  const common = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
  switch (name) {
    case 'home':
      return (
        <svg {...common} className={className}><path d="M3 11.5L12 4l9 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 21V11.5h16V21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )
    case 'clock':
      return (<svg {...common} className={className}><path d="M12 8v5l3 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" /></svg>)
    case 'user':
      return (<svg {...common} className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.6"/></svg>)
    case 'lang':
      return (<svg {...common} className={className}><path d="M2 12h20" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2c3 3 3 7 0 10-3-3-3-7 0-10z" stroke="currentColor" strokeWidth="1.6"/></svg>)
    default:
      return null
  }
}

export default function TopNav(){
  return (
    <nav className="topnav glass">
      <div className="brand">
        <div className="brand-icon">📘</div>
        <div>
          <div className="brand-title">E-Booking</div>
          <div className="brand-sub">SK Bebuloh</div>
        </div>
      </div>

      <div className="nav-actions">
        <button className="icon-btn"><Icon name="home"/></button>
        <button className="icon-btn"><Icon name="clock"/></button>
        <button className="icon-btn"><Icon name="user"/></button>
        <button className="lang-btn"><Icon name="lang"/> EN</button>
      </div>
    </nav>
  )
}
