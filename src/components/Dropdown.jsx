import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
  disabled,
  description
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const handleClick = event => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false)
      }
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [open])

  const activeOption = useMemo(
    () => options.find(option => option.id === value),
    [options, value]
  )

  const handleSelect = option => {
    onChange(option.id)
    setOpen(false)
  }

  return (
    <div className="dropdown" ref={containerRef}>
      <button
        type="button"
        className={`dropdown-trigger ${open ? 'is-open' : ''}`}
        onClick={() => setOpen(prev => !prev)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <div className="dropdown-copy">
          <span className="dropdown-label">{label}</span>
          <span className={`dropdown-value ${activeOption ? '' : 'is-empty'}`}>
            {activeOption ? activeOption.label : placeholder}
          </span>
          {description && <span className="dropdown-meta">{description}</span>}
        </div>
        <span className={`dropdown-chevron ${open ? 'is-open' : ''}`}>
          ▾
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="dropdown-panel"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            <div className="dropdown-options" role="listbox">
              {options.length === 0 && (
                <div className="dropdown-empty">{placeholder}</div>
              )}
              {options.map(option => (
                <motion.button
                  key={option.id}
                  type="button"
                  className={`dropdown-option ${
                    option.id === value ? 'is-active' : ''
                  }`}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleSelect(option)}
                  role="option"
                  aria-selected={option.id === value}
                >
                  <span className="option-label">{option.label}</span>
                  {option.meta && (
                    <span className="option-meta">{option.meta}</span>
                  )}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
