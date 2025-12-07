import React from 'react'

export default function FilterDropdown({ title, options = [], value = null, onChange }) {
  return (
    <div className="relative inline-block w-full sm:w-auto">
      <label className="text-xs text-gray-600 block mb-1">{title}</label>
      <select
        value={value || ''}
        onChange={e => onChange(e.target.value || null)}
        className="border px-3 py-2 rounded text-sm w-full sm:w-56 bg-white"
      >
        <option value="">All</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}
