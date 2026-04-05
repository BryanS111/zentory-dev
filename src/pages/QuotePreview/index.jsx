import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useQuote } from '../../features/quotes/useQuote'
import { generatePDF } from '../../features/documents/generatePDF'
import { generateQuoteDocument } from '../../features/ai/quoteAI'
import { useState } from 'react'
import Button from '../../components/ui/Button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useAuth } from '../../features/auth/AuthContext'
import { parseSections } from '../../features/documents/repairContent'

function QuotePreviewPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { quote, loading } = useQuote(id)
  const [downloading, setDownloading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [editedContent, setEditedContent] = useState(null)
  const [savingEdit, setSavingEdit] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [confirmRegenerate, setConfirmRegenerate] = useState(false)

  const handleDownloadPDF = async () => {
    setDownloading(true)
    try { await generatePDF(quote) }
    catch (err) { console.error(err); alert('Error al generar el PDF.') }
    finally { setDownloading(false) }
  }

  const handleSaveEdit = async () => {
    setSavingEdit(true)
    try {
      const ref = doc(db, 'users', user.uid, 'quotes', id)
      await updateDoc(ref, { generatedContent: editedContent || quote.generatedContent, updatedAt: new Date().toISOString() })
      setEditingSection(null)
      setEditMode(false)
      window.location.reload()
    } catch (err) { console.error(err); alert('Error al guardar los cambios.') }
    finally { setSavingEdit(false) }
  }

  const handleGenerateWithAI = async () => {
    setGenerating(true)
    setConfirmRegenerate(false)
    try {
      const content = await generateQuoteDocument({ form: quote, profile: quote.freelancerProfile, user })
      const ref = doc(db, 'users', user.uid, 'quotes', id)
      await updateDoc(ref, { generatedContent: content, status: 'generated', updatedAt: new Date().toISOString() })
      window.location.reload()
    } catch (err) { console.error(err); alert('Error al generar con IA. Verifica tu API key.') }
    finally { setGenerating(false) }
  }

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><p className="text-gray-400">Cargando presupuesto...</p></div></DashboardLayout>
  if (!quote) return <DashboardLayout><div className="flex items-center justify-center h-64"><p className="text-gray-400">Presupuesto no encontrado.</p></div></DashboardLayout>

  const rawContent = editedContent || quote.generatedContent || ''
  const sections = parseSections(rawContent)
  const isGenerated = quote.status === 'generated' || !!quote.generatedContent

  const markdownComponents = {
    h2: ({children}) => <h2 className="text-brand-400 text-xs font-semibold tracking-widest uppercase mt-8 mb-3 pb-2 border-b border-gray-800">{children}</h2>,
    h3: ({children}) => <h3 className="text-white font-semibold mt-4 mb-2">{children}</h3>,
    p: ({children}) => <p className="text-gray-300 text-sm leading-relaxed mb-3">{children}</p>,
    strong: ({children}) => <strong className="text-white font-semibold">{children}</strong>,
    ul: ({children}) => <ul className="text-gray-300 text-sm space-y-1 mb-3 ml-4 list-disc">{children}</ul>,
    ol: ({children}) => <ol className="text-gray-300 text-sm space-y-1 mb-3 ml-4 list-decimal">{children}</ol>,
    li: ({children}) => <li className="leading-relaxed">{children}</li>,
    hr: () => <hr className="border-gray-800 my-4" />,
    table: ({children}) => <div className="overflow-x-auto mb-4"><table className="w-full text-sm border-collapse">{children}</table></div>,
    thead: ({children}) => <thead className="bg-gray-800">{children}</thead>,
    th: ({children}) => <th className="text-white font-semibold px-4 py-2 text-left border border-gray-700">{children}</th>,
    td: ({children}) => <td className="text-gray-300 px-4 py-2 border border-gray-700">{children}</td>,
    tr: ({children}) => <tr className="border-b border-gray-800">{children}</tr>,
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <button onClick={() => navigate('/quotes')} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 mb-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Volver a mis presupuestos
            </button>
            <h1 className="text-2xl font-bold text-white">{quote.projectName}</h1>
            <p className="text-gray-400 text-sm mt-1">{quote.clientName} {quote.clientCompany && `— ${quote.clientCompany}`}</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button variant="outline" onClick={() => setEditMode(!editMode)}>{editMode ? 'Salir de edición' : 'Editar secciones'}</Button>
            {!isGenerated && <Button variant="outline" onClick={handleGenerateWithAI} disabled={generating}>{generating ? 'Generando...' : '✦ Generar con IA'}</Button>}
            {isGenerated && <Button variant="outline" onClick={() => setConfirmRegenerate(true)} disabled={generating}>{generating ? 'Generando...' : '↺ Volver a generar'}</Button>}
            <Button onClick={handleDownloadPDF} disabled={downloading}>{downloading ? 'Generando PDF...' : '↓ Descargar PDF'}</Button>
          </div>
        </div>

        {/* Aviso borrador */}
        {!isGenerated && !editMode && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Este presupuesto es un borrador — aún no ha sido procesado por la IA.
            </div>
            <button onClick={handleGenerateWithAI} disabled={generating} className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 px-3 py-1 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap disabled:opacity-50">
              {generating ? 'Generando...' : '✦ Generar ahora'}
            </button>
          </div>
        )}

        {/* Aviso edición */}
        {editMode && (
          <div className="bg-brand-600/10 border border-brand-600/30 text-brand-400 text-xs rounded-lg px-4 py-3 mb-6 flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Modo edición activo — pasa el mouse sobre cualquier sección y haz clic en "Editar" para modificarla.
          </div>
        )}

        {/* Info cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: 'Cliente', value: quote.clientName },
            { label: 'Precio', value: `${quote.currency} ${quote.fixedPrice || (parseFloat(quote.hourlyRate || 0) * parseFloat(quote.estimatedHours || 0)).toLocaleString()}` },
            { label: 'Duración', value: `${quote.phases?.reduce((a, p) => a + (parseInt(p.weeks) || 0), 0)} semanas` },
            { label: 'Plantilla', value: quote.templateTitle },
          ].map(item => (
            <div key={item.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-gray-500 text-xs mb-1">{item.label}</p>
              <p className="text-white text-sm font-semibold truncate">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Documento */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-800 p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-white text-2xl font-bold">PRESUPUESTO DEL PROYECTO</h2>
                <p className="text-gray-400 text-sm mt-1">Generated with Zentory Dev</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">{new Date(quote.createdAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-gray-600 text-xs mt-1">Ref: {quote.id?.slice(0, 8).toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Borrador sin contenido */}
            {!isGenerated && !quote.generatedContent && (
              <div className="text-center py-12">
                <svg className="mx-auto mb-3 text-gray-700" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                <p className="text-gray-500 text-sm mb-4">El presupuesto aún no ha sido generado con IA</p>
                <button onClick={handleGenerateWithAI} disabled={generating} className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50">
                  {generating ? 'Generando...' : '✦ Generar presupuesto con IA'}
                </button>
              </div>
            )}

            {/* Spinner generando */}
            {generating && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-brand-400">
                  <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  <span className="text-sm">Generando presupuesto con IA...</span>
                </div>
              </div>
            )}

            {/* Secciones */}
            {!generating && sections.length > 0 && (
              <div className="space-y-8">
                {sections.map((section, i) => (
                  <div key={i} className="group relative">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-brand-400 text-xs font-semibold tracking-widest uppercase pb-2 border-b border-gray-800 flex-1">{section.title}</h3>
                      {editMode && (
                        <button onClick={() => setEditingSection(section)} className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white px-2.5 py-1 rounded-lg text-xs flex items-center gap-1 shrink-0">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          Editar
                        </button>
                      )}
                    </div>
                    <div className="text-gray-300 text-sm leading-relaxed">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{section.body}</ReactMarkdown>
                    </div>
                  </div>
                ))}

                {/* Tecnologías y cronograma */}
                <div className="border-t border-gray-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-brand-400 text-xs font-semibold tracking-widest uppercase mb-3">Tecnologías</h3>
                    <div className="flex flex-wrap gap-2">
                      {[...(quote.selectedTech || []), quote.customTech].filter(Boolean).map(t => (
                        <span key={t} className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-full border border-gray-700">{t}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-brand-400 text-xs font-semibold tracking-widest uppercase mb-3">Cronograma</h3>
                    <div className="space-y-1.5">
                      {quote.phases?.map((phase, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-300">{phase.name}</span>
                          <span className="text-gray-500">{phase.weeks} sem.</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Precio */}
                <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
                  <p className="text-gray-400 text-xs mb-2 tracking-wide uppercase">Inversión total</p>
                  <p className="text-3xl font-bold text-white">
                    {quote.currency} {quote.fixedPrice ? parseFloat(quote.fixedPrice).toLocaleString() : (parseFloat(quote.hourlyRate || 0) * parseFloat(quote.estimatedHours || 0)).toLocaleString()}
                  </p>
                </div>

                {/* Firma */}
                <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Preparado por</p>
                    <p className="text-white font-medium">{quote.freelancerProfile?.name}</p>
                    <p className="text-gray-400">{quote.freelancerProfile?.specialty}</p>
                    <p className="text-gray-400">{quote.freelancerProfile?.email}</p>
                    {quote.freelancerProfile?.portfolio && <p className="text-brand-400 text-xs mt-1">{quote.freelancerProfile.portfolio}</p>}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs uppercase tracking-wide mb-2">Preparado para</p>
                    <p className="text-white font-medium">{quote.clientName}</p>
                    {quote.clientCompany && <p className="text-gray-400">{quote.clientCompany}</p>}
                    <p className="text-gray-400">{quote.clientEmail}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Acciones finales */}
        <div className="flex justify-end gap-3 mb-8 flex-wrap">
          <Button variant="ghost" onClick={() => navigate('/quotes')}>Volver</Button>
          {!isGenerated && <Button variant="outline" onClick={handleGenerateWithAI} disabled={generating}>{generating ? 'Generando...' : '✦ Generar con IA'}</Button>}
          {isGenerated && <Button variant="outline" onClick={() => setConfirmRegenerate(true)} disabled={generating}>{generating ? 'Generando...' : '↺ Volver a generar'}</Button>}
          <Button onClick={handleDownloadPDF} disabled={downloading}>{downloading ? 'Generando...' : '↓ Descargar PDF'}</Button>
        </div>

        {/* Modal confirmar regenerar */}
        {confirmRegenerate && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={(e) => e.target === e.currentTarget && setConfirmRegenerate(false)}>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-amber-500/10 rounded-xl p-3 shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">¿Volver a generar con IA?</h3>
                  <p className="text-gray-400 text-sm">Se sobrescribirá el contenido actual. Los cambios editados manualmente se perderán.</p>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="ghost" onClick={() => setConfirmRegenerate(false)}>Cancelar</Button>
                <Button onClick={handleGenerateWithAI} disabled={generating}>{generating ? 'Generando...' : '✦ Sí, regenerar'}</Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal edición */}
        {editingSection !== null && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={(e) => e.target === e.currentTarget && setEditingSection(null)}>
            <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Editando: {editingSection.title}</h3>
                <button onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-600 transition-colors resize-none"
                rows={12}
                value={editingSection.body}
                onChange={(e) => {
                  const updatedBody = e.target.value
                  setEditingSection(prev => ({ ...prev, body: updatedBody }))
                  const updated = sections.map(s =>
                    s.title === editingSection.title
                      ? `## ${s.title}\n${updatedBody}`
                      : `## ${s.title}\n${s.body}`
                  ).join('\n\n')
                  setEditedContent(updated)
                }}
              />
              <div className="flex justify-end gap-3 mt-4">
                <Button variant="ghost" onClick={() => setEditingSection(null)}>Cancelar</Button>
                <Button onClick={handleSaveEdit} disabled={savingEdit}>{savingEdit ? 'Guardando...' : 'Guardar cambios'}</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default QuotePreviewPage