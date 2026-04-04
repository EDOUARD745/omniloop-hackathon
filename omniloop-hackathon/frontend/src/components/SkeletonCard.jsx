export default function SkeletonCard({ count = 1 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="skeleton-kpi-card" aria-hidden="true">
          <div className="skeleton-kpi-value" />
          <div className="skeleton-kpi-label" />
        </div>
      ))}
    </>
  )
}
