import { imageConfig } from '../config/siteConfig'

export function ImagePlaceholder({ name, source: configuredSource, alt, className = '', children }) {
  const source = isValidImageSource(configuredSource) ? configuredSource : imageConfig[name]

  if (name === 'logo') {
    console.info('[Public logo diagnostic]', {
      firestoreLogoUrl: configuredSource,
      finalLogoUrl: source || 'local-placeholder',
    })
  }

  if (source) {
    return <img className={className} src={source} alt={alt} />
  }

  return (
    <div className={`image-placeholder ${className}`} role="img" aria-label={alt}>
      {children}
    </div>
  )
}

function isValidImageSource(source) {
  if (!source || typeof source !== 'string') return false
  try {
    const url = new URL(source)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}