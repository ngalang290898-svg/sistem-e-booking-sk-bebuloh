import React, { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

import TopNav from './components/TopNav'
import RoomCards from './components/RoomCards'
import RoomFocus from './components/RoomFocus'
import BookingSheet from './components/BookingSheet'

import './styles/tokens.css'
import './styles/app.css'

export default function App() {
  const [lang, setLang] = useState('en') // 'en' | 'bm'
  const [rooms, setRooms] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)

  // Load rooms
  useEffect(() => {
    const loadRooms = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('active', true)
        .order('name_en')

      setRooms(data || [])
    }
    loadRooms()
  }, [])

  // Load weekday time slots (mobile default)
  useEffect(() => {
    const loadTimeSlots = async () => {
      const { data } = await supabase
        .from('time_slots')
        .select('*')
        .eq('day_type', 'weekday')
        .order('start_time')

      setTimeSlots(data || [])
    }
    loadTimeSlots()
  }, [])

  return (
    <div className="app">
      <TopNav lang={lang} onToggleLang={setLang} />

      {!selectedRoom && (
        <RoomCards
          lang={lang}
          rooms={rooms}
          onSelect={setSelectedRoom}
        />
      )}

      {selectedRoom && (
        <RoomFocus
          lang={lang}
          room={selectedRoom}
          timeSlots={timeSlots}
          onBack={() => setSelectedRoom(null)}
          onSelectSlot={setSelectedSlot}
        />
      )}

      {selectedSlot && (
        <BookingSheet
          lang={lang}
          room={selectedRoom}
          slot={selectedSlot}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  )
}
