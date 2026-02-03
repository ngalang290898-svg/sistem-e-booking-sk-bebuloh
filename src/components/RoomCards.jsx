import React from 'react'

export default function RoomCards({ rooms, onSelect, lang }) {
  return (
    <main className="room-cards">
      <h1>{lang === 'en' ? 'Room Availability' : 'Ketersediaan Bilik'}</h1>
      <p className="subtitle">
        {lang === 'en'
          ? 'Select a room to view available time slots'
          : 'Pilih bilik untuk melihat masa yang tersedia'}
      </p>

      <div className="card-grid">
        {rooms.map(room => (
          <button
            key={room.id}
            className="room-card"
            onClick={() => onSelect(room)}
          >
            <div className="room-icon">{room.icon || '🏫'}</div>
            <div className="room-name">
              {lang === 'en' ? room.name_en : room.name_bm}
            </div>
            <div className="room-hint">
              {lang === 'en' ? 'Tap to view' : 'Tekan untuk lihat'}
            </div>
          </button>
        ))}
      </div>
    </main>
  )
}
