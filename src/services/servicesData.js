import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from 'firebase/firestore'
import { publicDb } from '../firebase/firebaseConfig'

function sortByDisplayOrder(list) {
  return [...list].sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
}

export async function loadActiveServices() {
  if (!publicDb) return []
  const snapshot = await getDocs(query(collection(publicDb, 'services'), where('status', '==', 'active')))
  return sortByDisplayOrder(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))
}

export async function loadServiceBySlug(slug) {
  if (!publicDb) return null
  const snapshot = await getDocs(query(collection(publicDb, 'services'), where('slug', '==', slug), where('status', '==', 'active')))
  if (snapshot.empty) return null
  const item = snapshot.docs[0]
  return { id: item.id, ...item.data() }
}

export async function loadServiceForm(serviceId) {
  if (!publicDb || !serviceId) return []
  const snapshot = await getDoc(doc(publicDb, 'serviceForms', serviceId))
  if (!snapshot.exists()) return []
  const fields = snapshot.data().fields || []
  return sortByDisplayOrder(fields)
}

export function subscribeToServices(onChange, onError) {
  if (!publicDb) { onChange([]); return () => {} }
  const servicesQuery = query(collection(publicDb, 'services'), where('status', '==', 'active'))
  return onSnapshot(
    servicesQuery,
    (snapshot) => onChange(sortByDisplayOrder(snapshot.docs.map((item) => ({ id: item.id, ...item.data() })))),
    (error) => onError?.(error),
  )
}

export function subscribeToServiceBySlug(slug, onChange, onError) {
  if (!publicDb || !slug) { onChange(null); return () => {} }
  const serviceQuery = query(collection(publicDb, 'services'), where('slug', '==', slug), where('status', '==', 'active'))
  return onSnapshot(
    serviceQuery,
    (snapshot) => {
      if (snapshot.empty) { onChange(null); return }
      const item = snapshot.docs[0]
      onChange({ id: item.id, ...item.data() })
    },
    (error) => onError?.(error),
  )
}

export function subscribeToServiceForm(serviceId, onChange, onError) {
  if (!publicDb || !serviceId) { onChange([]); return () => {} }
  return onSnapshot(
    doc(publicDb, 'serviceForms', serviceId),
    (snapshot) => onChange(sortByDisplayOrder(snapshot.exists() ? (snapshot.data().fields || []) : [])),
    (error) => onError?.(error),
  )
}
