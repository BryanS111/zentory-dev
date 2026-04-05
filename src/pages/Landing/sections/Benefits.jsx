const benefits = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 2L12.5 7.5H18L13.5 11L15.5 17L10 13.5L4.5 17L6.5 11L2 7.5H7.5L10 2Z" fill="currentColor"/>
      </svg>
    ),
    title: 'Ahorra tiempo',
    description: 'De horas redactando a minutos. Enfócate en el trabajo, no en el papeleo.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Imagen profesional',
    description: 'Presupuestos bien estructurados que transmiten confianza a tus clientes.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M10 6v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'IA especializada',
    description: 'Entrenada para el área tech. Entiende stacks, estimaciones y alcances de proyectos.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M3 5h14M3 10h14M3 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Plantillas por especialidad',
    description: 'Web, mobile, backend, freelance simple o empresarial. Cada proyecto tiene su estructura.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 15h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'PDF y DOCX',
    description: 'Descarga en el formato que prefiera tu cliente. Listo para firmar o enviar por email.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 6h12M4 10h8M4 14h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Historial organizado',
    description: 'Todos tus presupuestos guardados. Consulta, duplica o edita cuando quieras.',
  },
]

function Benefits() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Por qué usar Zentory</h2>
          <p className="text-gray-400 text-base sm:text-lg">Todo lo que necesitas para cerrar más proyectos</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 hover:border-brand-600/50 transition-colors">
              <span className="text-brand-400 block mb-3 sm:mb-4">{b.icon}</span>
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{b.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits