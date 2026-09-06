const apiBaseUrl = import.meta.env.VITE_HOSTINGER_API_BASE_URL || ''

export async function uploadSubmissionImage({ serviceId, submissionId, fieldKey, file }) {
  if (!apiBaseUrl) throw new Error('Unable to submit right now. Please try again shortly.')

  const formData = new FormData()
  formData.append('serviceId', serviceId)
  formData.append('submissionId', submissionId)
  formData.append('fieldKey', fieldKey)
  formData.append('file', file)

  let response
  try {
    response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/upload-submission-image.php`, {
      method: 'POST',
      body: formData,
    })
  } catch {
    throw new Error('Unable to submit right now. Please try again shortly.')
  }

  let result
  try { result = await response.json() } catch { throw new Error('Unable to submit right now. Please try again shortly.') }
  if (!response.ok || !result.success || !result.data?.publicUrl) {
    throw new Error(result?.message || 'Unable to submit right now. Please try again shortly.')
  }
  return { filename: result.data.filename, publicUrl: result.data.publicUrl }
}
