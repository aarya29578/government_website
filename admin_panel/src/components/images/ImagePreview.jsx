export function ImagePreview({ label, url }) {
  return <div className="compact-preview"><span>{label}</span>{url ? <img src={url} alt={`${label} preview`} /> : <small>Not configured</small>}</div>
}
