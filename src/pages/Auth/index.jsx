import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  loginWithGoogle,
  loginWithGithub,
  loginWithEmail,
  registerWithEmail,
} from '../../features/auth/authService'
import textoLogo from '../../assets/texto_zentorydev.webp'
import SplashScreen from '../../components/ui/SplashScreen'

function AuthPage() {
  const [showSplash, setShowSplash] = useState(false)
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

 const handleSocialLogin = async (provider) => {
  setError('')
  setLoading(true)
  try {
    await provider()
    setShowSplash(true)
  } catch (err) {
    setError(getFriendlyError(err.code))
    setLoading(false)
  }
}

const handleEmailAuth = async (e) => {
  e.preventDefault()
  setError('')
  setLoading(true)
  try {
    if (mode === 'login') {
      await loginWithEmail(email, password)
    } else {
      await registerWithEmail(email, password)
    }
    setShowSplash(true)
  } catch (err) {
    setError(getFriendlyError(err.code))
    setLoading(false)
  }
}
  const getFriendlyError = (code) => {
    const errors = {
      'auth/user-not-found': 'No existe una cuenta con ese correo.',
      'auth/wrong-password': 'Contraseña incorrecta.',
      'auth/email-already-in-use': 'Ese correo ya está registrado.',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
      'auth/invalid-email': 'El correo no es válido.',
      'auth/popup-closed-by-user': 'Cerraste la ventana antes de completar el login.',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con ese email usando otro método.',
    }
    return errors[code] || 'Ocurrió un error. Intenta de nuevo.'
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

{/* Logo */}
<div className="text-center mb-5 pt-8">
  <a href="/">
    <img 
      src={textoLogo} 
      alt="Zentory Dev" 
      style={{ 
        width: '260px',
        height: 'auto',
        mixBlendMode: 'screen',
        display: 'block',
        margin: '0 auto',
      }}
    />
  </a>
  <p className="text-gray-500 text-sm mt-0 tracking-wide">
    {mode === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta gratis'}
  </p>
</div>

        {/* Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">

          {/* Botones sociales */}
          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleSocialLogin(loginWithGoogle)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

            <button
              onClick={() => handleSocialLogin(loginWithGithub)}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Continuar con GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-gray-600 text-xs">o con correo</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Formulario email */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-brand-600 transition-colors"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white rounded-lg px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-50 mt-1"
            >
              {loading ? 'Cargando...' : mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          </form>

          {/* Toggle login/register */}
          <p className="text-center text-gray-600 text-xs mt-6">
            {mode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
            <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError('') }}
            className="text-brand-400 hover:text-white transition-colors font-medium"
            >
            {mode === 'login' ? 'Regístrate gratis' : 'Inicia sesión'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-700 text-xs mt-6">
          © {new Date().getFullYear()} Cognetix Innovation
        </p>
      </div>
      {showSplash && (
  <SplashScreen onFinish={() => navigate('/dashboard')} />
)}
    </div>
  )
}

export default AuthPage