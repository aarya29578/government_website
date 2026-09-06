import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const PDF_FONT_STACK = "'Noto Sans Devanagari', 'Noto Sans', 'Segoe UI', Arial, sans-serif"
const GOOGLE_FONT_HREF = 'https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600;700;800&family=Noto+Sans+Devanagari:wght@400;600;700;800&display=swap'
const CONTENT_WIDTH_PX = 700
const RENDER_SCALE = 2
const PAGE_MARGIN_PT = 36

let fontLoadPromise = null
function ensureUnicodeFont() {
  if (fontLoadPromise) return fontLoadPromise
  fontLoadPromise = (async () => {
    try {
      if (!document.getElementById('pdf-unicode-font')) {
        const link = document.createElement('link')
        link.id = 'pdf-unicode-font'
        link.rel = 'stylesheet'
        link.href = GOOGLE_FONT_HREF
        document.head.appendChild(link)
      }
      await Promise.all([
        document.fonts.load('400 16px "Noto Sans Devanagari"'),
        document.fonts.load('700 16px "Noto Sans Devanagari"'),
        document.fonts.load('400 16px "Noto Sans"'),
        document.fonts.load('700 16px "Noto Sans"'),
      ])
      await document.fonts.ready
    } catch {
      // Offline or font blocked: silently fall back to the system font stack.
    }
  })()
  return fontLoadPromise
}

function loadImageAsDataUrl(url, timeoutMs = 15000) {
  return new Promise((resolve) => {
    if (!url) { resolve(null); return }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    let settled = false
    const finish = (dataUrl) => { if (!settled) { settled = true; resolve(dataUrl) } }
    const timer = setTimeout(() => finish(null), timeoutMs)
    img.onload = () => {
      clearTimeout(timer)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth || img.width
        canvas.height = img.naturalHeight || img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        finish(canvas.toDataURL('image/jpeg', 0.92))
      } catch {
        finish(null)
      }
    }
    img.onerror = () => { clearTimeout(timer); finish(null) }
    img.src = url
  })
}

function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

function fieldLabelFor(field, key, language) {
  if (!field) return labelize(key)
  return (language === 'mr' && field.labelMr) || field.label || labelize(key)
}

function buildOrderedEntries(fields, formData, language) {
  const fieldByKey = Object.fromEntries((fields || []).map((field) => [field.key, field]))
  const seen = new Set()
  const entries = []

  ;(fields || []).forEach((field) => {
    if (!(field.key in formData)) return
    seen.add(field.key)
    const value = formData[field.key]
    const isImage = field.type === 'image' || Boolean(value && typeof value === 'object' && value.type === 'image')
    entries.push({ key: field.key, label: fieldLabelFor(field, field.key, language), value, isImage })
  })

  Object.keys(formData).forEach((key) => {
    if (seen.has(key)) return
    const value = formData[key]
    const isImage = Boolean(value && typeof value === 'object' && value.type === 'image')
    entries.push({ key, label: fieldLabelFor(fieldByKey[key], key, language), value, isImage })
  })

  return entries
}

function formatSubmittedDate(timestamp) {
  if (!timestamp?.toDate) return '—'
  return timestamp.toDate().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function formatFieldValue(value, t) {
  if (typeof value === 'boolean') return value ? t('common.yes') : t('common.no')
  if (value === undefined || value === null || value === '') return '—'
  return String(value)
}

function sanitizeFileNamePart(value) {
  const cleaned = (value || '')
    .toString()
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
  return cleaned || 'SERVICE'
}

function el(tag, styleText, text) {
  const node = document.createElement(tag)
  if (styleText) node.style.cssText = styleText
  if (text !== undefined) node.textContent = text
  return node
}

function buildHeaderNode({ serviceName, submittedDate, t }) {
  const wrap = el('div', 'padding:0 0 16px; border-bottom:2px solid #172d43;')
  wrap.appendChild(el('div', 'font-size:20px; font-weight:800; color:#172d43;', 'Jenisha Online Service'))
  wrap.appendChild(el('div', 'margin-top:4px; font-size:13px; font-weight:700; color:#ee9b1c; letter-spacing:.5px; text-transform:uppercase;', t('pdf.applicantApplication')))
  const metaWrap = el('div', 'margin-top:14px; display:flex; flex-direction:column; gap:4px;')
  const serviceRow = el('div', 'font-size:12px; color:#687582;')
  serviceRow.appendChild(document.createTextNode(`${t('pdf.serviceLabel')}: `))
  serviceRow.appendChild(el('strong', 'color:#172d43; font-size:14px;', serviceName))
  const dateRow = el('div', 'font-size:12px; color:#687582;')
  dateRow.appendChild(document.createTextNode(`${t('pdf.submittedLabel')}: `))
  dateRow.appendChild(el('strong', 'color:#172d43; font-size:14px;', submittedDate))
  metaWrap.appendChild(serviceRow)
  metaWrap.appendChild(dateRow)
  wrap.appendChild(metaWrap)
  return wrap
}

function buildSectionTitleNode(t) {
  return el('div', 'font-size:13px; font-weight:800; color:#172d43; text-transform:uppercase; letter-spacing:.5px; padding-bottom:6px; border-bottom:2px solid #172d43;', t('formsData.applicantInformation'))
}

function buildFieldNode(entry, t) {
  const wrap = el('div', 'padding:10px 0; border-bottom:1px solid #eef1f3;')
  wrap.appendChild(el('div', 'font-size:11px; font-weight:700; color:#687582; text-transform:uppercase; letter-spacing:.4px; margin-bottom:6px;', entry.label))
  if (entry.isImage) {
    if (entry.imageDataUrl) {
      const imgWrap = el('div', 'width:220px;')
      const img = document.createElement('img')
      img.src = entry.imageDataUrl
      img.style.cssText = 'display:block; max-width:220px; width:100%; height:auto; border:1px solid #d6e0e5; border-radius:4px;'
      imgWrap.appendChild(img)
      wrap.appendChild(imgWrap)
    } else {
      wrap.appendChild(el('div', 'font-size:12px; font-style:italic; color:#9aa5ad;', t('formsData.imageUnavailable')))
    }
  } else {
    wrap.appendChild(el('div', 'font-size:14px; font-weight:600; color:#172d43; white-space:pre-wrap; word-break:break-word;', formatFieldValue(entry.value, t)))
  }
  return wrap
}

function buildStatusNode(statusLabel, t) {
  const wrap = el('div', 'padding-top:6px; font-size:13px; color:#172d43;')
  wrap.appendChild(el('span', 'font-weight:700;', `${t('formsData.status')}: `))
  wrap.appendChild(el('span', 'font-weight:800; color:#ee9b1c;', statusLabel))
  return wrap
}

async function renderBlockToCanvas(node) {
  return html2canvas(node, { scale: RENDER_SCALE, useCORS: true, backgroundColor: '#ffffff' })
}

class PdfPageLayout {
  constructor(pdf, margin) {
    this.pdf = pdf
    this.margin = margin
    this.pageWidth = pdf.internal.pageSize.getWidth()
    this.pageHeight = pdf.internal.pageSize.getHeight()
    this.contentWidth = this.pageWidth - margin * 2
    this.maxY = this.pageHeight - margin
    this.cursorY = margin
    this.pageCount = 1
  }

  addSpacing(pt) { this.cursorY += pt }

  addCanvasBlock(canvas) {
    const heightPt = (canvas.height / canvas.width) * this.contentWidth
    if (heightPt > this.maxY - this.margin) { this.addSplitCanvasBlock(canvas); return }
    if (this.cursorY + heightPt > this.maxY && this.cursorY > this.margin) {
      this.pdf.addPage()
      this.pageCount += 1
      this.cursorY = this.margin
    }
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95)
    this.pdf.addImage(dataUrl, 'JPEG', this.margin, this.cursorY, this.contentWidth, heightPt)
    this.cursorY += heightPt
  }

  addSplitCanvasBlock(canvas) {
    const pageContentHeightPt = this.maxY - this.margin
    const pxPerPt = canvas.width / this.contentWidth
    const pageHeightPx = pageContentHeightPt * pxPerPt
    let sourceY = 0
    let first = true
    while (sourceY < canvas.height) {
      const sliceHeightPx = Math.min(pageHeightPx, canvas.height - sourceY)
      if (!first || this.cursorY > this.margin) {
        this.pdf.addPage()
        this.pageCount += 1
        this.cursorY = this.margin
      }
      const sliceCanvas = document.createElement('canvas')
      sliceCanvas.width = canvas.width
      sliceCanvas.height = sliceHeightPx
      sliceCanvas.getContext('2d').drawImage(canvas, 0, sourceY, canvas.width, sliceHeightPx, 0, 0, canvas.width, sliceHeightPx)
      const sliceHeightPt = sliceHeightPx / pxPerPt
      this.pdf.addImage(sliceCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', this.margin, this.cursorY, this.contentWidth, sliceHeightPt)
      this.cursorY += sliceHeightPt
      sourceY += sliceHeightPx
      first = false
    }
  }

  finish() {
    for (let page = 1; page <= this.pageCount; page += 1) {
      this.pdf.setPage(page)
      this.pdf.setFontSize(8)
      this.pdf.setTextColor(140)
      this.pdf.text(`Page ${page} of ${this.pageCount}`, this.pageWidth - this.margin, this.pageHeight - 14, { align: 'right' })
    }
  }
}

export async function generateApplicantPdf({ submission, fields, language, t }) {
  if (!submission) throw new Error('Missing submission.')

  await ensureUnicodeFont()

  const serviceName = submission.serviceName || t('pdf.fallbackServiceName')
  const submittedDate = formatSubmittedDate(submission.submittedAt)
  const statusLabel = t(`status.${submission.status}`) || submission.status || '—'
  const entries = buildOrderedEntries(fields, submission.formData || {}, language)

  const imageEntries = entries.filter((entry) => entry.isImage)
  const resolvedDataUrls = await Promise.all(imageEntries.map((entry) => loadImageAsDataUrl(entry.value?.url)))
  imageEntries.forEach((entry, index) => { entry.imageDataUrl = resolvedDataUrls[index] })

  const stage = document.createElement('div')
  stage.style.cssText = `position:fixed; left:-10000px; top:0; width:${CONTENT_WIDTH_PX}px; background:#fff; font-family:${PDF_FONT_STACK};`
  document.body.appendChild(stage)

  try {
    const renderBlock = async (node) => {
      stage.appendChild(node)
      const canvas = await renderBlockToCanvas(node)
      stage.removeChild(node)
      return canvas
    }

    const headerCanvas = await renderBlock(buildHeaderNode({ serviceName, submittedDate, t }))
    const sectionTitleCanvas = await renderBlock(buildSectionTitleNode(t))
    const fieldCanvases = []
    for (const entry of entries) {
      // eslint-disable-next-line no-await-in-loop
      const canvas = await renderBlock(buildFieldNode(entry, t))
      fieldCanvases.push(canvas)
    }
    const statusCanvas = await renderBlock(buildStatusNode(statusLabel, t))

    const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
    const layout = new PdfPageLayout(pdf, PAGE_MARGIN_PT)
    layout.addCanvasBlock(headerCanvas)
    layout.addSpacing(12)
    layout.addCanvasBlock(sectionTitleCanvas)
    layout.addSpacing(4)
    fieldCanvases.forEach((canvas) => layout.addCanvasBlock(canvas))
    layout.addSpacing(10)
    layout.addCanvasBlock(statusCanvas)
    layout.finish()

    const filename = `${sanitizeFileNamePart(serviceName)}_Application_${submission.id}.pdf`
    pdf.save(filename)
  } finally {
    document.body.removeChild(stage)
  }
}
