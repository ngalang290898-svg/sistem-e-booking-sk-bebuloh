import React from 'react'
import { motion } from 'framer-motion'
import {
  formatLongDate,
  formatShortDate,
  isSameDay,
  toDateKey
} from '../lib/dateUtils'
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
  getSlotState
}) {
  const dateKey = toDateKey(selectedDate)

  return (
    <main className="room-focus">
      <header className="focus-header">
        <motion.button
          className="icon-button"
          onClick={onBack}
          type="button"
          whileTap={{ scale: 0.92 }}
        >
          ←
        </motion.button>
        <div>
          <h2>{lang === 'en' ? room.name_en : room.name_bm}</h2>
          <p className="meta">
            {formatLongDate(selectedDate, lang)}
          </p>
        </div>
      </header>

      <div className="day-tabs" role="tablist">
        {days.map((date, index) => {
          const disabled = isDateDisabled(date)
          const active = isSameDay(date, selectedDate)
          return (
            <motion.button
              key={date.toISOString()}
              className={`${active ? 'active' : ''} ${
                disabled ? 'disabled' : ''
              }`}
              onClick={() => onSelectDate(date)}
              type="button"
              disabled={disabled}
              whileTap={{ scale: 0.96 }}
            >
              <span>{dayLabels[lang][index]}</span>
              <span className="tab-date">
                {formatShortDate(date, lang)}
              </span>
            </motion.button>
          )
        })}
      </div>

      <div className="slot-list">
        {timeSlots.map(slot => {
          const state = getSlotState(slot, selectedDate, room.id)
          const statusLabel = state.isRecess
            ? labels[lang].statusRecess
            : state.isBooked
            ? labels[lang].statusBooked
            : state.isClosed
            ? labels[lang].statusClosed
            : state.isDateValid
            ? labels[lang].statusAvailable
            : labels[lang].statusUnavailable
          const statusClass = state.isRecess
            ? 'is-recess'
            : state.isBooked
            ? 'is-booked'
            : state.isClosed
            ? 'is-closed'
            : state.isDateValid
            ? 'is-available'
            : 'is-unavailable'
          return (
            <motion.button
              key={`${dateKey}-${slot.id}`}
              disabled={!state.isAvailable}
              className={`slot-card ${
                state.isRecess ? 'slot-card--recess' : ''
              } ${!state.isAvailable ? 'slot-card--disabled' : ''}`}
              onClick={() => onSelectSlot(slot)}
              type="button"
              whileTap={{ scale: 0.97 }}
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
              <span className={`slot-status ${statusClass}`}>
                {statusLabel}
              </span>
            </motion.button>
          )
        })}
      </div>
    </main>
  )
}
