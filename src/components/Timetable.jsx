import React from 'react'

export default function Timetable({ days, timeSlots, highlightRoom }) {
  return (
    <div className="timetable">
      <div className="timetable-header">
        <div className="time-cell">Time</div>
        {days.map(day => (
          <div key={day} className="day-cell">{day}</div>
        ))}
      </div>

      {timeSlots.map(slot => (
        <div
          key={slot.id}
          className={`timetable-row ${slot.is_recess ? 'recess' : ''}`}
        >
          <div className="time-cell">
            {slot.start_time} – {slot.end_time}
          </div>

          {days.map(day => (
            <div
              key={day}
              className={`slot-cell ${slot.is_recess ? 'disabled' : 'available'}`}
            >
              {slot.is_recess ? 'Recess' : 'Available'}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
