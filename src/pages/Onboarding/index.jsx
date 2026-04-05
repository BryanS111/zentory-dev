import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/auth/AuthContext'
import { createProfile } from '../../features/profile/profileService'

const specialties = [
  'Desarrollo Web Frontend',
  'Desarrollo Web Backend',
  'Desarrollo Full Stack',
  'Desarrollo Mobile',
  'DevOps / Cloud',
  'Base de datos',
  'UI/UX Design',
  'Ciberseguridad',
  'Inteligencia Artificial',
  'Otro',
]

const currencies = ['USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL']

const userTypes = ['Freelancer', 'Empresa', 'Startup']

function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: user?.displayName || '',
    userType: 'Freelancer',
    country: '',
    experience: '',
    specialty: '',
    stack: '',
    hourlyRate: '',
    currency: 'USD',
    portfolio: '',
  })

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    setError('')
    setLoading(true)
    try {
      await createProfile(user.uid, {
        ...form,
        email: user.email,
        photoURL: user.photoURL || '',
      })
      navigate('/dashboard')
    } catch (err) {
      setError('Error guardando el perfil. Intenta de nuevo.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors"
  const labelClass = "text-gray-400 text-xs font-medium block mb-1.5"

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-brand-400">Zentory</span>
          <p className="text-gray-400 text-sm mt-2">Configura tu perfil para empezar</p>

          {/* Steps */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                  s === step ? 'bg-brand-600 text-white' :
                  s < step ? 'bg-brand-600/40 text-brand-400' :
                  'bg-gray-800 text-gray-600'
                }`}>
                  {s < step ? '✓' : s}
                </div>
                {s < 3 && <div className={`w-8 h-px transition-colors ${s < step ? 'bg-brand-600/40' : 'bg-gray-800'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">

          {/* Step 1: Info básica */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-white font-semibold text-lg mb-2">Información básica</h2>
              <div>
                <label className={labelClass}>Nombre completo</label>
                <input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} placeholder="Tu nombre" />
              </div>
              <div>
                <label className={labelClass}>Tipo de cuenta</label>
                <div className="flex gap-2">
                  {userTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => update('userType', type)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-medium transition-colors border ${
                        form.userType === type
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>País</label>
                <input className={inputClass} value={form.country} onChange={e => update('country', e.target.value)} placeholder="El Salvador" />
              </div>
              <div>
                <label className={labelClass}>Años de experiencia</label>
                <input className={inputClass} type="number" min="0" max="40" value={form.experience} onChange={e => update('experience', e.target.value)} placeholder="3" />
              </div>
            </div>
          )}

          {/* Step 2: Especialidad */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-white font-semibold text-lg mb-2">Tu especialidad</h2>
              <div>
                <label className={labelClass}>Área principal</label>
                <div className="grid grid-cols-2 gap-2">
                  {specialties.map(s => (
                    <button
                      key={s}
                      onClick={() => update('specialty', s)}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium transition-colors border text-left ${
                        form.specialty === s
                          ? 'bg-brand-600 border-brand-600 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className={labelClass}>Stack tecnológico principal</label>
                <input className={inputClass} value={form.stack} onChange={e => update('stack', e.target.value)} placeholder="React, Node.js, Firebase..." />
              </div>
            </div>
          )}

          {/* Step 3: Tarifas */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-white font-semibold text-lg mb-2">Tarifas y contacto</h2>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className={labelClass}>Precio por hora</label>
                  <input className={inputClass} type="number" min="0" value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} placeholder="25" />
                </div>
                <div className="w-28">
                  <label className={labelClass}>Moneda</label>
                  <select
                    className={inputClass}
                    value={form.currency}
                    onChange={e => update('currency', e.target.value)}
                  >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass}>Portafolio o sitio web <span className="text-gray-600">(opcional)</span></label>
                <input className={inputClass} value={form.portfolio} onChange={e => update('portfolio', e.target.value)} placeholder="https://tuportafolio.com" />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-4 py-3">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Navegación */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => s - 1)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                ← Atrás
              </button>
            ) : <div />}

            {step < 3 ? (
              <button
                onClick={() => setStep(s => s + 1)}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Siguiente →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Completar perfil'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage