const steps = [
  {
    number: '01',
    title: 'Crea tu perfil',
    description: 'Indica tu especialidad, experiencia y tarifa. Zentory usará esta info para personalizar cada presupuesto.',
  },
  {
    number: '02',
    title: 'Elige una plantilla',
    description: 'Selecciona entre plantillas para web, mobile, backend, y más. Cada una tiene la estructura ideal para ese tipo de proyecto.',
  },
  {
    number: '03',
    title: 'Llena el formulario',
    description: 'Describe el proyecto, el alcance, tecnologías y entregables. Sin redactar desde cero.',
  },
  {
    number: '04',
    title: 'La IA lo mejora',
    description: 'Nuestra IA estructura y mejora la redacción de tu presupuesto para que suene profesional y claro.',
  },
  {
    number: '05',
    title: 'Descarga y envía',
    description: 'Exporta en PDF o DOCX y envíalo directo a tu cliente. Listo en minutos.',
  },
]

function HowItWorks() {
  return (
    <section id="como-funciona" className="py-16 sm:py-24 px-4 sm:px-6 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">¿Cómo funciona?</h2>
          <p className="text-gray-400 text-base sm:text-lg">Cinco pasos para un presupuesto profesional</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          {steps.map((step) => (
            <div key={step.number} className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-5">
              <span className="text-brand-400 text-xl sm:text-2xl font-bold block mb-2 sm:mb-3">{step.number}</span>
              <h3 className="text-white font-semibold mb-1 sm:mb-2 text-sm sm:text-base">{step.title}</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks