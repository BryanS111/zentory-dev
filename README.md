# Zentory Dev
web: zentorydev.vercel.app

> Herramienta SaaS para freelancers de tecnología que genera presupuestos profesionales con inteligencia artificial.

**Zentory Dev** es un proyecto real desarrollado por [Cognetix Innovation](https://github.com/BryanS111). Permite a desarrolladores freelance crear propuestas técnicas completas en minutos — con alcance, cronograma, tecnologías, estimación de precio y descarga en PDF.

---

## ✦ Características

- **Generación con IA** — produce un documento completo con 9 secciones profesionales
- **Estimación de precio inteligente** — considera país del cliente, experiencia del freelancer y complejidad del proyecto
- **6 plantillas técnicas** — Web Full Stack, Frontend, Backend, Mobile, Freelance Simple, Empresarial
- **Exportación a PDF** — descarga el presupuesto listo para enviar al cliente
- **Historial de presupuestos** — guarda, busca y reutiliza propuestas anteriores
- **Edición por secciones** — modifica cualquier parte del documento generado
- **Tema claro / oscuro** — persiste por usuario en la nube
- **Autenticación** — Google, GitHub y email/contraseña

---

## 🛠 Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19 + Vite + TailwindCSS v4 |
| Base de datos | Firebase Firestore |
| Autenticación | Firebase Authentication |
| IA | OpenRouter API (`nvidia/nemotron-3-nano-30b-a3b:free`) |
| PDF | jsPDF |
| Deploy | Vercel |

---

## 🚀 Instalación local

```bash
# Clonar el repositorio
git clone https://github.com/BryanS111/zentory-dev.git
cd zentory-dev

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Edita .env.local con tus claves de Firebase y OpenRouter

# Iniciar en desarrollo
npm run dev
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz con estas variables:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_OPENROUTER_API_KEY=
```

---

## 📁 Estructura del proyecto

```
src/
├── components/        # Componentes reutilizables (Button, Sidebar, SplashScreen)
├── features/          # Lógica de negocio por dominio
│   ├── ai/            # Integración OpenRouter + generación de documentos
│   ├── auth/          # Firebase Auth + contexto
│   ├── documents/     # Generación PDF + reparación de contenido IA
│   ├── profile/       # Perfil de usuario y tema
│   ├── quotes/        # Hooks de presupuestos
│   └── templates/     # Configuración de plantillas técnicas
├── pages/             # Vistas principales
│   ├── Landing/       # Página de inicio pública
│   ├── Auth/          # Login y registro
│   ├── Dashboard/     # Panel principal
│   ├── QuoteBuilder/  # Formulario de presupuesto por pasos
│   ├── QuotePreview/  # Vista previa y descarga del presupuesto
│   ├── Quotes/        # Historial de presupuestos
│   ├── Templates/     # Selección de plantilla
│   └── Settings/      # Configuración de perfil
└── routes/            # Definición de rutas con React Router
```

---

## 🏢 Desarrollado por

**Cognetix Innovation**  
Proyecto real en desarrollo activo.

---

*Generado con Zentory Dev — porque tu tiempo vale.*