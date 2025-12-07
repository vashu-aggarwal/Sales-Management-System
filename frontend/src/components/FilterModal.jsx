import React, { useState } from 'react'
import { ChevronDown, RotateCw, X, Filter } from 'lucide-react'

export default function FilterModal({ 
  isOpen, 
  onClose, 
  data = [], 
  filters, 
  onFiltersChange, 
  onResetFilters,
  sortBy,
  onSortChange
}) {
  const getUniqueValues = (key) => {
    return [...new Set(data.map(d => d[key]).filter(Boolean))].sort()
  }

  const getProductCategories = () => {
    const dbCategories = getUniqueValues('productCategory')
    const predefined = ['Electronics', 'Clothing', 'Beauty']
    return Array.from(new Set([...predefined, ...dbCategories])).sort()
  }

  const getRegions = () => {
    const dbRegions = getUniqueValues('customerRegion')
    const predefined = ['Central', 'East', 'North', 'South', 'West']
    return Array.from(new Set([...predefined, ...dbRegions])).sort()
  }

  const getPaymentMethods = () => {
    const dbMethods = getUniqueValues('paymentMethod')
    const predefined = ['Cash', 'Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Wallet']
    return Array.from(new Set([...predefined, ...dbMethods])).sort()
  }

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters }
    if (newFilters[filterKey].includes(value)) {
      newFilters[filterKey] = newFilters[filterKey].filter(v => v !== value)
    } else {
      newFilters[filterKey] = [...newFilters[filterKey], value]
    }
    onFiltersChange(newFilters)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Modal Drawer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl z-50 md:hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-4 py-4 border-b border-gray-200 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="px-4 py-4 space-y-4">
          {/* Reset Button */}
          <button
            onClick={() => {
              onResetFilters()
              onClose()
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition"
          >
            <RotateCw size={16} />
            Reset Filters
          </button>

          {/* Customer Region */}
          <FilterSection title="Customer Region">
            {getRegions().map(r => (
              <label key={r} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={filters.regions.includes(r)}
                  onChange={() => handleFilterChange('regions', r)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">{r}</span>
              </label>
            ))}
          </FilterSection>

          {/* Gender */}
          <FilterSection title="Gender">
            {getUniqueValues('gender').map(g => (
              <label key={g} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={filters.gender.includes(g)}
                  onChange={() => handleFilterChange('gender', g)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">{g}</span>
              </label>
            ))}
          </FilterSection>

          {/* Age Range */}
          <FilterSection title="Age Range">
              <div className="flex gap-2 py-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="w-1/2 border border-gray-300 px-3 py-2 rounded text-sm"
                  value={(filters.ageRange && filters.ageRange[0]) || 0}
                  onChange={e => {
                    const min = Number(e.target.value || 0)
                    const max = Number((filters.ageRange && filters.ageRange[1]) || 200)
                    if (!Number.isFinite(min)) return
                    let a = min, b = max
                    if (a > b) [a, b] = [b, a]
                    onFiltersChange({ ...filters, ageRange: [a, b] })
                  }}
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="w-1/2 border border-gray-300 px-3 py-2 rounded text-sm"
                  value={(filters.ageRange && filters.ageRange[1]) || 200}
                  onChange={e => {
                    const min = Number((filters.ageRange && filters.ageRange[0]) || 0)
                    const max = Number(e.target.value || 200)
                    if (!Number.isFinite(max)) return
                    let a = min, b = max
                    if (a > b) [a, b] = [b, a]
                    onFiltersChange({ ...filters, ageRange: [a, b] })
                  }}
                />
              </div>
          </FilterSection>

          {/* Product Category */}
          <FilterSection title="Product Category">
            {getProductCategories().map(c => (
              <label key={c} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(c)}
                  onChange={() => handleFilterChange('categories', c)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">{c}</span>
              </label>
            ))}
          </FilterSection>

          {/* Tags */}
          <FilterSection title="Tags">
            <div className="flex flex-wrap gap-2 py-2">
              {getUniqueValues('tags').map(tag => (
                <button
                  key={tag}
                  onClick={() => handleFilterChange('tags', tag)}
                  className={`text-xs px-3 py-1 rounded border transition ${
                    filters.tags.includes(tag)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </FilterSection>

          {/* Payment Method */}
          <FilterSection title="Payment Method">
            {getPaymentMethods().map(p => (
              <label key={p} className="flex items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={filters.paymentMethods.includes(p)}
                  onChange={() => handleFilterChange('paymentMethods', p)}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-gray-700">{p}</span>
              </label>
            ))}
          </FilterSection>

          {/* Sort */}
          <FilterSection title="Sort by">
            <select
              value={`${sortBy.key}|${sortBy.dir}`}
              onChange={e => {
                const [key, dir] = e.target.value.split('|')
                onSortChange({ key, dir })
              }}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white"
            >
              <option value="none|none">No Sort</option>
              <option value="customer_name|asc">Customer Name (A–Z)</option>
              <option value="customer_name|desc">Customer Name (Z–A)</option>
              <option value="date|desc">Date (Newest)</option>
              <option value="date|asc">Date (Oldest)</option>
              <option value="quantity|desc">Quantity (High → Low)</option>
              <option value="quantity|asc">Quantity (Low → High)</option>
            </select>
          </FilterSection>

          {/* Apply Button */}
          <button
            onClick={onClose}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition mt-6"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  )
}

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-1"
      >
        <h3 className="font-semibold text-sm text-gray-900">{title}</h3>
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-2 space-y-1">
          {children}
        </div>
      )}
    </div>
  )
}
