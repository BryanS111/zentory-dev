import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useQuotes } from '../../features/quotes/useQuotes'
import Button from '../../components/ui/Button'

function QuotesPage() {
  const navigate = useNavigate()
  const { quotes, loading, deleteQuote } = useQuotes()
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = quotes.filter(q => {
    const term = search.toLowerCase()
    return (
      q.projectName?.toLowerCase().includes(term) ||
      q.clientName?.toLowerCase().includes(term) ||
      q.clientCompany?.toLowerCase().includes(term) ||
      q.id?.slice(0, 8).toUpperCase().includes(search.toUpperCase())
    )
  })

  const handleDelete = async (quoteId) => {
    setDeleting(true)
    await deleteQuote(quoteId)
    setConfirmDelete(null)
    setDeleting(false)
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Mis presupuestos</h1>
            <p className="text-gray-400 text-sm mt-1">
              {quotes.length} presupuesto{quotes.length !== 1 ? 's' : ''} en total
            </p>
          </div>
          <Button onClick={() => navigate('/templates')}>
            + Nuevo presupuesto
          </Button>
        </div>

        {/* Buscador */}
        <div className="relative mb-6">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre, cliente o código de referencia..."
            className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">Cargando presupuestos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 border-dashed rounded-xl p-16 text-center">
            <svg className="mx-auto mb-3 text-gray-700" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
            </svg>
            <p className="text-gray-500 text-sm">
              {search ? `Sin resultados para "${search}"` : 'Aún no tienes presupuestos'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(quote => (
              <div
                key={quote.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4 hover:border-gray-600 transition-colors"
              >
                {/* Icono */}
                <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-brand-400">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
                  </svg>
                </div>

                {/* Info */}
                <div
                  className="flex-1 min-w-0 cursor-pointer"
                  onClick={() => navigate(`/quote/${quote.id}`)}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white font-semibold text-sm truncate">{quote.projectName || 'Sin nombre'}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${
                      quote.status === 'generated'
                        ? 'bg-brand-600/20 text-brand-400 border-brand-600/30'
                        : 'bg-gray-800 text-gray-500 border-gray-700'
                    }`}>
                      {quote.status === 'generated' ? 'Generado' : 'Borrador'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs truncate">
                    {quote.clientName} {quote.clientCompany && `— ${quote.clientCompany}`}
                  </p>
                  <p className="text-gray-600 text-xs mt-0.5">
                    Ref: {quote.id?.slice(0, 8).toUpperCase()} · {new Date(quote.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Precio */}
                <div className="text-right shrink-0">
                  <p className="text-white text-sm font-semibold">
                    {quote.currency} {quote.fixedPrice
                      ? parseFloat(quote.fixedPrice).toLocaleString()
                      : (parseFloat(quote.hourlyRate || 0) * parseFloat(quote.estimatedHours || 0)).toLocaleString()
                    }
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">{quote.templateTitle}</p>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/quote/${quote.id}`)}
                    className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
                    title="Ver presupuesto"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setConfirmDelete(quote.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-gray-800"
                    title="Eliminar"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/>
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal confirmación eliminar */}
        {confirmDelete && (
          <div
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
              zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={(e) => e.target === e.currentTarget && setConfirmDelete(null)}
          >
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm p-6">
              <h3 className="text-white font-semibold mb-2">Eliminar presupuesto</h3>
              <p className="text-gray-400 text-sm mb-6">
                Esta acción no se puede deshacer. ¿Estás seguro que quieres eliminar este presupuesto?
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                  Cancelar
                </Button>
                <button
                  onClick={() => handleDelete(confirmDelete)}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {deleting ? 'Eliminando...' : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  )
}

export default QuotesPage