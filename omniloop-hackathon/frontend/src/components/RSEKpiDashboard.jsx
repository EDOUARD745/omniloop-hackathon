import { useCallback, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AnimatedCounter from './AnimatedCounter'
import SkeletonCard from './SkeletonCard'
import SkeletonChart from './SkeletonChart'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { jsPDF } from 'jspdf'

// Données mensuelles réalistes pour une entreprise de 5000 employés (~4% turnover)
const RAW_DATA = [
  { month: 'Avr', co2: 1240, economies: 11200, equipments: 38, uniforms: 41 },
  { month: 'Mai', co2: 1310, economies: 11850, equipments: 42, uniforms: 38 },
  { month: 'Juin', co2: 1280, economies: 12100, equipments: 40, uniforms: 45 },
  { month: 'Juil', co2: 1420, economies: 12800, equipments: 45, uniforms: 48 },
  { month: 'Août', co2: 1180, economies: 10500, equipments: 35, uniforms: 36 },
  { month: 'Sept', co2: 1560, economies: 14200, equipments: 52, uniforms: 52 },
  { month: 'Oct', co2: 1680, economies: 15100, equipments: 55, uniforms: 58 },
  { month: 'Nov', co2: 1720, economies: 15800, equipments: 58, uniforms: 61 },
  { month: 'Déc', co2: 1650, economies: 14900, equipments: 52, uniforms: 55 },
  { month: 'Jan', co2: 1820, economies: 16400, equipments: 62, uniforms: 64 },
  { month: 'Fév', co2: 1780, economies: 16100, equipments: 59, uniforms: 62 },
  { month: 'Mar', co2: 1890, economies: 17200, equipments: 65, uniforms: 68 },
]

const max = (key) => Math.max(...RAW_DATA.map((d) => d[key]))
const MOCK_MONTHLY_DATA = RAW_DATA.map((d) => ({
  ...d,
  co2Norm: (d.co2 / max('co2')) * 100,
  economiesNorm: (d.economies / max('economies')) * 100,
  equipmentsNorm: (d.equipments / max('equipments')) * 100,
  uniformsNorm: (d.uniforms / max('uniforms')) * 100,
}))

const BRAND_PALETTE = {
  co2: '#00C896',
  economies: '#00a67d',
  equipments: '#00e6a8',
  uniforms: '#34d4a8',
}

export default function RSEKpiDashboard() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400)
    return () => clearTimeout(t)
  }, [])

  const totals = RAW_DATA.reduce(
    (acc, m) => ({
      co2: acc.co2 + m.co2,
      economies: acc.economies + m.economies,
      equipments: acc.equipments + m.equipments,
      uniforms: acc.uniforms + m.uniforms,
    }),
    { co2: 0, economies: 0, equipments: 0, uniforms: 0 }
  )

  const lastMonth = RAW_DATA[RAW_DATA.length - 1]

  const generateCSRDReport = useCallback(() => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(22)
    doc.setTextColor(0, 200, 150)
    doc.text('Rapport CSRD - OmniLoop', 20, 25)

    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} - Entreprise 5000 employés`, 20, 35)

    doc.setDrawColor(0, 200, 150)
    doc.setLineWidth(0.5)
    doc.line(20, 42, pageWidth - 20, 42)

    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Synthèse des indicateurs RSE (12 derniers mois)', 20, 55)

    const rows = [
      ['Indicateur', 'Total annuel', 'Mois dernier'],
      ['CO₂ évité (kg)', `${totals.co2.toLocaleString('fr-FR')}`, `${lastMonth.co2.toLocaleString('fr-FR')}`],
      ['Économies générées (€)', `${totals.economies.toLocaleString('fr-FR')}`, `${lastMonth.economies.toLocaleString('fr-FR')}`],
      ['Équipements réaffectés', `${totals.equipments}`, `${lastMonth.equipments}`],
      ['Uniformes recyclés (kg)', `${totals.uniforms.toLocaleString('fr-FR')}`, `${lastMonth.uniforms.toLocaleString('fr-FR')}`],
    ]

    doc.setFontSize(10)
    let y = 70
    rows.forEach((row, i) => {
      doc.setFont(i === 0 ? 'helvetica' : 'helvetica', i === 0 ? 'bold' : 'normal')
      doc.text(row[0], 20, y)
      doc.text(row[1], 100, y)
      doc.text(row[2], 160, y)
      y += 8
    })

    y += 15
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(
      'Ce rapport est conforme aux exigences CSRD (Corporate Sustainability Reporting Directive) pour la divulgation des impacts environnementaux et sociaux liés à la logistique circulaire.',
      20,
      y,
      { maxWidth: pageWidth - 40 }
    )

    doc.save('rapport-csrd-omniloop.pdf')
  }, [totals, lastMonth])

  if (loading) {
    return (
      <div className="rse-dashboard">
        <div className="rse-dashboard-inner">
          <div className="rse-header">
            <div className="skeleton-block" style={{ height: 32, width: 260, marginBottom: 0 }} />
            <div className="skeleton-block" style={{ height: 40, width: 200 }} />
          </div>
          <div className="rse-metrics">
            <SkeletonCard count={4} />
          </div>
          <div className="rse-chart-card card">
            <SkeletonChart />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="rse-dashboard">
      <div className="rse-dashboard-inner">
      <div className="rse-header">
        <h1>Tableau de bord RSE</h1>
        <button className="btn-csrd primary" onClick={generateCSRDReport}>
          Générer rapport CSRD
        </button>
      </div>

      <div className="rse-metrics">
        {[
          { value: lastMonth.co2, suffix: ' kg', label: 'CO₂ évité' },
          { value: lastMonth.economies, suffix: ' €', label: 'Économies générées' },
          { value: lastMonth.equipments, suffix: '', label: 'Équipements réaffectés' },
          { value: lastMonth.uniforms, suffix: ' kg', label: 'Uniformes recyclés' },
        ].map((metric, i) => (
          <motion.div
            key={metric.label}
            className="rse-metric-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
          >
            <div className="rse-metric-value">
              <AnimatedCounter value={metric.value} suffix={metric.suffix} duration={1.5} />
            </div>
            <div className="rse-metric-label">{metric.label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="rse-chart-card card"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <h3 className="card-title">Évolution mensuelle (12 mois)</h3>
        <div className="rse-chart">
          <ResponsiveContainer width="100%" height={360}>
            <LineChart data={MOCK_MONTHLY_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 200, 150, 0.25)" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                domain={[0, 105]}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: '#152030',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                }}
                labelStyle={{ color: '#f1f5f9' }}
                formatter={(value, name, item) => {
                  const p = item.payload
                  const labels = {
                    co2Norm: 'CO₂ évité',
                    economiesNorm: 'Économies',
                    equipmentsNorm: 'Équipements réaffectés',
                    uniformsNorm: 'Uniformes recyclés',
                  }
                  const real = {
                    co2Norm: `${p.co2?.toLocaleString('fr-FR')} kg`,
                    economiesNorm: `${p.economies?.toLocaleString('fr-FR')} €`,
                    equipmentsNorm: String(p.equipments ?? ''),
                    uniformsNorm: `${p.uniforms ?? ''} kg`,
                  }
                  return [real[name] ?? value, labels[name]]
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: 20 }}
                formatter={(value) => ({
                  co2Norm: 'CO₂ évité (kg)',
                  economiesNorm: 'Économies (€)',
                  equipmentsNorm: 'Équipements réaffectés',
                  uniformsNorm: 'Uniformes recyclés (kg)',
                }[value])}
              />
              <Line
                type="monotone"
                dataKey="co2Norm"
                stroke={BRAND_PALETTE.co2}
                strokeWidth={2}
                dot={{ fill: BRAND_PALETTE.co2, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="economiesNorm"
                stroke={BRAND_PALETTE.economies}
                strokeWidth={2}
                dot={{ fill: BRAND_PALETTE.economies, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="equipmentsNorm"
                stroke={BRAND_PALETTE.equipments}
                strokeWidth={2}
                dot={{ fill: BRAND_PALETTE.equipments, r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="uniformsNorm"
                stroke={BRAND_PALETTE.uniforms}
                strokeWidth={2}
                dot={{ fill: BRAND_PALETTE.uniforms, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
      </div>
    </div>
  )
}
