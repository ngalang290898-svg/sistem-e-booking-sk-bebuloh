import React from 'react'

function Cell({ status, label }) {
  const className = `tcell ${status || 'free'}`
  return <div className={className}>{ label ? <div className="cell-label">{label}</div> : null }</div>
}

export default function Timetable({ days, timeSlots, bookings = {}, highlightRoom }) {
  // bookings shape: { dayIndex: { roomId: { time: 'Teacher' } } }
  return (
    <div className="timetable">
      <div className="t-head">
        <div className="corner" />
        {days.map((d,i)=> <div key={d} className="day-col">{d}</div>)}
      </div>

      <div className="t-body">
        {timeSlots.map(slot => (
          <div className="t-row" key={slot}>
            <div className="time-col">{slot}</div>
            {days.map((d,i) => {
              const dayIndex = i+1
              let status = 'free'
              let label = null
              if (bookings[dayIndex]) {
                // find if any room has booking at this time
                for (const rId in bookings[dayIndex]) {
                  if (bookings[dayIndex][rId] && bookings[dayIndex][rId][slot]) {
                    status = 'reserved'
                    // if highlightRoom is provided, only mark reserved for that room
                    if (!highlightRoom || highlightRoom === rId) {
                      label = bookings[dayIndex][rId][slot]
                    } else {
                      // reserved by other room - mark busy
                      label = 'Busy'
                    }
                    break
                  }
                }
              }
              // handle recess times (simple check)
              if (slot === '09:30') {
                status = 'recess'
                label = 'Rehat'
              }
              return <Cell key={`${slot}-${d}`} status={status} label={label} />
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
