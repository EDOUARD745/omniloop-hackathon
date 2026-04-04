export default function SkeletonChart() {
  return (
    <div className="skeleton-chart" aria-hidden="true">
      <div className="skeleton-chart-title" />
      <div className="skeleton-chart-area">
        <div className="skeleton-chart-bars">
          {[45, 62, 38, 70, 55, 48, 65, 58, 42, 72, 60, 50].map((h, i) => (
            <div key={i} className="skeleton-chart-bar" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
