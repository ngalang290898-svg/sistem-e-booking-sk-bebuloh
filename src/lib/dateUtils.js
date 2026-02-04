export const toDateKey = date => {
  const value = new Date(date)
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, '0')
  const day = String(value.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const parseDateKey = dateValue => {
  if (!dateValue) return null
  if (dateValue instanceof Date) return dateValue
  const [year, month, day] = dateValue.split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

export const startOfDay = date => {
  const value = new Date(date)
  value.setHours(0, 0, 0, 0)
  return value
}

export const addDays = (date, days) => {
  const value = new Date(date)
  value.setDate(value.getDate() + days)
  return value
}

export const addMinutes = (date, minutes) => {
  const value = new Date(date)
  value.setMinutes(value.getMinutes() + minutes)
  return value
}

export const isSameDay = (a, b) =>
  toDateKey(a) === toDateKey(b)

export const getNextWorkingDate = (fromDate = new Date()) => {
  let date = startOfDay(fromDate)
  while (date.getDay() === 0 || date.getDay() === 6) {
    date = addDays(date, 1)
  }
  return date
}

export const getWeekDates = referenceDate => {
  const anchor = startOfDay(referenceDate)
  const day = anchor.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = addDays(anchor, mondayOffset)
  return Array.from({ length: 5 }, (_, index) => addDays(monday, index))
}

export const isWithinBookingWindow = date => {
  const today = startOfDay(new Date())
  const target = startOfDay(date)
  const diffMs = target.getTime() - today.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  const isWeekend = target.getDay() === 0 || target.getDay() === 6
  return diffDays >= 0 && diffDays <= 7 && !isWeekend
}

export const combineDateAndTime = (date, timeValue) => {
  const [hours, minutes] = timeValue.split(':').map(Number)
  const value = new Date(date)
  value.setHours(hours || 0, minutes || 0, 0, 0)
  return value
}

export const formatShortDate = (date, lang) =>
  new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-GB', {
    day: '2-digit',
    month: 'short'
  }).format(date)

export const formatLongDate = (date, lang) =>
  new Intl.DateTimeFormat(lang === 'bm' ? 'ms-MY' : 'en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'long'
  }).format(date)
