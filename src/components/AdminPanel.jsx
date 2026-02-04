import React, { useMemo } from 'react'
import { formatShortDate } from '../lib/dateUtils'
import { labels } from '../lib/labels'

export default function AdminPanel({
  lang,
  bookings,
  rooms,
  timeSlots,
  weekRange,
  onSignOut
}) {
  const roomMap = useMemo(() => {
    const map = new Map()
    rooms.forEach(room => {
      map.set(room.id, room)
    })
    return map
  }, [rooms])

  const slotMap = useMemo(() => {
    const map = new Map()
    timeSlots.forEach(slot => {
      map.set(slot.id, slot)
    })
    return map
  }, [timeSlots])

  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date)
      if (dateCompare !== 0) return dateCompare
      return a.time_slot_id - b.time_slot_id
    })
  }, [bookings])

  return (
    <section className="admin-panel">
      <div className="admin-header">
        <div>
          <h3>{labels[lang].adminTitle}</h3>
          <p className="meta">
            {labels[lang].adminSubtitle} ·{' '}
            {formatShortDate(weekRange.start, lang)} –{' '}
            {formatShortDate(weekRange.end, lang)}
          </p>
        </div>
        <button className="text-button" onClick={onSignOut} type="button">
          {labels[lang].adminSignOut}
        </button>
      </div>

      <div className="admin-list">
        {sortedBookings.length === 0 && (
          <div className="state-card">
            <span className="state-title">
              {labels[lang].noBookingsTitle}
            </span>
            <span className="state-meta">
              {labels[lang].adminSubtitle}
            </span>
          </div>
        )}
        {sortedBookings.map(booking => {
          const room = roomMap.get(booking.room_id)
          const slot = slotMap.get(booking.time_slot_id)
          return (
            <div
              key={booking.id}
              className="admin-card"
            >
              <div>
                <span className="meta">
                  {booking.teacher_name} · {booking.class_name}
                </span>
                <p className="admin-title">
                  {room ? (lang === 'en' ? room.name_en : room.name_bm) : 'Room'}{' '}
                  ·{' '}
                  {slot ? `${slot.start_time} – ${slot.end_time}` : ''}
                </p>
              </div>
              <div className="admin-date">
                {formatShortDate(new Date(booking.date), lang)}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
