import { useState } from 'react'

const sizes = {
  sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
  md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
  lg: { padding: '0.875rem 2rem', fontSize: '1.125rem' },
}

const variants = {
  primary: {
    background: '#1e3a5f',
    color: '#ffffff',
    border: '1px solid #2a5298',
  },
  ghost: {
    background: 'transparent',
    color: '#9ca3af',
    border: '1px solid transparent',
  },
  outline: {
    background: 'transparent',
    color: '#93c5fd',
    border: '1px solid #2a5298',
  },
}

const variantsHover = {
  primary: { background: '#1a3254' },
  ghost: { background: 'transparent' },
  outline: { background: 'rgba(42, 82, 152, 0.1)' },
}

function Button({ children, onClick, variant = 'primary', size = 'md', className = '' }) {
  const [activeIndex, setActiveIndex] = useState(-1)
  const [isHovered, setIsHovered] = useState(false)
  const timersRef = []

  const letters = typeof children === 'string' ? children.split('') : null

  const baseStyle = {
    ...variants[variant],
    ...sizes[size],
    ...(isHovered ? variantsHover[variant] : {}),
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    userSelect: 'none',
    transition: 'background 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
  }

  const getLetterStyle = (i) => ({
    display: 'inline-block',
    transition: 'color 0.15s ease, transform 0.15s ease',
    color: isHovered && i <= activeIndex ? '#93c5fd' : 'inherit',
    transform: isHovered && i <= activeIndex ? 'translateY(-2px)' : 'translateY(0)',
  })

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!letters) return
    letters.forEach((_, i) => {
      const t = setTimeout(() => setActiveIndex(i), i * 45)
      timersRef.push(t)
    })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setActiveIndex(-1)
    timersRef.forEach(clearTimeout)
  }

  return (
    <button
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      {letters ? (
        <span style={{ display: 'inline-flex', gap: 0 }} aria-label={children}>
          {letters.map((char, i) => (
            <span key={i} style={getLetterStyle(i)}>
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </span>
      ) : children}
    </button>
  )
}

export default Button