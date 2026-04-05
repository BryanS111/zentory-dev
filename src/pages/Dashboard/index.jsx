import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../features/auth/AuthContext'
import { useProfile } from '../../features/profile/useProfile'
import { useQuotes } from '../../features/quotes/useQuotes'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const { quotes, loading } = useQuotes()
  const navigate = useNavigate()

  const firstName = profile?.name?.split(' ')[0] || user?.displayName?.split(' ')[0] || 'Freelancer'
  const recentQuotes = quotes.slice(0, 3)

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Hola, {firstName}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-brand-400">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
              <line x1="9" y1="9" x2="9.01" y2="9"/>
              <line x1="15" y1="9" x2="15.01" y2="9"/>
            </svg>
          </h1>
          <p className="text-gray-400 text-sm mt-1">Bienvenido a tu panel de presupuestos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Presupuestos creados', value: quotes.length },
            { label: 'Este mes', value: quotes.filter(q => new Date(q.createdAt).getMonth() === new Date().getMonth()).length },
            { label: 'Generados con IA', value: quotes.filter(q => q.status === 'generated').length },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <p className="text-gray-500 text-xs mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-gray-900 border border-brand-600/20 rounded-xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-white font-semibold mb-1">Crear nuevo presupuesto</h2>
            <p className="text-gray-400 text-sm">Elige una plantilla y genera un presupuesto profesional en minutos.</p>
          </div>
          <button
            onClick={() => navigate('/templates')}
            className="text-white text-sm font-semibold whitespace-nowrap"
            onMouseEnter={e => {
              const spans = e.currentTarget.querySelectorAll('span')
              spans.forEach((s, i) => setTimeout(() => {
                s.style.color = '#93c5fd'
                s.style.transform = 'translateY(-2px)'
                setTimeout(() => {
                  s.style.color = ''
                  s.style.transform = ''
                }, 300)
              }, i * 40))
            }}
          >
            {Array.from('+ Nuevo presupuesto').map((char, i) => (
              <span key={i} style={{ display: 'inline-block', transition: 'color 0.15s ease, transform 0.15s ease' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </button>
        </div>

        {/* Presupuestos recientes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Presupuestos recientes</h2>
            {quotes.length > 3 && (
              <button
                onClick={() => navigate('/quotes')}
                className="text-brand-400 text-sm transition-colors"
                onMouseEnter={e => {
                  const spans = e.currentTarget.querySelectorAll('span')
                  spans.forEach((s, i) => setTimeout(() => {
                    s.style.color = '#93c5fd'
                    s.style.transform = 'translateY(-2px)'
                    setTimeout(() => {
                      s.style.color = ''
                      s.style.transform = ''
                    }, 300)
                  }, i * 40))
                }}
              >
                {Array.from('Ver todos →').map((char, i) => (
                  <span key={i} style={{ display: 'inline-block', transition: 'color 0.15s ease, transform 0.15s ease' }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </button>
            )}
          </div>

          {loading ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
              <p className="text-gray-500 text-sm">Cargando...</p>
            </div>
          ) : recentQuotes.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-12 text-center">
              <svg className="mx-auto mb-3 text-gray-700" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
              </svg>
              <p className="text-gray-500 text-sm">Aún no tienes presupuestos</p>
              <p className="text-gray-700 text-xs mt-1">Crea uno nuevo para empezar</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {recentQuotes.map(quote => (
                <div
                  key={quote.id}
                  onClick={() => navigate(`/quote/${quote.id}`)}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-gray-600 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white font-semibold text-sm truncate">{quote.projectName || 'Sin nombre'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                        quote.status === 'generated'
                          ? 'bg-brand-600/20 text-brand-400 border-brand-600/30'
                          : 'bg-gray-800 text-gray-500 border-gray-700'
                      }`}>
                        {quote.status === 'generated' ? 'Generado' : 'Borrador'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {quote.clientName} {quote.clientCompany && `— ${quote.clientCompany}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-white text-sm font-semibold">
                      {quote.currency} {quote.fixedPrice
                        ? parseFloat(quote.fixedPrice).toLocaleString()
                        : (parseFloat(quote.hourlyRate || 0) * parseFloat(quote.estimatedHours || 0)).toLocaleString()
                      }
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {new Date(quote.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <svg className="text-gray-600 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default DashboardPage