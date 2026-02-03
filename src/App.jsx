import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import TopNav from './components/TopNav'
import RoomList from './components/RoomList'
import Timetable from './components/Timetable'

export default function App() {
  const [rooms, setRooms] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)

  // Load rooms
  useEffect(() => {
    const loadRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('active', true)
        .order('name_en')

      if (error) {
        console.error('Rooms error:', error)
      } else {
        setRooms(data)
      }
    }

    loadRooms()
  }, [])

  // Load time slots (weekday first)
  useEffect(() => {
    const loadTimeSlots = async () => {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('day_type', 'weekday')
        .order('start_time')

      if (error) {
        console.error('Time slots error:', error)
      } else {
        setTimeSlots(data)
      }
    }

    loadTimeSlots()
  }, [])

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
              <h2>Room Availability</h2>
              <p className="muted">
                Select a room to view its weekly availability.
              </p>
            </div>
          </div>

          <Timetable
            days={['Mon', 'Tue', 'Wed', 'Thu', 'Fri']}
            timeSlots={timeSlots}
            highlightRoom={selectedRoom?.id}
          />
        </section>
      </main>
    </div>
  )
}
