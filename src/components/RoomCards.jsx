import React from 'react'
import { motion } from 'framer-motion'
import { labels } from '../lib/labels'

export default function RoomCards({
  rooms,
  onSelect,
  lang,
  viewMode,
  onModeChange,
  availability,
  isLoading,
  error
}) {
  return (
    <main className="room-cards">
      <div className="page-header">
        <h1>{labels[lang].availabilityTitle}</h1>
        <p className="subtitle">{labels[lang].availabilitySubtitle}</p>
      </div>

      <div className="segmented-control" role="tablist" aria-label="Range">
        <motion.button
          type="button"
          className={viewMode === 'today' ? 'active' : ''}
          onClick={() => onModeChange('today')}
          whileTap={{ scale: 0.97 }}
        >
          {labels[lang].today}
        </motion.button>
        <motion.button
          type="button"
          className={viewMode === 'week' ? 'active' : ''}
          onClick={() => onModeChange('week')}
          whileTap={{ scale: 0.97 }}
        >
          {labels[lang].thisWeek}
        </motion.button>
      </div>

      {isLoading && (
        <div className="state-card">
          <span className="state-title">
            {labels[lang].loadingAvailability}
          </span>
          <span className="state-meta">
            {labels[lang].syncingSchedule}
          </span>
        </div>
      )}

      {!isLoading && error && (
        <div className="state-card state-card--error">
          <span className="state-title">{labels[lang].unableLoad}</span>
          <span className="state-meta">{error}</span>
        </div>
      )}

      {!isLoading && !error && rooms.length === 0 && (
        <div className="state-card">
          <span className="state-title">{labels[lang].noRoomsTitle}</span>
          <span className="state-meta">{labels[lang].noRoomsMeta}</span>
        </div>
      )}

      <div className="card-stack">
        {rooms.map((room, index) => {
          const roomAvailability = availability(room)
          return (
            <motion.button
              key={room.id}
              className="room-card"
              onClick={() => onSelect(room)}
              type="button"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="room-card__top">
                <div className="room-icon">{room.icon || '🏫'}</div>
                <div className="room-title">
                  {lang === 'en' ? room.name_en : room.name_bm}
                </div>
              </div>
              <div className="room-card__meta">
                <span className="room-status">
                  {roomAvailability?.label ?? labels[lang].noSlots}
                </span>
                <span className="room-meta">
                  {roomAvailability?.meta ?? labels[lang].noSlots}
                </span>
              </div>
              <div className="room-card__action">
                {labels[lang].tapToView}
              </div>
              <div className="room-card__glow" aria-hidden="true" />
            </motion.button>
          )
        })}
      </div>
    </main>
  )
}
