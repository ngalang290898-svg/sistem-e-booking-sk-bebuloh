import React from 'react'
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

      <div className="segmented-control" role="tablist">
        <button
          type="button"
          className={viewMode === 'today' ? 'active' : ''}
          onClick={() => onModeChange('today')}
        >
          {labels[lang].today}
        </button>
        <button
          type="button"
          className={viewMode === 'week' ? 'active' : ''}
          onClick={() => onModeChange('week')}
        >
          {labels[lang].thisWeek}
        </button>
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
        {rooms.map(room => {
          const roomAvailability = availability(room)
          return (
            <button
              key={room.id}
              className="room-card"
              onClick={() => onSelect(room)}
              type="button"
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
                {lang === 'en' ? 'Tap to view' : 'Tekan untuk lihat'}
              </div>
            </button>
          )
        })}
      </div>
    </main>
  )
}
