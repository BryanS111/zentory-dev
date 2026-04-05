// Une títulos ## que el modelo partió en dos líneas
// Ej: "## Descripción del\nProyecto" → "## Descripción del Proyecto"
const joinSplitTitles = (lines) => {
  const result = []
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const next = lines[i + 1] || ''
    const nextTrimmed = next.trim()

    if (
      line.match(/^##\s+\S/) &&
      nextTrimmed &&
      nextTrimmed.split(' ').length <= 3 &&
      !nextTrimmed.startsWith('-') &&
      !nextTrimmed.startsWith('#') &&
      !nextTrimmed.match(/^\d+\./) &&
      !nextTrimmed.match(/[,.:;]$/) &&
      !nextTrimmed.match(/^[A-ZÁÉÍÓÚÑ].*\s.*\s.*\s/)
    ) {
      result.push(line.trimEnd() + ' ' + nextTrimmed)
      i++
    } else {
      result.push(line)
    }
  }
  return result
}

// Repara ítems de lista pegados en la misma línea
// Ej: "- item A- item B" → "- item A\n- item B"
const repairListItems = (lines) => {
  const result = []
  for (const line of lines) {
    const fixedDash = line.replace(/(.+?)(- [A-ZÁÉÍÓÚÑ])/g, '$1\n$2')
    const fixedNum  = fixedDash.replace(/(.+?)(\d+\. [A-ZÁÉÍÓÚÑ])/g, '$1\n$2')
    if (fixedNum.includes('\n')) {
      result.push(...fixedNum.split('\n'))
    } else {
      result.push(fixedNum)
    }
  }
  return result
}

// FIX 1: "EstimadoSr." → "Estimado Sr."
// FIX 2: "USD\n3499" → "USD 3499" (número partido en línea nueva tras USD/precio)
// FIX 3: líneas que son solo un número suelto después de mención de precio → unir con la anterior
const repairInlineIssues = (text) => {
  return text
    // Espacio faltante después de "Estimado" pegado a nombre
    .replace(/\bEstimado([A-ZÁÉÍÓÚÑ])/g, 'Estimado $1')
    // Número suelto en línea propia después de "USD" al final de línea anterior
    // "USD\n3499" → "USD 3499"
    .replace(/(USD)\n(\d)/g, '$1 $2')
    // Precio partido: "de USD\n" seguido de número
    .replace(/(de USD)\s*\n\s*(\d)/g, '$1 $2')
    // Cualquier línea que termina en número de moneda y la siguiente es solo dígitos
    .replace(/(\$|USD|EUR)\s*\n\s*(\d[\d,. ]*)/g, '$1 $2')
}

export const repairContent = (raw) => {
  if (!raw) return ''

  // Paso 1: normalizar saltos de línea y espacio tras ##
  let text = raw
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/^##([^\s#])/gm, '## $1')

  // Paso 2: reparar issues inline (Estimado, USD partido)
  text = repairInlineIssues(text)

  // Paso 3: procesar línea por línea
  let lines = text.split('\n')
  lines = joinSplitTitles(lines)
  lines = repairListItems(lines)

  return lines.join('\n')
}

export const parseSections = (rawContent) => {
  if (!rawContent) return []
  const repaired = repairContent(rawContent)
  return repaired
    .split('\n')
    .reduce((acc, line) => {
      const trimmed = line.trim()
      if (/^##\s+\S/.test(trimmed)) {
        const title = trimmed.replace(/^##\s+/, '').trim()
        if (title) acc.push({ title, body: [] })
      } else if (acc.length > 0) {
        acc[acc.length - 1].body.push(line)
      }
      return acc
    }, [])
    .map(s => ({ title: s.title, body: s.body.join('\n').trim() }))
    .filter(s => s.title && s.title.length > 0)
}