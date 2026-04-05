import { useEffect, useState } from 'react'
import logotipo from '../../assets/logotipo_zentorydev.webp'

function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const duration = 2200
    const interval = 16
    const steps = duration / interval
    let current = 0

    const timer = setInterval(() => {
      current++
      const ease = Math.min(100, Math.round((1 - Math.pow(1 - current / steps, 3)) * 100))
      setProgress(ease)
      if (current >= steps) {
        clearInterval(timer)
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onFinish, 500)
        }, 300)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      {/* Logo con animación de entrada */}
      <div
        style={{
          opacity: progress > 5 ? 1 : 0,
          transform: progress > 5 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.6s ease, transform 0.6s ease',
          marginBottom: '48px',
          width: '100%',
          maxWidth: '320px',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        <img
          src={logotipo}
          alt="Zentory Dev"
          style={{ width: '100%', maxWidth: '280px' }}
        />
      </div>

      {/* Barra de progreso */}
      <div
        style={{
          width: '200px',
          height: '3px',
          background: '#e2e8f0',
          borderRadius: '999px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #1e3a5f, #2a5298, #34D399)',
            borderRadius: '999px',
            transition: 'width 0.05s linear',
          }}
        />
      </div>

      {/* Porcentaje sutil */}
      <p
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: '#94a3b8',
          fontFamily: 'system-ui, sans-serif',
          letterSpacing: '0.05em',
          opacity: progress > 10 ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {progress}%
      </p>
    </div>
  )
}

export default SplashScreen