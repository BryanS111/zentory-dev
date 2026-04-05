import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Button from '../../../components/ui/Button'

function HeroSection() {
  const navigate = useNavigate()
  const codeRef = useRef(null)

  // Animación de typing en el mock de código
  useEffect(() => {
    const lines = codeRef.current?.querySelectorAll('.code-line')
    if (!lines) return
    lines.forEach((line, i) => {
      line.style.opacity = '0'
      line.style.transform = 'translateX(-8px)'
      line.style.transition = `opacity 0.3s ease, transform 0.3s ease`
      setTimeout(() => {
        line.style.opacity = '1'
        line.style.transform = 'translateX(0)'
      }, 200 + i * 90)
    })
  }, [])

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">

      {/* Fondo con glow radial */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #1e3a5f 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full opacity-8 blur-3xl"
          style={{ background: 'radial-gradient(circle, #2a5298 0%, transparent 70%)' }}
        />
        {/* Grid sutil de fondo */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#93c5fd 1px, transparent 1px), linear-gradient(90deg, #93c5fd 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 w-full py-8 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── Columna izquierda: copy ── */}
          <div className="flex flex-col gap-6 sm:gap-8">

            {/* Badge versión */}
            <div className="inline-flex items-center gap-2 w-fit">
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: '#93c5fd', boxShadow: '0 0 8px #93c5fd' }}
              />
              <span
                className="text-[10px] tracking-[0.2em] uppercase font-mono"
                style={{ color: '#93c5fd' }}
              >
                IA activa · Zentory Dev v1.0
              </span>
            </div>

            {/* Headline */}
            <h1
              className="text-4xl sm:text-5xl xl:text-6xl font-bold leading-[1.05] tracking-tight"
              style={{ color: '#dde8f8', fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Presupuestos{' '}
              <span
                className="relative inline-block"
                style={{
                  background: 'linear-gradient(135deg, #93c5fd 0%, #1e3a5f 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                profesionales
              </span>{' '}
              para proyectos tech
            </h1>

            {/* Subtítulo */}
            <p
              className="text-base sm:text-lg leading-relaxed max-w-lg"
              style={{ color: '#94a3b8' }}
            >
              Ahorra tiempo y cierra más proyectos con propuestas estructuradas
              y asistidas por IA. Diseñado por y para desarrolladores freelance.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-3 pt-2">
              <button
                onClick={() => navigate('/auth')}
                className="group relative px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1e3a5f 0%, #2a5298 100%)',
                  color: '#fff',
                  boxShadow: '0 0 20px rgba(42,82,152,0.35)',
                }}
              >
                <span className="relative z-10">Empezar gratis →</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{ background: 'linear-gradient(135deg, #2a5298 0%, #1e3a5f 100%)' }}
                />
              </button>

              <button
                onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3.5 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 hover:bg-white/5"
                style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Ver cómo funciona
              </button>
            </div>

            {/* Stats */}
            <div
              className="flex items-center gap-8 pt-4 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.06)' }}
            >
              <div>
                <p className="text-2xl font-bold" style={{ color: '#dde8f8', fontFamily: "'Space Grotesk', sans-serif" }}>+500</p>
                <p className="text-[11px] tracking-widest uppercase font-mono mt-0.5" style={{ color: '#475569' }}>Presupuestos generados</p>
              </div>
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div>
                <p className="text-2xl font-bold" style={{ color: '#dde8f8', fontFamily: "'Space Grotesk', sans-serif" }}>9 secciones</p>
                <p className="text-[11px] tracking-widest uppercase font-mono mt-0.5" style={{ color: '#475569' }}>Generadas con IA</p>
              </div>
            </div>
          </div>

          {/* ── Columna derecha: mock de código ── */}
          <div className="relative lg:block">

            {/* Ventana de código principal */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255,255,255,0.07)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
                backdropFilter: 'blur(16px)',
              }}
            >
              {/* Barra de título */}
              <div
                className="flex items-center justify-between px-5 py-3.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,95,86,0.5)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,189,46,0.5)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(39,201,63,0.5)' }} />
                </div>
                <span className="text-[10px] font-mono" style={{ color: '#475569' }}>presupuesto_schema.json</span>
                <div className="w-12" />
              </div>

              {/* Contenido del código */}
              <div ref={codeRef} className="p-5 sm:p-6 font-mono text-sm leading-relaxed space-y-1">

                <div className="code-line flex gap-4">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>01</span>
                  <span>
                    <span style={{ color: '#64748b' }}>// </span>
                    <span style={{ color: '#475569' }}>Zentory Dev · Presupuesto generado con IA</span>
                  </span>
                </div>

                <div className="code-line flex gap-4">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>02</span>
                  <span>
                    <span style={{ color: '#93c5fd' }}>proyecto</span>
                    <span style={{ color: '#94a3b8' }}>: </span>
                    <span style={{ color: '#7dd3fc' }}>"Plataforma e-commerce"</span>
                  </span>
                </div>

                <div className="code-line flex gap-4">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>03</span>
                  <span>
                    <span style={{ color: '#93c5fd' }}>cliente</span>
                    <span style={{ color: '#94a3b8' }}>: </span>
                    <span style={{ color: '#7dd3fc' }}>"Acme Corp · USA"</span>
                  </span>
                </div>

                <div className="code-line flex gap-4">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>04</span>
                  <span style={{ color: '#475569' }}>───────────────────────────</span>
                </div>

                <div className="code-line flex gap-4">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>05</span>
                  <span>
                    <span style={{ color: '#a78bfa' }}>secciones</span>
                    <span style={{ color: '#94a3b8' }}>: [</span>
                  </span>
                </div>

                {/* Ítem con badge IA */}
                <div className="code-line flex gap-4 pl-6">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>06</span>
                  <div
                    className="flex-1 px-3 py-2 rounded-lg"
                    style={{ background: 'rgba(42,82,152,0.12)', borderLeft: '2px solid #1e3a5f' }}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="text-[9px] tracking-widest uppercase font-bold px-1.5 py-0.5 rounded"
                        style={{ background: 'rgba(147,197,253,0.15)', color: '#93c5fd' }}
                      >
                        IA generó
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span style={{ color: '#e2e8f0' }}>Descripción del Proyecto</span>
                      <span style={{ color: '#93c5fd' }}>✓</span>
                    </div>
                  </div>
                </div>

                <div className="code-line flex gap-4 pl-6">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>07</span>
                  <div className="flex-1 px-3 py-1.5 flex justify-between">
                    <span style={{ color: '#94a3b8' }}>Alcance del Trabajo</span>
                    <span style={{ color: '#93c5fd' }}>✓</span>
                  </div>
                </div>

                <div className="code-line flex gap-4 pl-6">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>08</span>
                  <div className="flex-1 px-3 py-1.5 flex justify-between">
                    <span style={{ color: '#94a3b8' }}>Cronograma · 8 semanas</span>
                    <span style={{ color: '#93c5fd' }}>✓</span>
                  </div>
                </div>

                <div className="code-line flex gap-4">
                  <span className="select-none w-4 text-right shrink-0" style={{ color: 'rgba(255,255,255,0.12)' }}>09</span>
                  <span style={{ color: '#94a3b8' }}>]</span>
                </div>

                {/* Total */}
                <div
                  className="code-line mt-3 pt-4 flex justify-between items-center"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                >
                  <span style={{ color: '#fbbf24' }}>INVERSIÓN_TOTAL</span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: '#dde8f8', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    $3,200.00 USD
                  </span>
                </div>
              </div>
            </div>

            {/* Tarjeta flotante: AI Assistant */}
            <div
              className="absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 p-4 sm:p-5 rounded-xl max-w-[220px] sm:max-w-[250px]"
              style={{
                background: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.4)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0"
                  style={{ background: 'rgba(147,197,253,0.15)', color: '#93c5fd' }}
                >
                  ✦
                </div>
                <span className="text-sm font-bold" style={{ color: '#e2e8f0', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Asistente IA
                </span>
              </div>
              <p className="text-xs leading-relaxed mb-3" style={{ color: '#64748b' }}>
                "El precio estimado para este proyecto en mercado internacional es{' '}
                <span style={{ color: '#93c5fd' }}>$3,200 USD</span> con complejidad media."
              </p>
              <div
                className="text-[9px] tracking-widest uppercase font-bold text-center py-1.5 rounded-lg cursor-default"
                style={{ background: 'rgba(147,197,253,0.08)', color: '#93c5fd', border: '1px solid rgba(147,197,253,0.15)' }}
              >
                Aplicar sugerencia
              </div>
            </div>

            {/* Badge estado flotante arriba derecha */}
            <div
              className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 px-3 py-2 rounded-xl flex items-center gap-2"
              style={{
                background: 'rgba(15,23,42,0.95)',
                border: '1px solid rgba(147,197,253,0.2)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse shrink-0"
                style={{ background: '#93c5fd', boxShadow: '0 0 6px #93c5fd' }}
              />
              <span className="text-[11px] font-mono" style={{ color: '#93c5fd' }}>PDF listo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection