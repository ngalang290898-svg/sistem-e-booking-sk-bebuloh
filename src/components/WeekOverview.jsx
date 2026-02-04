import React, { useMemo } from 'react'
import { formatShortDate } from '../lib/dateUtils'
import { labels } from '../lib/labels'

const dayLabels = {
  en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  bm: ['Isn', 'Sel', 'Rab', 'Kha', 'Jum']
}

export default function WeekOverview({
  rooms,
  timeSlots,
  weekDates,
  getSlotState,
  lang
}) {
  const slotsByDay = useMemo(() => {
    return weekDates.map(date => {
      const isFriday = date.getDay() === 5
      const slots = timeSlots.filter(slot =>
        isFriday ? slot.day_type === 'friday' : slot.day_type === 'weekday'
      )
      return { date, slots }
    })
  }, [timeSlots, weekDates])

  return (
    <section className="week-overview">
      <div className="week-overview__header">
        <h2>{labels[lang].weekOverviewTitle}</h2>
        <p className="subtitle">{labels[lang].weekOverviewSubtitle}</p>
      </div>

      <div className="week-overview__grid">
        {slotsByDay.map((day, index) => (
          <div key={day.date.toISOString()} className="week-day">
            <div className="week-day__header">
              <span className="week-day__label">
                {dayLabels[lang][index]}
              </span>
              <span className="week-day__date">
                {formatShortDate(day.date, lang)}
              </span>
            </div>

            <div className="week-day__slots">
              {day.slots.map(slot => {
                if (slot.is_recess) {
                  return (
                    <div key={slot.id} className="slot-row slot-row--recess">
                      <span className="slot-row__time">
                        {slot.start_time} – {slot.end_time}
                      </span>
                      <span className="slot-row__meta">
                        {labels[lang].statusRecess}
                      </span>
                    </div>
                  )
                }

                return (
                  <div key={slot.id} className="slot-row">
                    <span className="slot-row__time">
                      {slot.start_time} – {slot.end_time}
                    </span>
                    <div className="slot-row__rooms">
                      {rooms.map(room => {
                        const state = getSlotState(slot, day.date, room.id)
                        const chipClass = state.isBooked
                          ? 'is-booked'
                          : state.isAvailable
                          ? 'is-available'
                          : 'is-unavailable'
                        return (
                          <div
                            key={`${room.id}-${slot.id}-${day.date.toISOString()}`}
                            className={`room-chip ${chipClass}`}
                          >
                            <span className="room-chip__label">
                              {lang === 'en' ? room.name_en : room.name_bm}
                            </span>
                            <span className="room-chip__status">
                              {state.isBooked
                                ? labels[lang].statusBooked
                                : state.isAvailable
                                ? labels[lang].statusAvailable
                                : labels[lang].statusUnavailable}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
