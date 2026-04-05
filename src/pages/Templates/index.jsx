import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'

const templates = [
  {
    id: 'web-fullstack',
    title: 'Desarrollo Web Full Stack',
    description: 'Para proyectos web completos con frontend, backend y base de datos.',
    complexity: 'Media',
    time: '5 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
  },
  {
    id: 'frontend',
    title: 'Desarrollo Frontend',
    description: 'Ideal para proyectos de interfaces, SPAs y landing pages.',
    complexity: 'Baja',
    time: '4 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    id: 'backend',
    title: 'Desarrollo Backend',
    description: 'Para APIs REST, microservicios y arquitecturas de servidor.',
    complexity: 'Media',
    time: '5 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
  {
    id: 'mobile',
    title: 'Aplicación Mobile',
    description: 'Para apps iOS, Android o multiplataforma con React Native o Flutter.',
    complexity: 'Alta',
    time: '6 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
  {
    id: 'freelance-simple',
    title: 'Proyecto Freelance Simple',
    description: 'Para proyectos pequeños o trabajos puntuales con un alcance definido.',
    complexity: 'Baja',
    time: '3 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
  {
    id: 'enterprise',
    title: 'Proyecto Empresarial',
    description: 'Para propuestas formales a empresas con documentación completa.',
    complexity: 'Alta',
    time: '8 min',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
]

const complexityColor = {
  'Baja': { bg: 'rgba(4, 120, 87, 0.15)', text: '#34D399', border: 'rgba(4, 120, 87, 0.3)' },
  'Media': { bg: 'rgba(42, 82, 152, 0.15)', text: '#93c5fd', border: 'rgba(42, 82, 152, 0.3)' },
  'Alta': { bg: 'rgba(180, 83, 9, 0.15)', text: '#fbbf24', border: 'rgba(180, 83, 9, 0.3)' },
}

function TemplatesPage() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Plantillas</h1>
          <p className="text-gray-400 text-sm mt-1">
            Elige una plantilla para empezar tu presupuesto
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t) => {
            const c = complexityColor[t.complexity]
            return (
              <div
                key={t.id}
                onClick={() => navigate(`/quote/new?template=${t.id}`)}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-gray-600 transition-all group"
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-lg bg-gray-800 flex items-center justify-center text-brand-400 mb-4 group-hover:bg-gray-700 transition-colors">
                  {t.icon}
                </div>

                {/* Title */}
                <h3 className="text-white font-semibold mb-2 group-hover:text-brand-400 transition-colors">
                  {t.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  {t.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                  >
                    {t.complexity}
                  </span>
                  <span className="text-gray-600 text-xs flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {t.time}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </DashboardLayout>
  )
}

export default TemplatesPage