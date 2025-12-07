import React from 'react'

export default function SummaryCard({ title, value }) {
  return (
    <div className="bg-white border rounded p-3 shadow-sm w-full lg:w-auto">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}
