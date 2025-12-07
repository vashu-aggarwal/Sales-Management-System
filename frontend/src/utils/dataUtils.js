// small helpers
const caseInsensitiveInclude = (hay, needle) =>
  String(hay || '').toLowerCase().includes(String(needle || '').toLowerCase())

export function applySearchFiltersSort(data = [], { searchQuery = '', filters = {}, sortBy = { key: 'date', dir: 'desc' } }) {
  let out = data.slice()

  // SEARCH: customerName and phoneNumber (case-insensitive)
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase()
    out = out.filter(r => (r.customerName && r.customerName.toLowerCase().includes(q)) || (r.phoneNumber && r.phoneNumber.toLowerCase().includes(q)))
  }

  // FILTERS
  const { regions = [], gender = [], categories = [], tags = [], paymentMethods = [], ageRange = [0, 200], dateRange = [null, null] } = filters

  out = out.filter(r => {
    if (regions.length && !regions.includes(r.customerRegion)) return false
    if (gender.length && !gender.includes(r.gender)) return false
    if (categories.length && !categories.includes(r.productCategory)) return false
    if (paymentMethods.length && !paymentMethods.includes(r.paymentMethod)) return false
    if (tags.length) {
      const rowTags = r.tags || []
      if (!tags.every(t => rowTags.includes(t))) return false
    }
    // age range
    if (ageRange && ageRange.length === 2) {
      const [min, max] = ageRange
      if (typeof r.age === 'number' && (r.age < min || r.age > max)) return false
    }
    // date range (strings like YYYY-MM-DD)
    if (dateRange && (dateRange[0] || dateRange[1])) {
      const d = r.date ? new Date(r.date) : null
      if (dateRange[0]) {
        const start = new Date(dateRange[0])
        if (!d || d < start) return false
      }
      if (dateRange[1]) {
        const end = new Date(dateRange[1])
        if (!d || d > end) return false
      }
    }
    return true
  })

  // SORT
  const dir = sortBy.dir === 'asc' ? 1 : -1
  out.sort((a, b) => {
    const k = sortBy.key
    if (k === 'date') {
      const da = new Date(a.date || 0), db = new Date(b.date || 0)
      return (da - db) * dir
    }
    if (k === 'quantity' || k === 'totalAmount' || k === 'age') {
      const na = Number(a[k] || 0), nb = Number(b[k] || 0)
      return (na - nb) * dir
    }
    if (k === 'customerName') {
      const sa = String(a.customerName || '').toLowerCase(), sb = String(b.customerName || '').toLowerCase()
      return sa > sb ? dir : sa < sb ? -dir : 0
    }
    return 0
  })

  return out
}
