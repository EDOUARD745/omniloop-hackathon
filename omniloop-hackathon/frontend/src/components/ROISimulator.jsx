import { useState, useMemo } from 'react'
import AnimatedCounter from './AnimatedCounter'

const RECOVERY_RATE = 0.65 // 65% of equipment value saved by reusing
const CO2_PER_DEPARTURE_KG = 58 // kg CO2 avoided per departure (equipment + textile)

function getSubscriptionMonthly(employees) {
  if (employees < 2000) return 399
  if (employees < 5000) return 599
  if (employees < 15000) return 899
  return 1299
}

export default function ROISimulator() {
  return (
    <div className="roi-simulator">
      <h2 className="roi-title">Simulateur ROI</h2>
      <p className="roi-subtitle">
        Estimez les économies et l'impact de OmniLoop pour votre entreprise
      </p>

      <ROISliders />
    </div>
  )
}

function ROISliders() {
  const [employees, setEmployees] = useState(5000)
  const [turnover, setTurnover] = useState(6)
  const [equipmentValue, setEquipmentValue] = useState(1500)

  const results = useMemo(() => {
    const departures = Math.round(employees * (turnover / 100))
    const annualSavings = Math.round(departures * equipmentValue * RECOVERY_RATE)
    const co2Avoided = departures * CO2_PER_DEPARTURE_KG
    const subscriptionMonthly = getSubscriptionMonthly(employees)
    const subscriptionAnnual = subscriptionMonthly * 12
    const netSavings = annualSavings - subscriptionAnnual
    const netROI = subscriptionAnnual > 0
      ? Math.round(((annualSavings - subscriptionAnnual) / subscriptionAnnual) * 100)
      : 0
    const autofinanceMonths = annualSavings > 0
      ? (subscriptionAnnual / (annualSavings / 12))
      : Infinity

    return {
      departures,
      annualSavings,
      co2Avoided,
      subscriptionMonthly,
      subscriptionAnnual,
      netSavings,
      netROI,
      autofinanceMonths,
    }
  }, [employees, turnover, equipmentValue])

  return (
    <div className="roi-content">
      <div className="roi-sliders card">
        <div className="roi-slider-group">
          <label className="roi-slider-label">
            Nombre d'employés
            <span className="roi-slider-value">{employees.toLocaleString('fr-FR')}</span>
          </label>
          <input
            type="range"
            min={500}
            max={50000}
            step={500}
            value={employees}
            onChange={(e) => setEmployees(Number(e.target.value))}
            className="roi-slider"
          />
        </div>

        <div className="roi-slider-group">
          <label className="roi-slider-label">
            Taux de turnover annuel
            <span className="roi-slider-value">{turnover}%</span>
          </label>
          <input
            type="range"
            min={2}
            max={15}
            step={0.5}
            value={turnover}
            onChange={(e) => setTurnover(Number(e.target.value))}
            className="roi-slider"
          />
        </div>

        <div className="roi-slider-group">
          <label className="roi-slider-label">
            Valeur équipement moyen / employé
            <span className="roi-slider-value">{equipmentValue.toLocaleString('fr-FR')} €</span>
          </label>
          <input
            type="range"
            min={500}
            max={3000}
            step={100}
            value={equipmentValue}
            onChange={(e) => setEquipmentValue(Number(e.target.value))}
            className="roi-slider"
          />
        </div>
      </div>

      <div className="roi-metrics">
        <div className="roi-metric-card">
          <div className="roi-metric-value">
            <AnimatedCounter value={results.annualSavings} suffix=" €" duration={0.8} />
          </div>
          <div className="roi-metric-label">Économies annuelles estimées</div>
        </div>
        <div className="roi-metric-card">
          <div className="roi-metric-value">
            <AnimatedCounter value={Math.round(results.co2Avoided)} suffix=" kg" duration={0.8} />
          </div>
          <div className="roi-metric-label">CO₂ évité</div>
        </div>
        <div className="roi-metric-card">
          <div className="roi-metric-value">
            <AnimatedCounter value={results.subscriptionAnnual} suffix=" €" duration={0.8} />
          </div>
          <div className="roi-metric-label">Abonnement OmniLoop / an</div>
        </div>
        <div className="roi-metric-card">
          <div className={`roi-metric-value ${results.netROI >= 0 ? 'roi-positive' : 'roi-negative'}`}>
            <AnimatedCounter
              value={results.netROI}
              prefix={results.netROI >= 0 ? '+' : ''}
              suffix="%"
              duration={0.8}
            />
          </div>
          <div className="roi-metric-label">ROI net</div>
        </div>
      </div>

      <div className="roi-callout">
        <p className="roi-callout-text">
          Pour une entreprise de <strong>{employees.toLocaleString('fr-FR')} employés</strong>, OmniLoop
          s'autofinance en{' '}
          <strong>
            {results.autofinanceMonths <= 1
              ? "moins d'1 mois"
              : results.autofinanceMonths < 12
              ? `${Math.ceil(results.autofinanceMonths)} mois`
              : results.autofinanceMonths === Infinity || results.annualSavings < results.subscriptionAnnual
              ? 'plus de 12 mois'
              : `${Math.ceil(results.autofinanceMonths)} mois`}
          </strong>
          .
        </p>
      </div>
    </div>
  )
}
