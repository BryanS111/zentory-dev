export const templateConfigs = {
  'web-fullstack': {
    title: 'Desarrollo Web Full Stack',
    sections: ['client', 'project', 'scope', 'tech', 'deliverables', 'timeline', 'pricing', 'conditions'],
    scopeOptions: ['Frontend', 'Backend', 'Base de datos', 'APIs REST', 'Autenticación', 'Panel admin', 'Pagos', 'Deploy'],
    techOptions: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Python', 'Django', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Docker'],
    deliverableDefaults: ['Aplicación web funcional', 'Código fuente', 'Documentación técnica', 'Deploy inicial'],
  },
  'frontend': {
    title: 'Desarrollo Frontend',
    sections: ['client', 'project', 'scope', 'tech', 'deliverables', 'timeline', 'pricing', 'conditions'],
    scopeOptions: ['UI/UX', 'Diseño responsivo', 'Animaciones', 'Integración de APIs', 'SEO básico', 'Accesibilidad'],
    techOptions: ['React', 'Vue', 'Angular', 'Next.js', 'TailwindCSS', 'TypeScript', 'Figma'],
    deliverableDefaults: ['Interfaz funcional', 'Código fuente', 'Assets de diseño', 'Documentación de componentes'],
  },
  'backend': {
    title: 'Desarrollo Backend',
    sections: ['client', 'project', 'scope', 'tech', 'deliverables', 'timeline', 'pricing', 'conditions'],
    scopeOptions: ['APIs REST', 'Autenticación JWT', 'Base de datos', 'Microservicios', 'WebSockets', 'Colas de mensajes', 'Caché'],
    techOptions: ['Node.js', 'Python', 'FastAPI', 'Django', 'Express', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker', 'AWS'],
    deliverableDefaults: ['API funcional', 'Documentación de endpoints', 'Código fuente', 'Tests unitarios'],
  },
  'mobile': {
    title: 'Aplicación Mobile',
    sections: ['client', 'project', 'scope', 'tech', 'deliverables', 'timeline', 'pricing', 'conditions'],
    scopeOptions: ['iOS', 'Android', 'Multiplataforma', 'Notificaciones push', 'Pagos in-app', 'Geolocalización', 'Cámara/Galería'],
    techOptions: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Expo'],
    deliverableDefaults: ['App funcional', 'Código fuente', 'Publicación en stores', 'Documentación'],
  },
  'freelance-simple': {
    title: 'Proyecto Freelance Simple',
    sections: ['client', 'project', 'scope', 'deliverables', 'timeline', 'pricing', 'conditions'],
    scopeOptions: ['Diseño', 'Desarrollo', 'Correcciones', 'Mantenimiento', 'Consultoría'],
    techOptions: ['HTML/CSS', 'JavaScript', 'WordPress', 'Webflow', 'Figma', 'Otro'],
    deliverableDefaults: ['Proyecto funcional', 'Código fuente'],
  },
  'enterprise': {
    title: 'Proyecto Empresarial',
    sections: ['client', 'project', 'scope', 'tech', 'deliverables', 'timeline', 'pricing', 'conditions'],
    scopeOptions: ['Análisis de requerimientos', 'Arquitectura', 'Frontend', 'Backend', 'Base de datos', 'Seguridad', 'Integración ERP/CRM', 'Capacitación', 'Soporte post-lanzamiento'],
    techOptions: ['React', 'Angular', 'Node.js', '.NET', 'Java', 'Python', 'PostgreSQL', 'Oracle', 'AWS', 'Azure', 'Docker', 'Kubernetes'],
    deliverableDefaults: ['Sistema completo', 'Documentación técnica', 'Manual de usuario', 'Capacitación', 'Soporte 30 días'],
  },
}