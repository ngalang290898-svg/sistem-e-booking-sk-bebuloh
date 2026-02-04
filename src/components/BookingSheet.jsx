import React, { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { formatShortDate } from '../lib/dateUtils'
import { labels } from '../lib/labels'
import Dropdown from './Dropdown'

export default function BookingSheet({
  room,
  slot,
  date,
  onClose,
  lang,
  teachers,
  classes,
  subjectOptions,
  onConfirm
}) {
  const [teacherId, setTeacherId] = useState('')
  const [classId, setClassId] = useState('')
  const [subject, setSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  const [notice, setNotice] = useState('')
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resolvedSubject = subject === '__custom' ? customSubject : subject

  const canSubmit = useMemo(() => {
    return (
      teacherId &&
      classId &&
      resolvedSubject.trim()
    )
  }, [teacherId, classId, resolvedSubject])

  const teacherOptions = useMemo(
    () =>
      teachers.map(teacher => ({
        id: teacher.id,
        label: teacher.name
      })),
    [teachers]
  )

  const classSelectOptions = useMemo(
    () =>
      classes.map(classItem => ({
        id: classItem.id,
        label:
          lang === 'en' ? classItem.name_en : classItem.name_bm,
        meta:
          classItem.tahap === 1
            ? labels[lang].classTahapOne
            : labels[lang].classTahapTwo
      })),
    [classes, lang]
  )

  const subjectSelectOptions = useMemo(() => {
    const unique = subjectOptions
      .map(option => option.trim())
      .filter(Boolean)
    return [
      ...unique.map(option => ({ id: option, label: option })),
      { id: '__custom', label: labels[lang].addSubject }
    ]
  }, [subjectOptions, lang])

  const handleSubmit = async event => {
    event.preventDefault()
    setNotice('')
    setSuccess(false)
    if (!canSubmit) {
      setNotice(labels[lang].formIncomplete)
      return
    }
    setIsSubmitting(true)
    const result = await onConfirm({
      teacherId,
      classId,
      subject: resolvedSubject.trim()
    })
    setIsSubmitting(false)
    if (!result.success) {
      setNotice(result.message)
      return
    }
    setSuccess(true)
    setNotice(labels[lang].bookingSuccess)
  }

  return (
    <motion.div
      className="sheet-backdrop"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="sheet"
        onClick={event => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        initial={{ y: 120, opacity: 0, scale: 0.98 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 120, opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        <div className="sheet-header">
          <h3>{labels[lang].bookingSheetTitle}</h3>
          <motion.button
            type="button"
            className="icon-button"
            onClick={onClose}
            whileTap={{ scale: 0.9 }}
          >
            ✕
          </motion.button>
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
          <Dropdown
            label={labels[lang].teacherName}
            placeholder={labels[lang].selectTeacher}
            options={teacherOptions}
            value={teacherId}
            onChange={setTeacherId}
            disabled={teacherOptions.length === 0}
            description={
              teacherOptions.length === 0
                ? labels[lang].teacherEmpty
                : labels[lang].teachersTitle
            }
          />

          <Dropdown
            label={labels[lang].classLabel}
            placeholder={labels[lang].selectClass}
            options={classSelectOptions}
            value={classId}
            onChange={setClassId}
            disabled={classSelectOptions.length === 0}
            description={
              classSelectOptions.length === 0
                ? labels[lang].classEmpty
                : labels[lang].classesTitle
            }
          />

          <Dropdown
            label={labels[lang].subjectLabel}
            placeholder={labels[lang].selectSubject}
            options={subjectSelectOptions}
            value={subject}
            onChange={setSubject}
            disabled={false}
            description={
              subjectOptions.length === 0
                ? labels[lang].subjectEmpty
                : labels[lang].subjectsTitle
            }
          />

          {subject === '__custom' && (
            <label className="field">
              <span>{labels[lang].subjectLabel}</span>
              <input
                type="text"
                value={customSubject}
                onChange={event => setCustomSubject(event.target.value)}
                placeholder={labels[lang].enterSubject}
              />
            </label>
          )}

          {notice && <p className="notice">{notice}</p>}

          <motion.button
            className="primary"
            type="submit"
            disabled={!canSubmit || isSubmitting}
            whileTap={{ scale: 0.97 }}
          >
            {labels[lang].bookingCTA}
          </motion.button>

          {!canSubmit && (
            <p className="helper">{labels[lang].bookingDisabled}</p>
          )}
        </form>

        <AnimatePresence>
          {success && (
            <motion.div
              className="success-toast"
              initial={{ opacity: 0, scale: 0.94, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 6 }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              <div>
                <p className="success-title">
                  {labels[lang].bookingSuccessTitle}
                </p>
                <p className="success-meta">
                  {labels[lang].bookingSuccessMeta}
                </p>
              </div>
              <span className="success-burst" aria-hidden="true">
                ✨
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
