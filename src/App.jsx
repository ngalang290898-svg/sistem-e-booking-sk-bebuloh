import React, { useState } from 'react'
import Timetable from './components/Timetable'
import RoomList from './components/RoomList'
import TopNav from './components/TopNav'
import './style.css'

// Demo data: rooms & times (we'll later replace with Supabase)
const ROOMS = [
  { id: 'r1', key: 'computer', name_en: 'Computer Lab', name_bm: 'Makmal Komputer', icon: 'computer' },
  { id: 'r2', key: 'science', name_en: 'Science Lab', name_bm: 'Makmal Sains', icon: 'microscope' },
  { id: 'r3', key: 'music', name_en: 'Music Room', name_bm: 'Bilik Muzik', icon: 'music' },
  { id: 'r4', key: 'library', name_en: 'Resource Centre', name_bm: 'Pusat Sumber', icon: 'book' },
  { id: 'r5', key: 'pak21', name_en: 'PAK-21', name_bm: 'Bilik PAK-21', icon: 'group' },
  { id: 'r6', key: 'art', name_en: 'Art Room', name_bm: 'Bilik Seni', icon: 'palette' },
  { id: 'r7', key: 'crystal', name_en: 'Crystal Meeting', name_bm: 'Bilik Mesyuarat Crystal', icon: 'meeting' },
]

// demo time slots (simplified)
const TIME_SLOTS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30',
  '10:20','10:50','11:50','12:20'
]

// demo bookings: map date->room->time -> teacher short
// we'll render some reserved cells to demo
const demoBookings = {
  // Monday
  1: { // day index 1..5 (Mon..Fri)
    r1: { '08:00': 'AHMAD A.' },
    r2: { '10:20': 'NICOLE W.' }
  },
  2: {},
  3: {},
  4: {},
  5: {
    r3: { '07:30': 'JULIANA' },
  }
}

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [rooms] = useState(ROOMS)
  const [timeSlots] = useState(TIME_SLOTS)

  return (
    <div className="app-shell">
      <TopNav />
      <main className="app-main">
        <section className="left-pane">
          <RoomList rooms={rooms} selected={selectedRoom} onSelect={setSelectedRoom} />
        </section>

        <section className="right-pane">
          <div className="search-card">
            <div className="search-left">
              <h2>Check room availability</h2>
              <p className="muted">Select a room to highlight its weekly timetable, or view all rooms.</p>
            </div>
            <div className="search-right">
              <button className="btn primary">This Week</button>
              <button className="btn ghost">Next Week</button>
            </div>
          </div>

          <Timetable
            days={['Mon','Tue','Wed','Thu','Fri']}
            timeSlots={timeSlots}
            bookings={demoBookings}
            highlightRoom={selectedRoom?.id}
          />
        </section>
      </main>
    </div>
  )
}
