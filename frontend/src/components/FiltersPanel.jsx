import React, { useMemo } from 'react'

function unique(arr = []) {
  return Array.from(new Set(arr.filter(Boolean)))
}

export default function FiltersPanel({ data = [], filters, onChange }) {
  const regions = useMemo(() => unique(data.map(d => d.customerRegion)), [data])
  const genders = useMemo(() => unique(data.map(d => d.gender)), [data])
  const categories = useMemo(() => {
    const dbCategories = unique(data.map(d => d.productCategory || d.product_category))
    // Merge with predefined categories, keeping all unique values
    const predefined = ['Electronics', 'Clothing', 'Beauty']
    return Array.from(new Set([...predefined, ...dbCategories])).filter(Boolean).sort()
  }, [data])
  const paymentMethods = useMemo(() => unique(data.map(d => d.paymentMethod)), [data])
  const allTags = useMemo(() => unique(data.flatMap(d => d.tags || [])), [data])

  const toggleArray = (arr, val) => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]

  return (
    <div className="bg-white p-4 rounded shadow w-full sm:w-auto">
      <h3 className="font-medium mb-2">Filters</h3>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Region</div>
        <div className="flex flex-col space-y-1 max-h-48 overflow-y-auto">
          {regions.map(r => (
            <label key={r} className="flex items-center gap-2 py-1">
              <input type="checkbox" checked={filters.regions.includes(r)} onChange={() => onChange({ ...filters, regions: toggleArray(filters.regions, r) })} />
              <span className="text-sm">{r}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Gender</div>
        <div className="flex flex-col space-y-1">
          {genders.map(g => (
            <label key={g} className="flex items-center gap-2 py-1">
              <input type="checkbox" checked={filters.gender.includes(g)} onChange={() => onChange({ ...filters, gender: toggleArray(filters.gender, g) })} />
              <span className="text-sm">{g}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Category</div>
        <div className="flex flex-col space-y-1">
          {categories.map(c => (
            <label key={c} className="flex items-center gap-2 py-1">
              <input type="checkbox" checked={filters.categories.includes(c)} onChange={() => onChange({ ...filters, categories: toggleArray(filters.categories, c) })} />
              <span className="text-sm">{c}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Payment Method</div>
        <div className="flex flex-col space-y-1">
          {paymentMethods.map(p => (
            <label key={p} className="flex items-center gap-2 py-1">
              <input type="checkbox" checked={filters.paymentMethods.includes(p)} onChange={() => onChange({ ...filters, paymentMethods: toggleArray(filters.paymentMethods, p) })} />
              <span className="text-sm">{p}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="text-xs text-gray-600 mb-1">Tags</div>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => onChange({ ...filters, tags: toggleArray(filters.tags, tag) })}
              className={`text-xs px-2 py-1 rounded border w-full sm:w-auto text-center ${filters.tags.includes(tag) ? 'bg-gray-200' : ''}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-600 mb-1">Age Range</div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="number"
            placeholder="min"
            className="w-full sm:w-20 border px-2 py-1 rounded"
            value={filters.ageRange[0]}
            onChange={e => onChange({ ...filters, ageRange: [Number(e.target.value || 0), filters.ageRange[1]] })}
          />
          <input
            type="number"
            placeholder="max"
            className="w-full sm:w-20 border px-2 py-1 rounded"
            value={filters.ageRange[1]}
            onChange={e => onChange({ ...filters, ageRange: [filters.ageRange[0], Number(e.target.value || 200)] })}
          />
        </div>
      </div>
    </div>
  )
}
