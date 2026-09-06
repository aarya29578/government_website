import { adminConfig } from '../config/adminConfig'
import { getAuthenticatedUser } from '../firebase/auth'

export function validateImage(file) {
  if (!file) return 'images.errors.chooseFile'
  if (!adminConfig.allowedImageTypes.includes(file.type)) return 'images.errors.fileType'
  if (file.size > adminConfig.maxImageSize) return 'images.errors.fileSize'
  return ''
}

export async function uploadImage(file, type, onProgress) {
  const validationError = validateImage(file)
  if (validationError) throw new Error(validationError)
  if (!adminConfig.apiBaseUrl) throw new Error('images.errors.apiNotConfigured')
  const user = await getAuthenticatedUser()
  const idToken = await user.getIdToken()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)
  console.info('[Image upload diagnostic]', {
    fileExists: Boolean(file),
    isFile: typeof File !== 'undefined' && file instanceof File,
    name: file?.name,
    size: file?.size,
    mimeType: file?.type,
    formDataHasFile: formData.has('file'),
    formDataHasType: formData.has('type'),
  })

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('POST', `${adminConfig.apiBaseUrl.replace(/\/$/, '')}/upload-image.php`)
    request.setRequestHeader('Authorization', `Bearer ${idToken}`)
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    request.onload = () => {
      let response
      try { response = JSON.parse(request.responseText) } catch { reject(new Error('images.errors.invalidResponse')); return }
      console.info('[Image upload API response]', { success: response.success, message: response.message, filename: response.filename, publicUrl: response.publicUrl })
      if (request.status >= 200 && request.status < 300 && response.success && response.publicUrl) resolve(response)
      else reject(new Error(response.message || 'images.errors.uploadFailed'))
    }
    request.onerror = () => reject(new Error('images.errors.networkError'))
    request.send(formData)
  })
}
