import { useNavigate } from 'react-router-dom'
import Button from '../../../components/ui/Button'

function CTASection() {
  const navigate = useNavigate()

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto text-center bg-gray-900 border border-gray-800 rounded-2xl p-8 sm:p-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
          Empieza a crear presupuestos profesionales hoy
        </h2>
        <p className="text-gray-400 text-base sm:text-lg mb-6 sm:mb-8">
          Gratis para comenzar. Sin tarjeta de crédito.
        </p>
        <Button size="lg" onClick={() => navigate('/auth')} className="w-full sm:w-auto">
          Crear mi primer presupuesto
        </Button>
        <p className="text-gray-600 text-sm mt-4 sm:mt-6">
          Freelancers de toda Latinoamérica ya usan Zentory
        </p>
      </div>
    </section>
  )
}

export default CTASection