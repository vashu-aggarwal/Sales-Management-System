import { useEffect, useState, useMemo } from "react";
import FilterDropdown from "../components/FilterDropdown";
import SummaryCard from "../components/SummaryCard";
import TransactionsTable from "../components/TransactionsTable";
import Pagination from "../components/Pagination";
import { applySearchFiltersSort } from "../utils/filterUtils";

export default function Dashboard() {
  const PAGE_SIZE = 10;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI States
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState({
    key: "customerName",
    dir: "asc",
  });

  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    regions: [],
    gender: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageRange: [0, 200],
    dateRange: [null, null],
  });

  // Load dataset
  useEffect(() => {
    fetch("/data/sales.json")
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data load error:", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return applySearchFiltersSort(data, { searchQuery, filters, sortBy });
  }, [data, searchQuery, filters, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const visibleRows = filtered.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  useEffect(() => setPage(1), [searchQuery, filters, sortBy]);

  return (
    <div className="space-y-6">

      {/* top bar */}
      <div className="flex justify-between items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Search name or phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-lg w-96 shadow-sm"
        />

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Sort</span>
          <select
            value={`${sortBy.key}_${sortBy.dir}`}
            onChange={(e) => {
              const [key, dir] = e.target.value.split("_");
              setSortBy({ key, dir });
            }}
            className="border px-3 py-2 rounded-lg shadow-sm"
          >
            <option value="customerName_asc">Customer Name (A–Z)</option>
            <option value="customerName_desc">Customer Name (Z–A)</option>
            <option value="date_desc">Date (Newest First)</option>
            <option value="date_asc">Date (Oldest First)</option>
          </select>
        </div>
      </div>

      {/* filter strip */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterDropdown title="Customer Region" />
        <FilterDropdown title="Gender" />
        <FilterDropdown title="Age Range" />
        <FilterDropdown title="Product Category" />
        <FilterDropdown title="Tags" />
        <FilterDropdown title="Payment Method" />
        <FilterDropdown title="Date" />
      </div>

      {/* summary cards */}
      <div className="flex gap-4">
        <SummaryCard title="Total units sold" value="10" />
        <SummaryCard title="Total Amount" value="₹89,000 (19 SRs)" />
        <SummaryCard title="Total Discount" value="₹15,000 (45 SRs)" />
      </div>

      {/* table and pagination */}
      <div className="bg-white border rounded-xl shadow-sm p-4">
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading...
          </div>
        ) : (
          <>
            <TransactionsTable rows={visibleRows} />

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
