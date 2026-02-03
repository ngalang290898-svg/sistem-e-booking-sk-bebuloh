import React from 'react'
import { formatShortDate, isSameDay, toISODate } from '../lib/dateUtils'
import { labels } from '../lib/labels'

const dayLabels = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  bm: ['Isn', 'Sel', 'Rab', 'Kha', 'Jum']
}

export default function RoomFocus({
  room,
  timeSlots,
  onBack,
  onSelectSlot,
  lang,
  days,
  selectedDate,
  onSelectDate,
  isDateDisabled,
  bookings,
  getSlotState
}) {
  const dateKey = toISODate(selectedDate)
  const dayLabel =
    dayLabels[lang][selectedDate.getDay() - 1] || dayLabels[lang][0]
  const bookingCount = bookings.filter(
    booking => booking.room_id === room.id && booking.date === dateKey
  ).length

  return (
    <main className="room-focus">
      <header className="focus-header">
        <button
          className="icon-button"
          onClick={onBack}
          type="button"
        >
          ←
        </button>
        <div>
          <h2>{lang === 'en' ? room.name_en : room.name_bm}</h2>
          <p className="meta">
            {dayLabel} · {formatShortDate(selectedDate, lang)}
          </p>
        </div>
      </header>

      <div className="day-tabs" role="tablist">
        {days.map((date, index) => {
          const disabled = isDateDisabled(date)
          const active = isSameDay(date, selectedDate)
          return (
            <button
              key={date.toISOString()}
              className={`${active ? 'active' : ''} ${
                disabled ? 'disabled' : ''
              }`}
              onClick={() => onSelectDate(date)}
              type="button"
              disabled={disabled}
            >
              <span>{dayLabels[lang][index]}</span>
              <span className="tab-date">
                {formatShortDate(date, lang)}
              </span>
            </button>
          )
        })}
      </div>

      <div className="slot-list">
        {timeSlots.map(slot => {
          const state = getSlotState(slot, selectedDate, room.id)
          const statusLabel = state.isRecess
            ? labels[lang].recess
            : state.isBooked
            ? labels[lang].booked
            : state.isClosed
            ? labels[lang].closed
            : labels[lang].available
          return (
            <button
              key={`${dateKey}-${slot.id}`}
              disabled={!state.isAvailable}
              className={`slot-card ${
                state.isRecess ? 'slot-card--recess' : ''
              } ${!state.isAvailable ? 'slot-card--disabled' : ''}`}
              onClick={() => onSelectSlot(slot)}
              type="button"
            >
              <div className="slot-time">
                <span className="slot-primary">
                  {slot.start_time} – {slot.end_time}
                </span>
                <span className="slot-meta">
                  {state.isRecess
                    ? labels[lang].recess
                    : labels[lang].teachingSlot}
                </span>
              </div>
              <span className="slot-status">{statusLabel}</span>
            </button>
          )
        })}
      </div>

      <div className="focus-footer">
        <p className="meta">
          {labels[lang].roomFocusTitle} · {bookingCount} bookings
        </p>
      </div>
    </main>
  )
}
