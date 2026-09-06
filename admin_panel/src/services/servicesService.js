import {
  createService,
  deleteService as deleteServiceDoc,
  getServiceForm as getServiceFormDoc,
  listServices as listServicesDocs,
  saveServiceForm as saveServiceFormDoc,
  updateService as updateServiceDoc,
} from '../firebase/firestore'

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function sortByDisplayOrder(list) {
  return [...list].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
}

export async function loadServices() {
  const services = await listServicesDocs()
  return sortByDisplayOrder(services)
}

export async function addService(form, existingSlugs = []) {
  const baseSlug = slugify(form.name) || 'service'
  let slug = baseSlug
  let counter = 2
  while (existingSlugs.includes(slug)) { slug = `${baseSlug}-${counter}`; counter += 1 }
  return createService({
    name: form.name.trim(),
    slug,
    description: form.description.trim(),
    titleMr: (form.titleMr || '').trim(),
    descriptionMr: (form.descriptionMr || '').trim(),
    logoUrl: form.logoUrl || '',
    icon: form.icon || 'default',
    status: form.status,
    displayOrder: Number(form.displayOrder) || 0,
  })
}

export async function editService(serviceId, form) {
  await updateServiceDoc(serviceId, {
    name: form.name.trim(),
    description: form.description.trim(),
    titleMr: (form.titleMr || '').trim(),
    descriptionMr: (form.descriptionMr || '').trim(),
    logoUrl: form.logoUrl || '',
    icon: form.icon || 'default',
    status: form.status,
    displayOrder: Number(form.displayOrder) || 0,
  })
}

export async function setServiceStatus(serviceId, status) {
  await updateServiceDoc(serviceId, { status })
}

export async function deleteService(serviceId) {
  await deleteServiceDoc(serviceId)
}

export async function loadServiceForm(serviceId) {
  const fields = await getServiceFormDoc(serviceId)
  return sortByDisplayOrder(fields)
}

export async function saveServiceForm(serviceId, fields) {
  const ordered = fields.map((field, index) => ({ ...field, displayOrder: index + 1 }))
  await saveServiceFormDoc(serviceId, ordered)
  return ordered
}

export function moveField(fields, index, direction) {
  const targetIndex = index + direction
  if (targetIndex < 0 || targetIndex >= fields.length) return fields
  const next = [...fields]
  const temp = next[index]
  next[index] = next[targetIndex]
  next[targetIndex] = temp
  return next
}
