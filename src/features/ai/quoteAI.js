import { askAI } from './openrouter'
import { repairContent } from '../documents/repairContent'

export const estimatePrice = async ({ form, profile }) => {
  const totalWeeks = form.phases.reduce((acc, p) => acc + (parseInt(p.weeks) || 0), 0)
  const scope = form.selectedScope.join(', ')
  const tech = [...form.selectedTech, form.customTech].filter(Boolean).join(', ')

  const complexityLabel = form.complexity === 'low' ? 'Baja' : form.complexity === 'medium' ? 'Media' : 'Alta'
  const complexityMultiplier = form.complexity === 'low' ? 0.6 : form.complexity === 'medium' ? 1.0 : 1.6

  const isInternationalClient = form.clientCountry &&
    !['El Salvador', 'Guatemala', 'Honduras', 'Nicaragua', 'Costa Rica',
      'Panamá', 'México', 'Colombia', 'Venezuela', 'Ecuador',
      'Perú', 'Bolivia', 'Paraguay', 'Uruguay', 'Argentina', 'Chile'].includes(form.clientCountry)

  const clientContext = isInternationalClient
    ? 'Cliente de país desarrollado (USA/Europa) — tarifas 2.5x a 3x más altas'
    : 'Cliente local latinoamericano — tarifas del mercado local'

  const baseRate = parseFloat(profile?.hourlyRate || 10)
  const adjustedRate = isInternationalClient ? Math.max(baseRate * 2.5, 25) : baseRate
  const estimatedHours = totalWeeks * 40 * complexityMultiplier
  const basePrice = adjustedRate * estimatedHours

  const prompt = `
Eres un consultor financiero especializado en proyectos de software freelance en Latinoamérica.

DATOS DEL PROYECTO:
- Nombre: ${form.projectName}
- Tipo: ${scope}
- Tecnologías: ${tech}
- Duración: ${totalWeeks} semanas
- Complejidad elegida: ${complexityLabel}
- Descripción: ${form.projectDescription}

DATOS DEL FREELANCER:
- País: ${profile?.country || 'El Salvador'}
- Experiencia: ${profile?.experience || '1'} años
- Especialidad: ${profile?.specialty}
- Tarifa base: ${baseRate} USD/hora
- Tarifa ajustada para este proyecto: ${Math.round(adjustedRate)} USD/hora

DATOS DEL CLIENTE:
- País: ${form.clientCountry || 'No especificado'}
- Contexto: ${clientContext}

CÁLCULO BASE:
- Horas estimadas con complejidad ${complexityLabel}: ${Math.round(estimatedHours)} horas
- Precio base: USD ${Math.round(basePrice)}
- Rango sugerido: USD ${Math.round(basePrice * 0.85)} — USD ${Math.round(basePrice * 1.2)}

Responde ÚNICAMENTE con este JSON en una sola línea sin texto adicional:
{"min":${Math.round(basePrice * 0.85)},"max":${Math.round(basePrice * 1.2)},"currency":"USD","hourlyEquivalent":${Math.round(adjustedRate)},"estimatedHours":${Math.round(estimatedHours)},"reasoning":"Explicación breve considerando complejidad ${complexityLabel} y contexto del cliente"}
`

  try {
    const raw = await askAI(prompt)
    const jsonMatch = raw.match(/\{[\s\S]*?\}/)
    if (!jsonMatch) throw new Error('No JSON found')
    const result = JSON.parse(jsonMatch[0].replace(/```json|```/g, '').trim())
    if (!result.min || !result.max) throw new Error('Incomplete response')
    return result
  } catch (err) {
    console.error('AI error, using calculated fallback:', err)
    return {
      min: Math.round(basePrice * 0.85),
      max: Math.round(basePrice * 1.2),
      currency: profile?.currency || 'USD',
      hourlyEquivalent: Math.round(adjustedRate),
      estimatedHours: Math.round(estimatedHours),
      reasoning: `Estimación calculada: ${Math.round(estimatedHours)} horas × $${Math.round(adjustedRate)}/hora con complejidad ${complexityLabel}${isInternationalClient ? ' — tarifa ajustada por cliente internacional' : ''}.`
    }
  }
}

export const generateQuoteDocument = async ({ form, profile, user }) => {
  const totalWeeks = form.phases.reduce((acc, p) => acc + (parseInt(p.weeks) || 0), 0)
  const price = form.pricingType === 'fixed'
    ? `${form.currency} ${form.fixedPrice}`
    : `${form.currency} ${parseFloat(form.hourlyRate) * parseFloat(form.estimatedHours)} (${form.estimatedHours}h × ${form.hourlyRate}/h)`

  const projectName = form.projectName || 'el proyecto'

  const prompt = `Eres un redactor profesional de propuestas técnicas para proyectos de software freelance.

REGLAS DE FORMATO OBLIGATORIAS:
1. Cada sección empieza con ## seguido de UN ESPACIO y el título completo en UNA SOLA LÍNEA
2. Después del título va un salto de línea y luego el contenido
3. Los precios se escriben juntos en la misma línea: "USD ${form.fixedPrice || '0'}" — nunca separar el número
4. Los saludos llevan espacio: "Estimado Sr. X" o "Estimada Sra. X" — nunca "EstimadoSr."
5. El nombre del proyecto se menciona tal cual, sin convertirlo en ítem de lista

FORMATO CORRECTO:
## Introducción
Estimado Sr. García,

## Descripción del Proyecto
El proyecto consiste en...

FORMATO INCORRECTO (nunca hagas esto):
## Descripción del
Proyecto
EstimadoSr. García,
El precio es USD
3499

DATOS:

Freelancer: ${profile?.name} | ${profile?.specialty} | ${profile?.experience} años exp. | ${profile?.country}
Email: ${user?.email || profile?.email} | Portafolio: ${profile?.portfolio || 'No especificado'}

Cliente: ${form.clientName} | ${form.clientCompany || ''} | ${form.clientEmail} | ${form.clientCountry}

Proyecto: "${projectName}"
Descripción: ${form.projectDescription}
Objetivo: ${form.projectGoal}
Problema que resuelve: ${form.projectProblem}
Público objetivo: ${form.projectAudience}

Alcance: ${form.selectedScope.join(', ')}
Tecnologías: ${[...form.selectedTech, form.customTech].filter(Boolean).join(', ')}
Entregables: ${form.deliverables}

Cronograma:
${form.phases.map(p => `- ${p.name}: ${p.weeks} semana(s)`).join('\n')}
Total: ${totalWeeks} semanas

Precio total: ${price}
Condiciones: ${form.conditions}

SECCIONES (genera exactamente estas, en este orden):

## Introducción
[Saludo formal al cliente. Preséntate como ${profile?.name}.]

## Descripción del Proyecto
[2-3 párrafos describiendo el proyecto profesionalmente.]

## Alcance del Trabajo
[Lista con guiones (-) de servicios incluidos.]

## Tecnologías Utilizadas
[Lista con guiones (-) de tecnologías y su uso.]

## Entregables
[Lista con guiones (-) de entregables para el cliente.]

## Cronograma
[Lista con guiones (-) de fases. Última línea: "Total estimado: ${totalWeeks} semanas"]

## Inversión
[Párrafo mencionando el precio ${price} en una sola oración continua sin partir el número.]

## Condiciones Generales
[Lista con guiones (-) de condiciones.]

## Próximos Pasos
[Lista numerada de acciones para el cliente.]

REGLAS ADICIONALES:
- NO uses tablas, NO uses |, NO uses ===, NO uses ---
- USA solo texto, párrafos y listas con - o números
- Después de CADA ## título hay obligatoriamente un salto de línea
`

  const raw = await askAI(prompt)
  console.log('[quoteAI] raw output:', raw)

  // Reparar el output antes de guardarlo en Firestore
  // repairContent une títulos partidos, corrige "EstimadoSr.", une "USD\n3499", etc.
  const repaired = repairContent(raw)

  return repaired
}