const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const SERVICE_ICON_OPTIONS = [
  { value: 'passport', label: 'Passport' },
  { value: 'id-card', label: 'ID Card' },
  { value: 'id-card-check', label: 'ID Card (Verified)' },
  { value: 'fingerprint', label: 'Fingerprint' },
  { value: 'hard-hat', label: 'Hard Hat' },
  { value: 'heart-pulse', label: 'Heart / Medical' },
  { value: 'briefcase', label: 'Briefcase' },
  { value: 'default', label: 'Default (Document)' },
]

function PassportIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="2.5" width="14" height="19" rx="2" />
      <circle cx="9.5" cy="8" r="1.6" />
      <line x1="13" y1="7" x2="16.5" y2="7" />
      <line x1="13" y1="9" x2="16.5" y2="9" />
      <line x1="7.5" y1="13" x2="16.5" y2="13" />
      <line x1="7.5" y1="16.5" x2="14" y2="16.5" />
    </svg>
  )
}

function IdCardIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8" cy="12" r="2.1" />
      <line x1="13" y1="10" x2="18" y2="10" />
      <line x1="13" y1="13" x2="18" y2="13" />
      <line x1="5.5" y1="16.3" x2="10.5" y2="16.3" />
    </svg>
  )
}

function IdCardCheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8" cy="11.5" r="2" />
      <line x1="13" y1="9.5" x2="18" y2="9.5" />
      <line x1="5.5" y1="15.8" x2="10.5" y2="15.8" />
      <path d="M12.5 15.5l1.4 1.4 2.6-2.6" />
    </svg>
  )
}

function FingerprintIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3a7 7 0 0 1 7 7c0 3.5-.8 6-1.6 8.2" />
      <path d="M9 20.5c1-2.6 1.5-5.3 1.5-8 a1.5 1.5 0 0 1 3 0c0 1.4-.15 2.8-.4 4.1" />
      <path d="M6.3 18.5c.9-2.2 1.4-4.6 1.4-7a4.3 4.3 0 0 1 8.6 0c0 .9-.05 1.7-.15 2.5" />
      <path d="M4.2 15.4c.5-1.6.8-3.3.8-5a7 7 0 0 1 2-4.9" />
      <path d="M14 8.4a2.5 2.5 0 0 1 2.4 2.5c0 2.5-.3 4.9-.9 7.1" />
    </svg>
  )
}

function HardHatIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 15.5a8 8 0 0 1 16 0" />
      <rect x="2.5" y="15.5" width="19" height="2.6" rx="1.2" />
      <line x1="12" y1="4.5" x2="12" y2="7.5" />
      <path d="M9.5 7.8a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  )
}

function HeartPulseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20.2s-7.6-4.6-9.7-9.4C1 7.3 3 4.2 6.3 4c2-.1 3.4 1 4.7 2.6 .3.4.9.4 1.2 0C13.5 5 14.9 3.9 16.9 4c3.3.2 5.3 3.3 4 6.8C18.8 15.6 12 20.2 12 20.2Z" />
      <path d="M6 12h2.3l1.2-2.4L11 14l1.4-3.2h1.4l1 1.6h2" />
    </svg>
  )
}

function BriefcaseIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="8" width="19" height="12" rx="2" />
      <path d="M8.5 8V6a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 6v2" />
      <line x1="2.5" y1="13.2" x2="21.5" y2="13.2" />
      <line x1="11" y1="12.5" x2="13" y2="12.5" />
    </svg>
  )
}

function DocumentIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 2.5h7l4 4v14a1 1 0 0 1-1 1h-10a1 1 0 0 1-1-1v-17a1 1 0 0 1 1-1Z" />
      <path d="M13.5 2.5v4h4" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
      <line x1="8.5" y1="15.5" x2="15.5" y2="15.5" />
    </svg>
  )
}

const serviceIconMap = {
  passport: PassportIcon,
  'id-card': IdCardIcon,
  'id-card-check': IdCardCheckIcon,
  fingerprint: FingerprintIcon,
  'hard-hat': HardHatIcon,
  'heart-pulse': HeartPulseIcon,
  briefcase: BriefcaseIcon,
  default: DocumentIcon,
}

function isValidUrl(source) {
  if (!source || typeof source !== 'string') return false
  try {
    const url = new URL(source)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function ServiceIcon({ service, className = '' }) {
  if (isValidUrl(service?.logoUrl)) {
    return <img className={className} src={service.logoUrl} alt={service.name} />
  }
  const Icon = serviceIconMap[service?.icon] || serviceIconMap.default
  return <Icon className={className} />
}

export function LocationIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21.5s-6.75-6.13-6.75-11A6.75 6.75 0 0 1 12 3.75a6.75 6.75 0 0 1 6.75 6.75c0 4.87-6.75 11-6.75 11Z" />
      <circle cx="12" cy="10.5" r="2.4" />
    </svg>
  )
}

export function ExternalLinkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5H5a1.5 1.5 0 0 0-1.5 1.5V19A1.5 1.5 0 0 0 5 20.5h12.5A1.5 1.5 0 0 0 19 19v-4" />
      <path d="M14 4h6v6" />
      <line x1="20" y1="4" x2="11" y2="13" />
    </svg>
  )
}

export function PhoneIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5.3 3.5h2.9l1.4 4.3-2 1.6c.9 2.4 2.9 4.4 5.3 5.3l1.6-2 4.3 1.4v2.9c0 1-.85 1.75-1.85 1.6-4-.6-7.8-2.5-10.6-5.3C3.4 11.5 1.5 7.7.9 3.7c-.15-1 .6-1.85 1.6-1.85Z" />
    </svg>
  )
}

export function EnvelopeIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M3 6.5l9 6.5 9-6.5" />
    </svg>
  )
}

export function CalendarIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="4.5" width="18" height="16" rx="2" />
      <line x1="3" y1="9.5" x2="21" y2="9.5" />
      <line x1="8" y1="2.5" x2="8" y2="6.5" />
      <line x1="16" y1="2.5" x2="16" y2="6.5" />
      <path d="M8.3 14.2l1.9 1.9 3.5-4" />
    </svg>
  )
}

export function UsersIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8" r="3.3" />
      <path d="M2.7 19.5c0-3.4 2.8-5.8 6.3-5.8s6.3 2.4 6.3 5.8" />
      <circle cx="17.3" cy="9" r="2.5" />
      <path d="M15.5 13.9c2.7.4 4.5 2.3 4.5 5" />
    </svg>
  )
}

export function CheckCircleIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9.2" />
      <path d="M8 12.3l2.6 2.6 5.4-5.6" />
    </svg>
  )
}
