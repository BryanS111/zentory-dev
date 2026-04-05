import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { useProfile } from '../features/profile/useProfile'
import LandingPage from '../pages/Landing'
import AuthPage from '../pages/Auth'
import OnboardingPage from '../pages/Onboarding'
import DashboardPage from '../pages/Dashboard'
import TemplatesPage from '../pages/Templates'
import QuoteBuilderPage from '../pages/QuoteBuilder'
import QuotePreviewPage from '../pages/QuotePreview'
import SettingsPage from '../pages/Settings'
import QuotesPage from '../pages/Quotes'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const { profile, loading } = useProfile()
  if (!user) return <Navigate to="/auth" replace />
  if (loading) return null
  if (!profile) return <Navigate to="/onboarding" replace />
  return children
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />

        <Route path="/onboarding" element={
          <PrivateRoute>
            <OnboardingPage />
          </PrivateRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/quotes" element={
          <ProtectedRoute>
            <QuotesPage />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <TemplatesPage />
          </ProtectedRoute>
        } />
        <Route path="/quote/new" element={
          <ProtectedRoute>
            <QuoteBuilderPage />
          </ProtectedRoute>
        } />
        <Route path="/quote/:id" element={
          <ProtectedRoute>
            <QuotePreviewPage />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter