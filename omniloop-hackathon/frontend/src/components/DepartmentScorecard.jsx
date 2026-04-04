import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEPARTMENTS } from '../data/departments'

function TrendArrow({ delta }) {
  if (delta > 0) {
    return (
      <span className="scorecard-trend scorecard-trend-up" title={`+${delta} pts vs trimestre précédent`}>
        ↑ {delta}
      </span>
    )
  }
  if (delta < 0) {
    return (
      <span className="scorecard-trend scorecard-trend-down" title={`${delta} pts vs trimestre précédent`}>
        ↓ {Math.abs(delta)}
      </span>
    )
  }
  return (
    <span className="scorecard-trend scorecard-trend-neutral" title="Stable vs trimestre précédent">
      →
    </span>
  )
}

function RankBadge({ rank }) {
  const isTop3 = rank <= 3
  return (
    <span className={`scorecard-rank ${isTop3 ? 'scorecard-rank-top3' : ''}`}>
      #{rank}
    </span>
  )
}

export default function DepartmentScorecard() {
  const [sentTo, setSentTo] = useState(new Set())
  const [toast, setToast] = useState(null)

  const handleSendReport = (deptId, deptName) => {
    setSentTo((prev) => new Set(prev).add(deptId))
    setToast({ message: `Rapport envoyé à ${deptName}` })
    setTimeout(() => setToast(null), 2500)
  }

  return (
    <div className="scorecard-page">
      <div className="scorecard-header">
        <div>
          <h1 className="scorecard-title">Département Scorecard</h1>
          <p className="scorecard-subtitle">
            Classement des départements par score économie circulaire (0-100). Basé sur le % d'actifs réutilisés,
            le % d'uniformes recyclés et le taux d'interception des achats.
          </p>
        </div>
      </div>

      <div className="card scorecard-card">
        <div className="scorecard-leaderboard">
          <div className="scorecard-table-header">
            <span className="scorecard-col-rank">Rang</span>
            <span className="scorecard-col-name">Département</span>
            <span className="scorecard-col-score">Score</span>
            <span className="scorecard-col-trend">Tendance</span>
            <span className="scorecard-col-action">Action</span>
          </div>

          {DEPARTMENTS.map((dept, index) => {
            const rank = index + 1
            const delta = dept.score - dept.scoreLastQuarter
            const isSent = sentTo.has(dept.id)

            return (
              <motion.div
                key={dept.id}
                className="scorecard-row"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
              >
                <div className="scorecard-col-rank">
                  <RankBadge rank={rank} />
                </div>
                <div className="scorecard-col-name">
                  <span className="scorecard-dept-name">{dept.name}</span>
                </div>
                <div className="scorecard-col-score">
                  <div className="scorecard-bar-wrap">
                    <div
                      className="scorecard-bar-fill"
                      style={{ width: `${dept.score}%` }}
                    />
                    <span className="scorecard-score-value">{dept.score}</span>
                  </div>
                </div>
                <div className="scorecard-col-trend">
                  <TrendArrow delta={delta} />
                </div>
                <div className="scorecard-col-action">
                  <button
                    className={`scorecard-btn-send ${isSent ? 'scorecard-btn-sent' : ''} secondary`}
                    onClick={() => handleSendReport(dept.id, dept.name)}
                    disabled={isSent}
                  >
                    {isSent ? '✓ Envoyé' : 'Envoyer le rapport au département'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            className="scorecard-toast"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            ✓ {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="scorecard-legend card">
        <h4 className="scorecard-legend-title">Calcul du score</h4>
        <ul className="scorecard-legend-list">
          <li><strong>40%</strong> — % d'actifs offboardés réutilisés</li>
          <li><strong>35%</strong> — % d'uniformes recyclés</li>
          <li><strong>25%</strong> — Taux d'interception des achats (réaffectation vs neuf)</li>
        </ul>
      </div>
    </div>
  )
}
