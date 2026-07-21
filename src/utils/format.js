// Formatting helpers shared across the app.

export function formatNumber(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value, currency = 'USD') {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatCompact(value) {
  if (value == null) return '—'
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value)
}

export function formatDate(date, opts = {}) {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...opts,
  }).format(d)
}

export function formatRelativeTime(date) {
  if (!date) return '—'
  const d = typeof date === 'string' ? new Date(date) : date
  const diff = Date.now() - d.getTime()
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const mins = Math.round(diff / 60000)
  if (Math.abs(mins) < 60) return rtf.format(-mins, 'minute')
  const hours = Math.round(mins / 60)
  if (Math.abs(hours) < 24) return rtf.format(-hours, 'hour')
  const days = Math.round(hours / 24)
  if (Math.abs(days) < 30) return rtf.format(-days, 'day')
  return formatDate(d)
}

// Accepts a plain string or the backend's nested { first, last } name object.
export function fullName(name) {
  if (!name) return ''
  if (typeof name === 'string') return name
  return [name.first, name.last].filter(Boolean).join(' ')
}

export function initials(name = '') {
  const full = typeof name === 'string' ? name : fullName(name)
  return full
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function debounce(fn, delay = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), delay)
  }
}
