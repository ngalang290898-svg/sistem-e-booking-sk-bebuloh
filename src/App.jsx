import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import TopNav from './components/TopNav'
import RoomList from './components/RoomList'
import Timetable from './components/Timetable'

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    const loadRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('active', true)
        .order('name_en')

      if (error) {
        console.error('Error loading rooms:', error)
      } else {
        setRooms(data)
      }
    }

    loadRooms()
  }, [])

  console.log('ROOMS FROM SUPABASE:', rooms)

  return (
    <div className="app-shell">
      <TopNav />

      <main className="app-main">
        <section className="left-pane">
          <RoomList
            rooms={rooms}
            selected={selectedRoom}
            onSelect={setSelectedRoom}
          />
        </section>

        <section className="right-pane">
          <div className="search-card">
            <div className="search-left">
              <h2>Check room availability</h2>
              <p className="muted">
                Select a room to highlight its weekly timetable, or view all rooms.
              </p>
            </div>
            <div className="search-right">
              <button className="btn primary">This Week</button>
              <button className="btn ghost">Next Week</button>
            </div>
          </div>

          {/* TEMPORARY: timetable disabled until Lesson 6.2 */}
          <Timetable
            days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
            timeSlots={[]}
            bookings={[]}
            highlightRoom={selectedRoom?.id}
          />
        </section>
      </main>
    </div>
  )
}
