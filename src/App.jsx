import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './lib/supabase'
import {
  addMinutes,
  combineDateAndTime,
  formatShortDate,
  getNextWorkingDate,
  getWeekDates,
  isSameDay,
  isWithinBookingWindow,
  toISODate
} from './lib/dateUtils'
import { labels } from './lib/labels'

import TopNav from './components/TopNav'
import RoomCards from './components/RoomCards'
import RoomFocus from './components/RoomFocus'
import BookingSheet from './components/BookingSheet'
import AdminPanel from './components/AdminPanel'

export default function App() {
  const [lang, setLang] = useState('en')
  const [viewMode, setViewMode] = useState('today')
  const [rooms, setRooms] = useState([])
  const [teachers, setTeachers] = useState([])
  const [classes, setClasses] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [bookings, setBookings] = useState([])
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedDate, setSelectedDate] = useState(getNextWorkingDate())
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [loading, setLoading] = useState({
    rooms: true,
    slots: true,
    bookings: true
  })
  const [error, setError] = useState('')
  const [adminSession, setAdminSession] = useState(null)

  const baseDate = useMemo(() => getNextWorkingDate(), [])
  const weekDates = useMemo(() => getWeekDates(baseDate), [baseDate])
  const weekRange = useMemo(() => {
    const start = weekDates[0]
    const end = weekDates[weekDates.length - 1]
    return { start, end }
  }, [weekDates])

  useEffect(() => {
    setSelectedDate(prev => {
      if (viewMode === 'today') {
        return baseDate
      }
      if (weekDates.some(date => isSameDay(date, prev))) {
        return prev
      }
      return baseDate
    })
  }, [viewMode, baseDate, weekDates])

  useEffect(() => {
    let isMounted = true
    const loadRooms = async () => {
      setLoading(prev => ({ ...prev, rooms: true }))
      const { data, error: roomsError } = await supabase
        .from('rooms')
        .select('id, name_en, name_bm, icon, active')
        .eq('active', true)
        .order('name_en')
      if (!isMounted) return
      if (roomsError) {
        setError(roomsError.message)
      }
      setRooms(data || [])
      setLoading(prev => ({ ...prev, rooms: false }))
    }
    loadRooms()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadTimeSlots = async () => {
      setLoading(prev => ({ ...prev, slots: true }))
      const { data, error: slotsError } = await supabase
        .from('time_slots')
        .select('*')
        .in('day_type', ['weekday', 'friday'])
        .order('start_time')
      if (!isMounted) return
      if (slotsError) {
        setError(slotsError.message)
      }
      setTimeSlots(data || [])
      setLoading(prev => ({ ...prev, slots: false }))
    }
    loadTimeSlots()
    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const loadBookings = async () => {
      setLoading(prev => ({ ...prev, bookings: true }))
      const { data, error: bookingsError } = await supabase
        .from('bookings')
        .select(
          'id, room_id, date, time_slot_id, teacher_name, class_name, subject'
        )
        .gte('date', toISODate(weekRange.start))
        .lte('date', toISODate(weekRange.end))
      if (!isMounted) return
      if (bookingsError) {
        setError(bookingsError.message)
      }
      setBookings(data || [])
      setLoading(prev => ({ ...prev, bookings: false }))
    }
    loadBookings()
    return () => {
      isMounted = false
    }
  }, [weekRange])

  useEffect(() => {
    let isMounted = true
    const hydrateSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!isMounted) return
      setAdminSession(data.session)
    }
    hydrateSession()
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAdminSession(session)
      }
    )
    return () => {
      isMounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const daySlots = useMemo(() => {
    const isFriday = selectedDate.getDay() === 5
    return timeSlots.filter(slot =>
      isFriday ? slot.day_type === 'friday' : slot.day_type === 'weekday'
    )
  }, [selectedDate, timeSlots])

  const classOptions = useMemo(() => {
    const unique = new Set(
      bookings.map(booking => booking.class_name).filter(Boolean)
    )
    return Array.from(unique).sort()
  }, [bookings])

  const subjectOptions = useMemo(() => {
    const unique = new Set(
      bookings.map(booking => booking.subject).filter(Boolean)
    )
    return Array.from(unique).sort()
  }, [bookings])

  const isAdmin =
    adminSession?.user?.email?.toLowerCase().endsWith('@delima.edu.my') ?? false

  const bookingMapByDate = useMemo(() => {
    const map = new Map()
    bookings.forEach(booking => {
      if (!map.has(booking.date)) {
        map.set(booking.date, new Map())
      }
      map
        .get(booking.date)
        .set(`${booking.room_id}-${booking.time_slot_id}`, booking)
    })
    return map
  }, [bookings])

  const canSelectDate = date => {
    if (!isWithinBookingWindow(date)) return false
    if (viewMode === 'today') {
      return isSameDay(date, baseDate)
    }
    return true
  }

  const getBookingMap = date => {
    const dateKey = toISODate(date)
    return bookingMapByDate.get(dateKey) || new Map()
  }

  const getSlotState = (slot, date, roomId) => {
    const bookingMap = getBookingMap(date)
    const bookingKey = `${roomId}-${slot.id}`
    const isBooked = bookingMap.has(bookingKey)
    const slotDateTime = combineDateAndTime(date, slot.start_time)
    const closingTime = addMinutes(slotDateTime, -10)
    const isClosed =
      isSameDay(date, new Date()) &&
      new Date().getTime() >= closingTime.getTime()
    const isRecess = slot.is_recess
    const isDateValid = isWithinBookingWindow(date)
    const isAvailable = !isBooked && !isClosed && !isRecess && isDateValid
    return {
      isAvailable,
      isBooked,
      isClosed,
      isRecess
    }
  }

  const getRoomAvailability = room => {
    const allDays = weekDates.filter(canSelectDate)
    const availableSlots = []
    allDays.forEach(date => {
      const daySlotsList = timeSlots.filter(slot =>
        date.getDay() === 5
          ? slot.day_type === 'friday'
          : slot.day_type === 'weekday'
      )
      daySlotsList.forEach(slot => {
        const state = getSlotState(slot, date, room.id)
        if (state.isAvailable) {
          availableSlots.push({ slot, date })
        }
      })
    })
    availableSlots.sort((a, b) => {
      const timeA = combineDateAndTime(a.date, a.slot.start_time).getTime()
      const timeB = combineDateAndTime(b.date, b.slot.start_time).getTime()
      return timeA - timeB
    })
    if (!availableSlots.length) {
      return {
        status: 'full',
        label:
          viewMode === 'today'
            ? labels[lang].fullyBookedToday
            : labels[lang].fullyBookedWeek,
        meta: labels[lang].noSlots
      }
    }
    const nextAvailable = availableSlots[0]
    return {
      status: 'available',
      label: labels[lang].nextAvailable,
      meta: `${formatShortDate(nextAvailable.date, lang)} · ${
        nextAvailable.slot.start_time
      }`
    }
  }

  const handleSelectRoom = room => {
    setSelectedRoom(room)
    setSelectedSlot(null)
    setSelectedDate(baseDate)
  }

  const handleConfirmBooking = async payload => {
    setError('')
    if (!canSelectDate(selectedDate)) {
      return { success: false, message: labels[lang].disabled }
    }
    const slotState = getSlotState(selectedSlot, selectedDate, selectedRoom.id)
    if (!slotState.isAvailable) {
      return { success: false, message: labels[lang].disabled }
    }
    const dateKey = toISODate(selectedDate)
    const existingLocal = bookings.some(
      booking =>
        booking.room_id === selectedRoom.id &&
        booking.date === dateKey &&
        booking.time_slot_id === selectedSlot.id
    )
    if (existingLocal) {
      return { success: false, message: labels[lang].alreadyBooked }
    }
    const { data: existingRemote } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', selectedRoom.id)
      .eq('date', dateKey)
      .eq('time_slot_id', selectedSlot.id)
      .limit(1)
    if (existingRemote && existingRemote.length > 0) {
      return { success: false, message: labels[lang].alreadyBooked }
    }
    const { error: insertError, data } = await supabase
      .from('bookings')
      .insert({
        room_id: selectedRoom.id,
        date: dateKey,
        time_slot_id: selectedSlot.id,
        teacher_name: payload.teacherName,
        class_name: payload.className,
        subject: payload.subject
      })
      .select(
        'id, room_id, date, time_slot_id, teacher_name, class_name, subject'
      )
    if (insertError) {
      return { success: false, message: insertError.message }
    }
    setBookings(prev => [...prev, ...(data || [])])
    setSelectedSlot(null)
    return { success: true }
  }

  return (
    <div className="app">
      <TopNav
        lang={lang}
        onToggleLang={setLang}
        onAdminLogin={() =>
          supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
              redirectTo: window.location.origin
            }
          })
        }
      />

      {!selectedRoom && (
        <RoomCards
          lang={lang}
          rooms={rooms}
          availability={room =>
            timeSlots.length ? getRoomAvailability(room) : null
          }
          viewMode={viewMode}
          onModeChange={setViewMode}
          onSelect={handleSelectRoom}
          isLoading={loading.rooms || loading.slots || loading.bookings}
          error={error}
        />
      )}

      {selectedRoom && (
        <RoomFocus
          lang={lang}
          room={selectedRoom}
          days={weekDates}
          selectedDate={selectedDate}
          onSelectDate={date => {
            if (canSelectDate(date)) {
              setSelectedDate(date)
            }
          }}
          isDateDisabled={date => !canSelectDate(date)}
          timeSlots={daySlots}
          bookings={bookings}
          onBack={() => setSelectedRoom(null)}
          onSelectSlot={setSelectedSlot}
          getSlotState={getSlotState}
        />
      )}

      {selectedSlot && (
        <BookingSheet
          lang={lang}
          room={selectedRoom}
          slot={selectedSlot}
          date={selectedDate}
          classOptions={classOptions}
          subjectOptions={subjectOptions}
          onClose={() => setSelectedSlot(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      {isAdmin && (
        <AdminPanel
          lang={lang}
          bookings={bookings}
          rooms={rooms}
          timeSlots={timeSlots}
          weekRange={weekRange}
          onSignOut={() => supabase.auth.signOut()}
        />
      )}
    </div>
  )
}
