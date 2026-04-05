import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../features/auth/AuthContext'
import { useProfile } from '../../features/profile/useProfile'
import { useTheme } from '../../features/profile/useTheme'
import { updateProfile } from '../../features/profile/profileService'
import Button from '../../components/ui/Button'
import { useState, useEffect } from 'react'

const specialties = [
  'Desarrollo Web Frontend', 'Desarrollo Web Backend', 'Desarrollo Full Stack',
  'Desarrollo Mobile', 'DevOps / Cloud', 'Base de datos',
  'UI/UX Design', 'Ciberseguridad', 'Inteligencia Artificial', 'Otro',
]
const currencies = ['USD', 'EUR', 'MXN', 'COP', 'ARS', 'CLP', 'PEN', 'BRL']

function SettingsPage() {
  const { user } = useAuth()
  const { profile } = useProfile()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  
// reemplaza el useState del form por esto:
    const [form, setForm] = useState({
    name: '',
    country: '',
    experience: '',
    specialty: '',
    stack: '',
    hourlyRate: '',
    currency: 'USD',
    portfolio: '',
    })

    // agrega este useEffect después del useState:
    useEffect(() => {
    if (profile) {
        setForm({
        name: profile.name || '',
        country: profile.country || '',
        experience: profile.experience || '',
        specialty: profile.specialty || '',
        stack: profile.stack || '',
        hourlyRate: profile.hourlyRate || '',
        currency: profile.currency || 'USD',
        portfolio: profile.portfolio || '',
        })
    }
    }, [profile])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  const handleSave = async () => {
    setError('')
    setLoading(true)
    try {
      await updateProfile(user.uid, form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError('Error guardando los cambios.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors"
  const labelClass = "text-gray-400 text-xs font-medium block mb-1.5"

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Configuración</h1>
          <p className="text-gray-400 text-sm mt-1">Actualiza tu perfil y preferencias</p>
        </div>

        {/* Sección: Apariencia */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-4">Apariencia</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white">Tema</p>
              <p className="text-xs text-gray-400 mt-0.5">
                Actualmente en modo {theme === 'dark' ? 'oscuro' : 'claro'}
              </p>
            </div>
            <button
                onClick={toggleTheme}
                style={{
                    position: 'relative',
                    width: '48px',
                    height: '26px',
                    borderRadius: '999px',
                    border: '2px solid #2a5298',
                    background: theme === 'light' ? '#1e3a5f' : '#2a5298',
                    cursor: 'pointer',
                    transition: 'background 0.2s',
                    flexShrink: 0,
                }}
                >
                <span style={{
                    position: 'absolute',
                    top: '3px',
                    left: theme === 'light' ? '23px' : '3px',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                }} />
            </button>
          </div>
        </div>

        {/* Sección: Perfil */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-5">Información del perfil</h2>
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass}>Nombre completo</label>
              <input className={inputClass} value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>País</label>
              <input className={inputClass} value={form.country} onChange={e => update('country', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Años de experiencia</label>
              <input className={inputClass} type="number" value={form.experience} onChange={e => update('experience', e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Especialidad</label>
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
              <label className={labelClass}>Stack tecnológico</label>
              <input className={inputClass} value={form.stack} onChange={e => update('stack', e.target.value)} placeholder="React, Node.js, Firebase..." />
            </div>
          </div>
        </div>

        {/* Sección: Tarifas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-white font-semibold mb-5">Tarifas</h2>
          <div className="flex gap-3 mb-4">
            <div className="flex-1">
              <label className={labelClass}>Precio por hora</label>
              <input className={inputClass} type="number" value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} placeholder="25" />
            </div>
            <div className="w-28">
              <label className={labelClass}>Moneda</label>
              <select className={inputClass} value={form.currency} onChange={e => update('currency', e.target.value)}>
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Portafolio o sitio web</label>
            <input className={inputClass} value={form.portfolio} onChange={e => update('portfolio', e.target.value)} placeholder="https://tuportafolio.com" />
          </div>
        </div>

        {/* Error / éxito */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}
        {saved && (
          <div className="bg-brand-600/10 border border-brand-600/30 text-brand-400 text-xs rounded-lg px-4 py-3 mb-4">
            Cambios guardados correctamente.
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default SettingsPage