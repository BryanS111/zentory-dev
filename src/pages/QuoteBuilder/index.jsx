import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { useProfile } from '../../features/profile/useProfile'
import { templateConfigs } from '../../features/templates/templateConfig'
import { doc, collection, setDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Button from '../../components/ui/Button'
import { estimatePrice, generateQuoteDocument } from '../../features/ai/quoteAI'


const stepLabels = {
  client: 'Cliente',
  project: 'Proyecto',
  scope: 'Alcance',
  tech: 'Tecnologías',
  deliverables: 'Entregables',
  timeline: 'Cronograma',
  pricing: 'Precio',
  conditions: 'Condiciones',
}

function QuoteBuilderPage() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const templateId = searchParams.get('template') || 'web-fullstack'
  const config = templateConfigs[templateId]

  const [currentStep, setCurrentStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const steps = config.sections

  const [estimating, setEstimating] = useState(false)
  const [priceEstimate, setPriceEstimate] = useState(null)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)

  const [form, setForm] = useState({
    // Cliente
    clientName: '',
    clientCompany: '',
    clientEmail: '',
    clientCountry: '',
    // Proyecto
    projectName: '',
    projectDescription: '',
    projectGoal: '',
    projectProblem: '',
    projectAudience: '',
    // Alcance
    selectedScope: [],
    // Tech
    selectedTech: [],
    customTech: '',
    // Entregables
    deliverables: config.deliverableDefaults.join('\n'),
    // Cronograma
    phases: [
      { name: 'Diseño y planificación', weeks: '1' },
      { name: 'Desarrollo', weeks: '3' },
      { name: 'Pruebas', weeks: '1' },
      { name: 'Entrega y ajustes', weeks: '1' },
    ],
    // Precio
    pricingType: 'fixed',
    fixedPrice: '',
    hourlyRate: profile?.hourlyRate || '',
    estimatedHours: '',
    complexity: 'medium',
    currency: profile?.currency || 'USD',
    // Condiciones
    conditions: '- Cambios fuera del alcance se cotizan por separado.\n- El cliente debe proveer accesos y recursos necesarios.\n- 50% de anticipo para iniciar, 50% al entregar.\n- Soporte post-entrega de 15 días incluido.',
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const toggleArray = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }))
  }

  const updatePhase = (index, field, value) => {
    const updated = [...form.phases]
    updated[index] = { ...updated[index], [field]: value }
    setForm(prev => ({ ...prev, phases: updated }))
  }

  const addPhase = () => {
    setForm(prev => ({
      ...prev,
      phases: [...prev.phases, { name: '', weeks: '1' }],
    }))
  }

  const removePhase = (index) => {
    setForm(prev => ({
      ...prev,
      phases: prev.phases.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const ref = doc(collection(db, 'users', user.uid, 'quotes'))
      await setDoc(ref, {
        ...form,
        templateId,
        templateTitle: config.title,
        status: 'draft',
        freelancerProfile: {
          name: profile?.name,
          email: user.email,
          specialty: profile?.specialty,
          country: profile?.country,
          portfolio: profile?.portfolio,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }
  
  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const content = await generateQuoteDocument({ form, profile, user })
      const ref = doc(collection(db, 'users', user.uid, 'quotes'))
      await setDoc(ref, {
        ...form,
        templateId,
        templateTitle: config.title,
        generatedContent: content,
        status: 'generated',
        freelancerProfile: {
          name: profile?.name,
          email: user.email,
          specialty: profile?.specialty,
          country: profile?.country,
          portfolio: profile?.portfolio,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      navigate(`/quote/${ref.id}`)
    } catch (err) {
      console.error(err)
      alert('Error al generar el presupuesto. Verifica tu API key.')
    } finally {
      setGenerating(false)
    }
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors"
  const labelClass = "text-gray-400 text-xs font-medium block mb-1.5"
  const tagClass = (active) => `px-3 py-2 rounded-lg text-xs font-medium border cursor-pointer transition-colors ${
    active
      ? 'bg-brand-600 border-brand-600 text-white'
      : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
  }`

  const renderStep = () => {
    const step = steps[currentStep]

    if (step === 'client') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Información del cliente</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input className={inputClass} value={form.clientName} onChange={e => update('clientName', e.target.value)} placeholder="Juan Pérez" />
          </div>
          <div>
            <label className={labelClass}>Empresa</label>
            <input className={inputClass} value={form.clientCompany} onChange={e => update('clientCompany', e.target.value)} placeholder="Acme Corp" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input className={inputClass} type="email" value={form.clientEmail} onChange={e => update('clientEmail', e.target.value)} placeholder="cliente@empresa.com" />
          </div>
          <div>
            <label className={labelClass}>País</label>
            <input className={inputClass} value={form.clientCountry} onChange={e => update('clientCountry', e.target.value)} placeholder="México" />
          </div>
        </div>
      </div>
    )

    if (step === 'project') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Información del proyecto</h2>
        <div>
          <label className={labelClass}>Nombre del proyecto</label>
          <input className={inputClass} value={form.projectName} onChange={e => update('projectName', e.target.value)} placeholder="Plataforma e-commerce Acme" />
        </div>
        <div>
          <label className={labelClass}>Descripción</label>
          <textarea className={`${inputClass} resize-none`} rows={3} value={form.projectDescription} onChange={e => update('projectDescription', e.target.value)} placeholder="Describe brevemente el proyecto..." />
        </div>
        <div>
          <label className={labelClass}>Objetivo principal</label>
          <textarea className={`${inputClass} resize-none`} rows={2} value={form.projectGoal} onChange={e => update('projectGoal', e.target.value)} placeholder="¿Qué se quiere lograr con este proyecto?" />
        </div>
        <div>
          <label className={labelClass}>Problema que resuelve</label>
          <textarea className={`${inputClass} resize-none`} rows={2} value={form.projectProblem} onChange={e => update('projectProblem', e.target.value)} placeholder="¿Qué problema actual soluciona?" />
        </div>
        <div>
          <label className={labelClass}>Público objetivo</label>
          <input className={inputClass} value={form.projectAudience} onChange={e => update('projectAudience', e.target.value)} placeholder="Empresas B2B, usuarios finales, etc." />
        </div>
      </div>
    )

    if (step === 'scope') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Alcance del proyecto</h2>
        <p className="text-gray-400 text-sm">Selecciona los servicios incluidos en este presupuesto</p>
        <div className="flex flex-wrap gap-2">
          {config.scopeOptions.map(s => (
            <button key={s} onClick={() => toggleArray('selectedScope', s)} className={tagClass(form.selectedScope.includes(s))}>
              {s}
            </button>
          ))}
        </div>
      </div>
    )

    if (step === 'tech') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Tecnologías</h2>
        <p className="text-gray-400 text-sm">Selecciona las tecnologías que utilizarás</p>
        <div className="flex flex-wrap gap-2">
          {config.techOptions.map(t => (
            <button key={t} onClick={() => toggleArray('selectedTech', t)} className={tagClass(form.selectedTech.includes(t))}>
              {t}
            </button>
          ))}
        </div>
        <div>
          <label className={labelClass}>Otras tecnologías</label>
          <input className={inputClass} value={form.customTech} onChange={e => update('customTech', e.target.value)} placeholder="Redis, Stripe, SendGrid..." />
        </div>
      </div>
    )

    if (step === 'deliverables') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Entregables</h2>
        <p className="text-gray-400 text-sm">Lista lo que el cliente recibirá al final del proyecto</p>
        <textarea
          className={`${inputClass} resize-none`}
          rows={8}
          value={form.deliverables}
          onChange={e => update('deliverables', e.target.value)}
          placeholder="- Aplicación funcional&#10;- Código fuente&#10;- Documentación"
        />
      </div>
    )

    if (step === 'timeline') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Cronograma</h2>
        <p className="text-gray-400 text-sm">Define las fases del proyecto y su duración</p>
        {form.phases.map((phase, i) => (
          <div key={i} className="flex gap-3 items-center">
            <input
              className={`${inputClass} flex-1`}
              value={phase.name}
              onChange={e => updatePhase(i, 'name', e.target.value)}
              placeholder="Nombre de la fase"
            />
            <div className="flex items-center gap-2 w-32">
              <input
                className={`${inputClass} w-16 text-center`}
                type="number"
                min="1"
                value={phase.weeks}
                onChange={e => updatePhase(i, 'weeks', e.target.value)}
              />
              <span className="text-gray-400 text-xs whitespace-nowrap">sem.</span>
            </div>
            {form.phases.length > 1 && (
              <button onClick={() => removePhase(i)} className="text-gray-600 hover:text-red-400 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
        ))}
        <button onClick={addPhase} className="text-brand-400 hover:text-brand-300 text-sm transition-colors text-left">
          + Agregar fase
        </button>
        <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm text-gray-400">
          Total estimado: <span className="text-white font-medium">
            {form.phases.reduce((acc, p) => acc + (parseInt(p.weeks) || 0), 0)} semanas
          </span>
        </div>
      </div>
    )

    if (step === 'pricing') {
  const handleEstimatePrice = async () => {
    setEstimating(true)
    setPriceEstimate(null)
    try {
      const result = await estimatePrice({ form, profile })
      setPriceEstimate(result)
    } catch (err) {
      console.error(err)
      alert('Error al estimar el precio. Verifica tu API key de OpenRouter.')
    } finally {
      setEstimating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-white font-semibold text-lg mb-2">Precio</h2>
      <div className="flex gap-2">
        {[
          { id: 'fixed', label: 'Precio fijo' },
          { id: 'hourly', label: 'Por hora' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => update('pricingType', opt.id)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
              form.pricingType === opt.id
                ? 'bg-brand-600 border-brand-600 text-white'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        {form.pricingType === 'fixed' ? (
          <div className="flex-1">
            <label className={labelClass}>Precio total</label>
            <input className={inputClass} type="number" value={form.fixedPrice} onChange={e => update('fixedPrice', e.target.value)} placeholder="3500" />
          </div>
        ) : (
          <>
            <div className="flex-1">
              <label className={labelClass}>Tarifa por hora</label>
              <input className={inputClass} type="number" value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} placeholder="25" />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Horas estimadas</label>
              <input className={inputClass} type="number" value={form.estimatedHours} onChange={e => update('estimatedHours', e.target.value)} placeholder="80" />
            </div>
          </>
        )}
        <div className="w-28">
          <label className={labelClass}>Moneda</label>
          <select className={inputClass} value={form.currency} onChange={e => update('currency', e.target.value)}>
            {['USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Complejidad del proyecto</label>
        <div className="flex gap-2">
          {[
            { id: 'low', label: 'Baja' },
            { id: 'medium', label: 'Media' },
            { id: 'high', label: 'Alta' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => update('complexity', opt.id)}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                form.complexity === opt.id
                  ? 'bg-brand-600 border-brand-600 text-white'
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Estimación con IA */}
      <div className="border border-gray-700 rounded-xl p-4 bg-gray-800/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-white text-sm font-medium">¿No sabes cuánto cobrar?</p>
            <p className="text-gray-400 text-xs mt-0.5">La IA analiza tu proyecto y sugiere un precio justo</p>
          </div>
          <button
            onClick={handleEstimatePrice}
            disabled={estimating}
            style={{
              background: estimating ? '#1a3254' : '#1e3a5f',
              color: '#ffffff',
              border: '1px solid #2a5298',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: estimating ? 'not-allowed' : 'pointer',
              opacity: estimating ? 0.5 : 1,
              whiteSpace: 'nowrap',
              transition: 'background 0.2s',
            }}
          >
            {estimating ? 'Analizando...' : '✦ Estimar precio'}
          </button>
        </div>

        {priceEstimate && (
          <div className="bg-gray-900 rounded-lg p-4 mt-2">
            <p className="text-gray-400 text-xs mb-2">Rango sugerido</p>
            <p className="text-brand-400 text-2xl font-bold mb-1">
              {priceEstimate.currency} {priceEstimate.min.toLocaleString()} — {priceEstimate.max.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mb-3">
              ≈ {priceEstimate.currency} {priceEstimate.hourlyEquivalent}/hora
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">{priceEstimate.reasoning}</p>
            <button
              onClick={() => update('fixedPrice', priceEstimate.min.toString())}
              style={{
                marginTop: '12px',
                background: 'transparent',
                color: '#93c5fd',
                border: '1px solid #2a5298',
                padding: '0.4rem 0.875rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'rgba(42,82,152,0.15)'}
              onMouseLeave={e => e.target.style.background = 'transparent'}
            >
              Usar precio mínimo sugerido →
            </button>
          </div>
        )}
      </div>

      {form.pricingType === 'hourly' && form.hourlyRate && form.estimatedHours && (
        <div className="bg-gray-800 rounded-lg px-4 py-3">
          <p className="text-gray-400 text-xs mb-1">Total estimado</p>
          <p className="text-white font-bold text-xl">
            {form.currency} {(parseFloat(form.hourlyRate) * parseFloat(form.estimatedHours)).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}

    if (step === 'conditions') return (
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-semibold text-lg mb-2">Condiciones</h2>
        <p className="text-gray-400 text-sm">Define los términos del proyecto</p>
        <textarea
          className={`${inputClass} resize-none`}
          rows={8}
          value={form.conditions}
          onChange={e => update('conditions', e.target.value)}
        />
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <button onClick={() => navigate('/templates')} className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1 mb-4">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Volver a plantillas
          </button>
          <h1 className="text-2xl font-bold text-white">{config.title}</h1>
          <p className="text-gray-400 text-sm mt-1">Paso {currentStep + 1} de {steps.length}</p>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-800 rounded-full mb-8">
          <div
            className="h-full bg-brand-600 rounded-full transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Steps nav */}
        <div className="flex gap-2 flex-wrap mb-8">
          {steps.map((step, i) => (
            <button
              key={step}
              onClick={() => i <= currentStep && setCurrentStep(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                i === currentStep
                  ? 'bg-brand-600 text-white'
                  : i < currentStep
                  ? 'bg-brand-600/20 text-brand-400 cursor-pointer hover:bg-brand-600/30'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              {stepLabels[step]}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 sm:p-8 mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => currentStep > 0 ? setCurrentStep(s => s - 1) : navigate('/templates')}
          >
            ← Atrás
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              Guardar borrador
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(s => s + 1)}>
                Siguiente →
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Generando...' : '✦ Generar con IA'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default QuoteBuilderPage