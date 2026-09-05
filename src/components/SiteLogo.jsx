import { ImagePlaceholder } from './ImagePlaceholder'
import { useSiteSettings } from '../context/SiteSettingsContext'

export function SiteLogo({ className = 'logo-placeholder', alt = 'Jenisha Online Service logo' }) {
  const { logoUrl } = useSiteSettings()

  return (
    <ImagePlaceholder name="logo" source={logoUrl} alt={alt} className={className}>
      <span className="logo-mark">J</span>
      <span className="logo-word">JENISHA</span>
      <span className="logo-caption">ONLINE SERVICE</span>
    </ImagePlaceholder>
  )
}
