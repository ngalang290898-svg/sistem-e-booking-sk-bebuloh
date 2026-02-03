import React, { useMemo, useState } from 'react'
import { formatShortDate } from '../lib/dateUtils'
import { labels } from '../lib/labels'

export default function BookingSheet({
  room,
  slot,
  date,
  onClose,
  lang,
  classOptions,
  subjectOptions,
  onConfirm
}) {
  const [teacherName, setTeacherName] = useState('')
  const [className, setClassName] = useState('')
  const [subject, setSubject] = useState('')
  const [customClass, setCustomClass] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resolvedClass = className === '__custom' ? customClass : className
  const resolvedSubject =
    subject === '__custom' ? customSubject : subject

  const canSubmit = useMemo(() => {
    return (
      teacherName.trim() &&
      resolvedClass.trim() &&
      resolvedSubject.trim()
    )
  }, [teacherName, resolvedClass, resolvedSubject])

  const handleSubmit = async event => {
    event.preventDefault()
    setNotice('')
    if (!canSubmit) {
      setNotice(labels[lang].formIncomplete)
      return
    }
    setIsSubmitting(true)
    const result = await onConfirm({
      teacherName: teacherName.trim(),
      className: resolvedClass.trim(),
      subject: resolvedSubject.trim()
    })
    setIsSubmitting(false)
    if (!result.success) {
      setNotice(result.message)
      return
    }
    setNotice(labels[lang].bookingSuccess)
  }

  return (
    <div className="sheet-backdrop" onClick={onClose}>
      <div
        className="sheet"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="sheet-header">
          <h3>{labels[lang].bookingSheetTitle}</h3>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="sheet-details">
          <div>
            <span className="meta">{labels[lang].bookingRoom}</span>
            <p>{lang === 'en' ? room.name_en : room.name_bm}</p>
          </div>
          <div>
            <span className="meta">{labels[lang].bookingDate}</span>
            <p>{formatShortDate(date, lang)}</p>
          </div>
          <div>
            <span className="meta">{labels[lang].bookingTime}</span>
            <p>
              {slot.start_time} – {slot.end_time}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="sheet-form">
          <label className="field">
            <span>{labels[lang].teacherName}</span>
            <input
              type="text"
              value={teacherName}
              onChange={event => setTeacherName(event.target.value)}
              placeholder={labels[lang].teacherName}
            />
          </label>

          <label className="field">
            <span>{labels[lang].classLabel}</span>
            <select
              value={className}
              onChange={event => setClassName(event.target.value)}
            >
              <option value="">{labels[lang].selectClass}</option>
              {classOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="__custom">{labels[lang].addNew}</option>
            </select>
            {className === '__custom' && (
              <input
                type="text"
                value={customClass}
                onChange={event => setCustomClass(event.target.value)}
                placeholder={labels[lang].enterClass}
              />
            )}
          </label>

          <label className="field">
            <span>{labels[lang].subjectLabel}</span>
            <select
              value={subject}
              onChange={event => setSubject(event.target.value)}
            >
              <option value="">{labels[lang].selectSubject}</option>
              {subjectOptions.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="__custom">{labels[lang].addNew}</option>
            </select>
            {subject === '__custom' && (
              <input
                type="text"
                value={customSubject}
                onChange={event => setCustomSubject(event.target.value)}
                placeholder={labels[lang].enterSubject}
              />
            )}
          </label>

          {notice && <p className="notice">{notice}</p>}

          <button
            className="primary"
            type="submit"
            disabled={!canSubmit || isSubmitting}
          >
            {labels[lang].confirmBooking}
          </button>
        </form>
      </div>
    </div>
  )
}
