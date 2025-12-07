import React, { useState } from 'react'
import { ChevronDown, RotateCw, Info, Search, Filter } from 'lucide-react'
import FilterModal from './FilterModal'

export default function Topbar({ 
  data = [], 
  filters, 
  onFiltersChange, 
  searchQuery, 
  onSearch, 
  sortBy, 
  onSortChange 
}) {
  const [isRotating, setIsRotating] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false) 

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

  // Reset all filters
  const handleResetFilters = () => {
    setIsRotating(true)
    setOpenDropdown(null) 
    
    // Reset all filters
    onFiltersChange({
      regions: [],
      gender: [],
      categories: [],
      tags: [],
      paymentMethods: [],
      ageRange: [0, 200],
      dateRange: [null, null]
    })
    
    // Reset search query
    onSearch('')
    
    // Reset sort
    onSortChange({ key: 'date', dir: 'desc' })
    
    setTimeout(() => setIsRotating(false), 600)
  }

  
  const calculateStats = () => {
    // Calculate totals for the current page (data array contains current-page rows)
    const acc = data.reduce((s, item) => {
      const qty = Number(item.quantity ?? item.qty ?? 0) || 0
      s.units += qty

      const amt = Number(item.total_amount ?? item.totalAmount ?? 0) || 0
      s.amount += amt

      // discount can be provided as `discount_percentage` (decimal), `discount` (either decimal or percent),
      // or as an absolute `discount_amount` (less common). We'll try to detect semantics:
      let discVal = item.discount_percentage ?? item.discountPercentage ?? item.discount ?? item.discount_amount ?? 0
      let discNum = Number(discVal)
      if (Number.isNaN(discNum)) discNum = 0

      let discAmount = 0
      if (discNum > 0 && discNum <= 1) {
        // decimal fraction (e.g. 0.1 = 10%)
        discAmount = amt * discNum
      } else if (discNum > 1 && discNum <= 100) {
        // percentage in whole number (e.g. 10 = 10%)
        discAmount = amt * (discNum / 100)
      } else if (discNum > 100) {
        // treat as absolute amount if >100
        discAmount = discNum
      }

      s.discount += discAmount
      return s
    }, { units: 0, amount: 0, discount: 0 })

    return {
      units: acc.units,
      amount: acc.amount.toLocaleString('en-IN'),
      discount: acc.discount.toLocaleString('en-IN'),
      amountSR: Math.ceil(data.length / 5),
      discountSR: Math.ceil(data.length / 5)
    }
  }

  const stats = calculateStats()

  return (
    <div className="bg-white">
      
      <div className="px-3 md:px-6 py-3 md:py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-b border-gray-200">
        <h1 className="text-sm md:text-base font-semibold text-gray-900">Sales Management System</h1>
        
        <div className="relative w-full lg:w-80">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            value={searchQuery}
            onChange={e => onSearch(e.target.value)}
            placeholder="Name, Phone no."
            className="border border-gray-300 px-4 py-2 pl-9 rounded text-xs md:text-sm w-full bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* Filter Strip - Desktop Only */}
      <div className="px-6 py-3 mr-8 hidden lg:flex flex-wrap lg:flex-nowrap items-center gap-2 border-b border-gray-200 relative overflow-x-auto lg:overflow-x-visible">
        <button
          onClick={handleResetFilters}
          className={`text-gray-400 hover:text-gray-600 transition flex-shrink-0 ${
            isRotating ? 'animate-spin' : ''
          }`}
          title="Reset all filters"
        >
          <RotateCw size={16} />
        </button>
        
        <FilterDropdown 
          label="Customer Region"
          items={getRegions()}
          selected={filters.regions}
          onSelect={(val) => handleFilterChange('regions', val)}
          isOpen={openDropdown === 'region'}
          onToggle={() => setOpenDropdown(openDropdown === 'region' ? null : 'region')}
          onClose={() => setOpenDropdown(null)}
        />

        <FilterDropdown 
          label="Gender"
          items={getUniqueValues('gender')}
          selected={filters.gender}
          onSelect={(val) => handleFilterChange('gender', val)}
          isOpen={openDropdown === 'gender'}
          onToggle={() => setOpenDropdown(openDropdown === 'gender' ? null : 'gender')}
          onClose={() => setOpenDropdown(null)}
        />

        <FilterDropdown
          label="Age Range"
          items={['18-25', '26-35', '36-45', '46-55', '56+']}
          selected={filters.ageRange && filters.ageRange.length === 2 ? [`${filters.ageRange[0]}-${filters.ageRange[1]}`] : []}
          onSelect={(val) => {
            const parts = String(val).split('-')
            let min = parseInt(parts[0]) || 0
            let max = parts[1] ? parseInt(parts[1].replace('+','')) || 200 : 200
            if (min > max) [min, max] = [max, min]
            onFiltersChange({ ...filters, ageRange: [min, max] })
            setOpenDropdown(null)
          }}
          isOpen={openDropdown === 'age'}
          onToggle={() => setOpenDropdown(openDropdown === 'age' ? null : 'age')}
          onClose={() => setOpenDropdown(null)}
        />

        <FilterDropdown 
          label="Product Category"
          items={getProductCategories()}
          selected={filters.categories}
          onSelect={(val) => handleFilterChange('categories', val)}
          isOpen={openDropdown === 'category'}
          onToggle={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
          onClose={() => setOpenDropdown(null)}
        />

        <FilterDropdown 
          label="Tags"
          items={getUniqueValues('tags')}
          selected={filters.tags}
          onSelect={(val) => handleFilterChange('tags', val)}
          isOpen={openDropdown === 'tags'}
          onToggle={() => setOpenDropdown(openDropdown === 'tags' ? null : 'tags')}
          onClose={() => setOpenDropdown(null)}
        />

        <FilterDropdown 
          label="Payment Method"
          items={getPaymentMethods()}
          selected={filters.paymentMethods}
          onSelect={(val) => handleFilterChange('paymentMethods', val)}
          isOpen={openDropdown === 'payment'}
          onToggle={() => setOpenDropdown(openDropdown === 'payment' ? null : 'payment')}
          onClose={() => setOpenDropdown(null)}
        />

        <FilterDropdown 
          label="Date"
          items={['Today', 'Yesterday', 'Last 7 days', 'Last 30 days']}
          selected={filters.dateRange}
          onSelect={(val) => handleFilterChange('dateRange', val)}
          isOpen={openDropdown === 'date'}
          onToggle={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')}
          onClose={() => setOpenDropdown(null)}
        />

        
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-600">Sort by:</span>
          <select
            value={`${sortBy.key}|${sortBy.dir}`}
            onChange={e => {
              const [key, dir] = e.target.value.split('|')
              onSortChange({ key, dir })
            }}
            className="border border-gray-300 rounded px-3 py-1.5 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-400 cursor-pointer"
          >
            <option value="none|none">No Sort</option>
            <option value="customer_name|asc">Customer Name (A–Z)</option>
            <option value="customer_name|desc">Customer Name (Z–A)</option>
            <option value="date|desc">Date (Newest)</option>
            <option value="date|asc">Date (Oldest)</option>
            <option value="quantity|desc">Quantity (High → Low)</option>
            <option value="quantity|asc">Quantity (Low → High)</option>
          </select>
        </div>
      </div>

      {/* Mobile Filter Button - Visible on Small/Medium Screens Only */}
      <div className="px-6 py-3 border-b border-gray-200 flex items-center gap-2 lg:hidden">
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-3 py-2 rounded text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition"
        >
          <Filter size={16} />
          Filters
        </button>
        
        <button
          onClick={handleResetFilters}
          className={`text-gray-400 hover:text-gray-600 transition ${
            isRotating ? 'animate-spin' : ''
          }`}
          title="Reset all filters"
        >
          <RotateCw size={16} />
        </button>
      </div>

      {/* Filter Modal - Mobile/Tablet */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        data={data}
        filters={filters}
        onFiltersChange={onFiltersChange}
        onResetFilters={handleResetFilters}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
      
      <div className="px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center gap-4">
        <SummaryCard 
          title="Total units sold"
          value={stats.units}
        />
        <SummaryCard 
          title="Total Amount"
          value={`₹${stats.amount} (${stats.amountSR} SRs)`}
        />
        <SummaryCard 
          title="Total Discount"
          value={`₹${stats.discount} (${stats.discountSR} SRs)`}
        />
      </div>
    </div>
  )
}

function FilterDropdown({ label, items, selected, onSelect, isOpen, onToggle, onClose }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition whitespace-nowrap"
      >
        {label}
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded shadow-lg p-2 z-50 min-w-48">
          {items && items.map(item => (
            <label key={item} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer text-xs">
              <input
                type="checkbox"
                checked={selected && selected.includes(item)}
                onChange={() => onSelect(item)}
                className="w-3 h-3"
              />
              <span>{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

function SummaryCard({ title, value }) {
  return (
    <div className="border border-gray-300 rounded p-3 bg-white w-full lg:w-auto">
      <div className="flex items-start gap-2">
        <div>
          <p className="text-xs text-gray-600 font-medium">{title}</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <Info size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
      </div>
    </div>
  )
}