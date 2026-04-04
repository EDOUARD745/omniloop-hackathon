import { useEffect, useState } from 'react'

function parseValue(val) {
  if (typeof val === 'number') return { num: val, suffix: '', prefix: '' }
  const str = String(val)
  const match = str.match(/^([^\d]*)([\d\s,.]+)(.*)$/)
  if (!match) return { num: 0, suffix: str, prefix: '' }
  const num = parseFloat(match[2].replace(/\s/g, '').replace(',', '.')) || 0
  return { num, suffix: match[3].trim(), prefix: match[1].trim() }
}

export default function AnimatedCounter({
  value,
  duration = 1.5,
  suffix: suffixProp = '',
  prefix: prefixProp = '',
  decimals = 0,
}) {
  const [display, setDisplay] = useState(0)
  const { num, suffix: parsedSuffix, prefix: parsedPrefix } = parseValue(value)
  const suffix = suffixProp ?? parsedSuffix
  const prefix = prefixProp ?? parsedPrefix

  useEffect(() => {
    let startTime = null

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime
      const elapsed = (currentTime - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = num * eased
      setDisplay(current)

      if (progress < 1) requestAnimationFrame(animate)
      else setDisplay(num)
    }

    requestAnimationFrame(animate)
  }, [num, duration])

  const formatted = decimals > 0
    ? display.toFixed(decimals).replace('.', ',')
    : Math.round(display).toLocaleString('fr-FR')

  return (
    <span>
      {prefix}
      {formatted}
      {suffix ? ` ${suffix}` : ''}
    </span>
  )
}
