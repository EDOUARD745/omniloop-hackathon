export default function EmptyState({ icon, title, message, ctaLabel, onCta }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h4 className="empty-state-title">{title}</h4>
      <p className="empty-state-message">{message}</p>
      {ctaLabel && onCta && (
        <button className="empty-state-cta primary" onClick={onCta}>
          {ctaLabel}
        </button>
      )}
    </div>
  )
}
