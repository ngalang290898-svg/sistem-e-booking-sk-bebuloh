import React from 'react'

const RoomIcon = ({ keyName }) => {
  const base = { width: 38, height: 38, viewBox: '0 0 24 24', fill: 'none' }
  switch(keyName){
    case 'computer': return (<svg {...base}><rect x="3" y="4" width="18" height="12" rx="2" stroke="currentColor"/><rect x="8" y="18" width="8" height="2" rx="1" stroke="currentColor"/></svg>)
    case 'microscope': return (<svg {...base}><path d="M6 21h12" stroke="currentColor"/><path d="M12 3v7" stroke="currentColor"/><circle cx="17" cy="7" r="2" stroke="currentColor"/></svg>)
    case 'music': return (<svg {...base}><path d="M9 17V5l10-3v12" stroke="currentColor"/><circle cx="7" cy="17" r="3" stroke="currentColor"/></svg>)
    case 'book': return (<svg {...base}><path d="M3 6v14a1 1 0 0 0 1 1h14" stroke="currentColor"/><path d="M21 6v14" stroke="currentColor"/></svg>)
    case 'palette': return (<svg {...base}><circle cx="12" cy="12" r="9" stroke="currentColor"/></svg>)
    case 'group': return (<svg {...base}><path d="M12 12a4 4 0 1 0 0-8" stroke="currentColor"/></svg>)
    case 'meeting': return (<svg {...base}><rect x="3" y="7" width="18" height="11" rx="2" stroke="currentColor"/></svg>)
    default: return null
  }
}

export default function RoomList({ rooms, selected, onSelect }) {
  return (
    <div className="room-list">
      <div className="room-list-title">Rooms</div>
      {rooms.map(r => (
        <div key={r.id} className={`room-row ${selected?.id === r.id ? 'active' : ''}`} onClick={()=>onSelect(r)}>
          <div className="room-icon"><RoomIcon keyName={r.key}/></div>
          <div className="room-meta">
            <div className="room-name">{r.name_en}</div>
            <div className="room-sub">{r.name_bm}</div>
          </div>
          <div className="room-action">{selected?.id === r.id ? 'Selected' : '›'}</div>
        </div>
      ))}
    </div>
  )
}
