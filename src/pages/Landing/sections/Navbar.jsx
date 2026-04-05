import { useNavigate } from 'react-router-dom'
import Button from '../../../components/ui/Button'
import textoLogo from '../../../assets/texto_zentorydev.webp'

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img 
            src={textoLogo} 
            alt="Zentory Dev" 
            style={{ 
              width: '135px',
              height: 'auto',
              mixBlendMode: 'screen',
              marginTop: '4px',
            }}
          />
        </div>
        <Button size="sm" onClick={() => navigate('/auth')}>
          Empezar gratis
        </Button>
      </div>
    </nav>
  )
}

export default Navbar