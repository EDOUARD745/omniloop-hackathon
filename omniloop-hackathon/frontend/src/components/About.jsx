import { motion } from 'framer-motion'

const TEAM_MEMBERS = [
  { name: 'LOUAMOU', firstName: 'Edouard', company: 'La Poste' },
  { name: 'Dufailly', firstName: 'Lisa', company: 'Sanofi' },
  { name: 'AUBRUN', firstName: 'Julien', company: 'ITGA' },
  { name: 'LATEB', firstName: 'Anais', company: 'BNP Paribas' },
  { name: 'TINNIN', firstName: 'Uzair', company: 'BNP Paribas' },
  { name: 'Romagny', firstName: 'Pierre', company: 'Total Energies' },
  { name: 'BILOT', firstName: 'Clément', company: 'Orano' },
  { name: 'Belmokhtar', firstName: 'Assia', company: 'Orange' },
  { name: 'Lebé', firstName: 'Mathilde', company: 'Orange' },
  { name: 'AGNAOU', firstName: 'Amine', company: 'Orange' },
  { name: 'BIHL', firstName: 'Lucas', company: 'EDF' },
]

const getCompanyColor = (company) => {
  const colors = {
    'La Poste': '#003366',
    'Sanofi': '#002855',
    'ITGA': '#1A7A4A',
    'BNP Paribas': '#00915a',
    'Total Energies': '#004638',
    'Orano': '#004494',
    'Orange': '#ff6600',
    'EDF': '#004494',
  }
  return colors[company] || '#64748b'
}

const getInitials = (firstName, name) => {
  return `${firstName?.charAt(0) || ''}${name?.charAt(0) || ''}`.toUpperCase()
}

export default function About() {
  return (
    <div className="about-page">
      <motion.div
        className="about-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="about-hero-pattern" aria-hidden="true" />
        <div className="about-hero-content">
          <span className="about-badge">Groupe 14</span>
          <h1 className="about-hero-title">
            L'équipe OmniLoop
          </h1>
          <p className="about-hero-subtitle">
            Projet hackathon — Logistique circulaire intégrée
          </p>
        </div>
      </motion.div>

      <motion.div
        className="about-coach-card"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="about-coach-avatar">
          <span>CC</span>
        </div>
        <div className="about-coach-info">
          <span className="about-coach-role">Coach</span>
          <h2 className="about-coach-name">Claire Carmen</h2>
          <p className="about-coach-desc">
            Nous sommes le Groupe 14 et notre coach c'est Claire Carmen.
          </p>
        </div>
      </motion.div>

      <div className="about-team-section">
        <h3 className="about-team-heading">
          <span className="about-team-heading-line" />
          L'équipe
        </h3>
        <div className="about-team-grid">
          {TEAM_MEMBERS.map((member, i) => {
            const companyColor = getCompanyColor(member.company)
            return (
            <motion.div
              key={i}
              className="about-member"
              style={{ '--member-color': companyColor }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.04, duration: 0.35 }}
              whileHover={{ y: -3 }}
            >
              <div
                className="about-member-avatar"
                style={{
                  background: `${companyColor}26`,
                  color: companyColor,
                }}
              >
                {getInitials(member.firstName, member.name)}
              </div>
              <div className="about-member-content">
                <span className="about-member-name">
                  {member.firstName} {member.name}
                </span>
                <span className="about-member-company">{member.company}</span>
              </div>
            </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
