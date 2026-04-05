import { repairContent } from './repairContent'

const cleanMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^[-*]{3,}$/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/Ø=\S+/g, '')
    .replace(/[^\x00-\xFF]/g, '')
    .trim()
}

const parseMarkdownTable = (text) => {
  const lines = text.split('\n').filter(l => l.trim().startsWith('|'))
  if (lines.length < 2) return null
  const rows = lines
    .filter(l => !l.match(/^\|[-\s|]+\|$/))
    .map(l => l.split('|').filter(Boolean).map(cell => cleanMarkdown(cell.trim())))
  return rows
}

export const generatePDF = async (quote) => {
  const { default: jsPDF } = await import('jspdf')
  const pdf = new jsPDF({ unit: 'mm', format: 'a4' })

  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 18
  const contentWidth = pageWidth - margin * 2
  let y = 0

  const checkPage = (needed = 10) => {
    if (y + needed > pageHeight - 15) {
      pdf.addPage()
      y = 20
    }
  }

  const writeLine = (text, opts = {}) => {
    const { fontSize = 10, bold = false, color = [40, 40, 40], indent = 0, lineHeight = 1.4 } = opts
    pdf.setFontSize(fontSize)
    pdf.setFont('helvetica', bold ? 'bold' : 'normal')
    pdf.setTextColor(...color)
    const clean = cleanMarkdown(String(text || ''))
    if (!clean) return
    const lines = pdf.splitTextToSize(clean, contentWidth - indent)
    const lineH = fontSize * 0.352 * lineHeight
    checkPage(lines.length * lineH + 2)
    pdf.text(lines, margin + indent, y)
    y += lines.length * lineH + 1
  }

  const writeSection = (title) => {
    const cleanTitle = cleanMarkdown(title)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'bold')
    const titleLines = pdf.splitTextToSize(cleanTitle, contentWidth - 8)
    const lineH = 10 * 0.352 * 1.3
    const rectHeight = Math.max(8, titleLines.length * lineH + 5)
    checkPage(rectHeight + 8)
    y += 4
    pdf.setFillColor(30, 58, 95)
    pdf.roundedRect(margin, y, contentWidth, rectHeight, 1.5, 1.5, 'F')
    pdf.setTextColor(255, 255, 255)
    const blockH = titleLines.length * lineH
    const startY = y + (rectHeight - blockH) / 2 + lineH * 0.75
    titleLines.forEach((line, idx) => {
      pdf.text(line, margin + 4, startY + idx * lineH)
    })
    y += rectHeight + 5
  }

  const writeTable = (rows) => {
    if (!rows || rows.length === 0) return
    const cols = rows[0].length
    const colWidth = contentWidth / cols
    const rowH = 7
    rows.forEach((row, ri) => {
      checkPage(rowH + 2)
      if (ri === 0) {
        pdf.setFillColor(50, 80, 130)
        pdf.rect(margin, y, contentWidth, rowH, 'F')
        pdf.setTextColor(255, 255, 255)
        pdf.setFont('helvetica', 'bold')
      } else {
        pdf.setFillColor(ri % 2 === 0 ? 245 : 255, ri % 2 === 0 ? 247 : 255, ri % 2 === 0 ? 250 : 255)
        pdf.rect(margin, y, contentWidth, rowH, 'F')
        pdf.setTextColor(40, 40, 40)
        pdf.setFont('helvetica', 'normal')
      }
      pdf.setFontSize(9)
      row.forEach((cell, ci) => {
        const cellText = pdf.splitTextToSize(String(cell), colWidth - 4)
        pdf.text(cellText[0] || '', margin + ci * colWidth + 2, y + 4.8)
      })
      pdf.setDrawColor(200, 210, 220)
      pdf.rect(margin, y, contentWidth, rowH)
      y += rowH
    })
    y += 3
  }

  // ── HEADER ──
  pdf.setFillColor(20, 45, 85)
  pdf.rect(0, 0, pageWidth, 35, 'F')
  pdf.setFillColor(4, 120, 87)
  pdf.rect(0, 35, pageWidth, 2, 'F')
  pdf.setFontSize(18)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(255, 255, 255)
  pdf.text('PRESUPUESTO DEL PROYECTO', margin, 16)
  pdf.setFontSize(9)
  pdf.setFont('helvetica', 'normal')
  pdf.setTextColor(138, 173, 212)
  pdf.text('Generated with Zentory Dev', margin, 26)
  const date = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  pdf.setFontSize(8)
  pdf.setTextColor(107, 143, 181)
  pdf.text(date, pageWidth - margin, 16, { align: 'right' })
  pdf.text(`Ref: ${(quote.id || '').slice(0, 8).toUpperCase()}`, pageWidth - margin, 24, { align: 'right' })

  y = 45

  // ── INFO GENERAL ──
  writeSection('Información General')
  writeLine(`Freelancer: ${quote.freelancerProfile?.name || ''}`, { bold: true })
  writeLine(`Email: ${quote.freelancerProfile?.email || ''}`)
  writeLine(`Especialidad: ${quote.freelancerProfile?.specialty || ''}`)
  if (quote.freelancerProfile?.portfolio) writeLine(`Portafolio: ${quote.freelancerProfile.portfolio}`)
  y += 3
  writeLine(`Cliente: ${quote.clientName || ''} ${quote.clientCompany ? '— ' + quote.clientCompany : ''}`, { bold: true })
  if (quote.clientEmail) writeLine(`Email: ${quote.clientEmail}`)
  if (quote.clientCountry) writeLine(`País: ${quote.clientCountry}`)

  // ── CONTENIDO IA ──
  if (quote.generatedContent) {
    // repairContent une títulos partidos Y repara listas pegadas
    const repairedContent = repairContent(quote.generatedContent)

    const sections = repairedContent
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
      .filter(s => s.title)

    for (const section of sections) {
      writeSection(section.title)
      const bodyLines = section.body.split('\n')
      let tableBuffer = []
      let inTable = false

      for (const line of bodyLines) {
        if (line.trim().startsWith('|')) {
          inTable = true
          tableBuffer.push(line)
          continue
        }
        if (inTable && !line.trim().startsWith('|')) {
          const rows = parseMarkdownTable(tableBuffer.join('\n'))
          if (rows) writeTable(rows)
          tableBuffer = []
          inTable = false
        }
        if (line.match(/^-{3,}$/)) {
          y += 2
          pdf.setDrawColor(200, 210, 220)
          pdf.line(margin, y, margin + contentWidth, y)
          y += 4
          continue
        }
        if (line.trim() === '') { y += 1.5; continue }
        writeLine(line, { fontSize: 10 })
      }

      if (inTable && tableBuffer.length > 0) {
        const rows = parseMarkdownTable(tableBuffer.join('\n'))
        if (rows) writeTable(rows)
      }
      y += 2
    }
  }

  // ── PRECIO ──
  checkPage(30)
  y += 4
  writeSection('Inversión Total')
  y += 4
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.setTextColor(4, 120, 87)
  const priceText = `${quote.currency} ${quote.fixedPrice
    ? parseFloat(quote.fixedPrice).toLocaleString()
    : (parseFloat(quote.hourlyRate || 0) * parseFloat(quote.estimatedHours || 0)).toLocaleString()}`
  pdf.text(priceText, margin, y)
  y += 8

  // ── FOOTER ──
  const totalPages = pdf.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i)
    pdf.setFillColor(20, 45, 85)
    pdf.rect(0, pageHeight - 10, pageWidth, 10, 'F')
    pdf.setFontSize(7)
    pdf.setFont('helvetica', 'normal')
    pdf.setTextColor(160, 185, 215)
    pdf.text('Zentory Dev — Cognetix Innovation', margin, pageHeight - 4)
    pdf.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 4, { align: 'right' })
  }

  pdf.save(`presupuesto-${(quote.projectName || 'zentory').toLowerCase().replace(/\s+/g, '-')}.pdf`)
}