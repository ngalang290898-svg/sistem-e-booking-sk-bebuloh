import React, { useState } from 'react'

export default function RoomFocus({
  room,
  timeSlots,
  onBack,
  onSelectSlot,
  lang
}) {
  const [day, setDay] = useState('Mon')

  return (
    <main className="room-focus">
      <header className="focus-header">
        <button onClick={onBack}>←</button>
        <h2>{lang === 'en' ? room.name_en : room.name_bm}</h2>
      </header>

      <div className="day-tabs">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(d => (
          <button
            key={d}
            className={d === day ? 'active' : ''}
            onClick={() => setDay(d)}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="slot-list">
        {timeSlots.map(slot => (
          <button
            key={slot.id}
            disabled={slot.is_recess}
            className={`slot-card ${slot.is_recess ? 'recess' : ''}`}
            onClick={() => onSelectSlot(slot)}
          >
            <span>
              {slot.start_time} – {slot.end_time}
            </span>
            <span className="slot-status">
              {slot.is_recess
                ? lang === 'en'
                  ? 'Recess'
                  : 'Rehat'
                : lang === 'en'
                ? 'Available'
                : 'Tersedia'}
            </span>
          </button>
        ))}
      </div>
    </main>
  )
}
