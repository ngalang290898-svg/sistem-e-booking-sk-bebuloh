import React from 'react'

export default function BookingSheet({ room, slot, onClose, lang }) {
  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <h3>{lang === 'en' ? 'Confirm Booking' : 'Sahkan Tempahan'}</h3>

        <p>
          {lang === 'en' ? room.name_en : room.name_bm}
        </p>
        <p>
          {slot.start_time} – {slot.end_time}
        </p>

        <select>
          <option>{lang === 'en' ? 'Select Class' : 'Pilih Kelas'}</option>
        </select>

        <select>
          <option>{lang === 'en' ? 'Select Subject' : 'Pilih Subjek'}</option>
        </select>

        <button className="primary">
          {lang === 'en' ? 'Confirm Booking' : 'Sahkan Tempahan'}
        </button>
      </div>
    </div>
  )
}
