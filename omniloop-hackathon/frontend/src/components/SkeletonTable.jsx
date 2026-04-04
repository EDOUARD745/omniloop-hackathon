export default function SkeletonTable({ cols = 5, rows = 5 }) {
  return (
    <div className="skeleton-table-wrapper" aria-hidden="true">
      <table className="table skeleton-table">
        <thead>
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i}>
                <div className="skeleton-cell" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, rowIdx) => (
            <tr key={rowIdx}>
              {[...Array(cols)].map((_, colIdx) => (
                <td key={colIdx}>
                  <div className="skeleton-cell" style={{ width: colIdx === 0 ? '70%' : '50%' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
