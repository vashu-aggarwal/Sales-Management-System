import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TransactionsTable from "./components/TransactionsTable";
import Pagination from "./components/Pagination";
import SummaryCard from "./components/SummaryCard";

const DEFAULT_PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_DELAY = 500; // milliseconds

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // UI state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const searchDebounceTimer = useRef(null);
  const [filters, setFilters] = useState({
    regions: [],
    gender: [],
    categories: [],
    tags: [],
    paymentMethods: [],
    ageRange: [0, 200],
    dateRange: [null, null],
  });
  const [sortBy, setSortBy] = useState({ key: "date", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  // Fetch available options for filter UI (load a larger sample)
  const [options, setOptions] = useState({
    regions: [],
    genders: [],
    categories: [],
    paymentMethods: [],
    tags: [],
  });

  // Backend API base URL - configurable via Vite env `VITE_API_BASE`.
  // If `VITE_API_BASE` is empty, frontend will call proxied `/api/...` (vite dev proxy).
  // For production set `VITE_API_BASE=https://api.example.com` (no trailing slash).
  const backendBase = import.meta.env.VITE_API_BASE || "";

  // Helper to produce the final API URL. Pass a path that starts with `/api`.
  const getApiUrl = (path) => {
    if (!path.startsWith("/")) path = `/${path}`;
    return backendBase ? `${backendBase}${path}` : path;
  };

  const buildFilterParams = useCallback(() => {
    const params = new URLSearchParams();

    // helper: append each array element as repeated query param
    const appendArray = (key, arr) => {
      if (!arr) return;
      if (Array.isArray(arr)) {
        arr.forEach((v) => {
          if (v !== undefined && v !== null && String(v) !== "")
            params.append(key, String(v));
        });
      } else if (String(arr).includes(",")) {
        String(arr)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
          .forEach((v) => params.append(key, v));
      } else if (String(arr) !== "") {
        params.append(key, String(arr));
      }
    };

    // regions, categories, paymentMethods, gender: support multiple values
    appendArray("customerRegion", filters.regions);
    appendArray("productCategory", filters.categories);
    appendArray("paymentMethod", filters.paymentMethods);
    appendArray("gender", filters.gender);

    // tags: allow multiple tag params
    appendArray("tags", filters.tags);

    // age range
    if (filters.ageRange && filters.ageRange.length === 2) {
      const min = Number(filters.ageRange[0]);
      const max = Number(filters.ageRange[1]);
      if (!Number.isNaN(min)) params.append("ageMin", String(min));
      if (!Number.isNaN(max)) params.append("ageMax", String(max));
    }

    // date range
    if (filters.dateRange && filters.dateRange[0])
      params.append("dateFrom", filters.dateRange[0]);
    if (filters.dateRange && filters.dateRange[1])
      params.append("dateTo", filters.dateRange[1]);

    // pagination + sorting
    params.append("page", page);
    params.append("pageSize", pageSize);
    params.append("sortBy", sortBy.key);
    params.append("sortOrder", sortBy.dir);

    return params;
  }, [filters, page, pageSize, sortBy]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      let params;

      // priority: search -> filter -> sorted/list
      // Use debouncedSearchQuery instead of searchQuery to avoid multiple API calls
      if (debouncedSearchQuery && debouncedSearchQuery.trim()) {
        params = new URLSearchParams();
        params.append("q", debouncedSearchQuery);
        params.append("page", page);
        params.append("pageSize", pageSize);
        url = getApiUrl(`/api/transaction/search?${params.toString()}`);
      } else if (
        (filters.regions && filters.regions.length) ||
        (filters.gender && filters.gender.length) ||
        (filters.categories && filters.categories.length) ||
        (filters.tags && filters.tags.length) ||
        (filters.paymentMethods && filters.paymentMethods.length) ||
        (filters.ageRange && (filters.ageRange[0] || filters.ageRange[1])) ||
        (filters.dateRange && (filters.dateRange[0] || filters.dateRange[1]))
      ) {
        params = buildFilterParams();
        url = getApiUrl(`/api/transaction/filter?${params.toString()}`);
      } else if (sortBy && sortBy.key) {
        params = new URLSearchParams();
        params.append("sortBy", sortBy.key);
        params.append("sortOrder", sortBy.dir);
        params.append("page", page);
        params.append("pageSize", pageSize);
        url = getApiUrl(`/api/transaction/sorted?${params.toString()}`);
      } else {
        params = new URLSearchParams();
        params.append("page", page);
        params.append("pageSize", pageSize);
        url = getApiUrl(`/api/transaction?${params.toString()}`);
      }

      console.log("Fetching from:", url);
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`API error ${res.status}: ${res.statusText}`);
      const json = await res.json();

      if (!json.success) throw new Error(json.error || "API returned error");

      setRows(json.data || []);
      setTotal(json.total || 0);
      setTotalPages(json.totalPages || 1);
    } catch (err) {
      const msg = err.message || "Failed to fetch transactions";
      console.error(msg, err);
      setError(msg);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [
    debouncedSearchQuery,
    filters,
    sortBy,
    page,
    pageSize,
    buildFilterParams,
  ]);

  // load filter options (sample a larger page)
  const loadFilterOptions = useCallback(async () => {
    try {
      const res = await fetch(
        `${backendBase}/api/transaction?page=1&pageSize=1000`
      );
      if (!res.ok) return;
      const json = await res.json();
      if (!json || !json.success) return;
      const sample = json.data || [];

      const unique = (arr = []) =>
        Array.from(new Set(arr.filter(Boolean))).sort();

      setOptions({
        regions: unique(
          sample.map((s) => s.customer_region || s.customerRegion)
        ),
        genders: unique(sample.map((s) => s.gender)),
        categories: unique(
          sample.map((s) => s.product_category || s.productCategory)
        ),
        paymentMethods: unique(sample.map((s) => s.payment_method)),
        tags: unique(
          sample.flatMap((s) => (s.tags ? String(s.tags).split(",") : []))
        )
          .map((t) => t.trim())
          .filter(Boolean),
      });
    } catch (err) {
      console.warn("Failed to load filter options", err);
    }
  }, []);

  // initial load and whenever dependencies change
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Debounce search query: update debouncedSearchQuery after user stops typing
  useEffect(() => {
    // Clear previous timer if exists
    if (searchDebounceTimer.current) {
      clearTimeout(searchDebounceTimer.current);
    }

    // Set new timer to update debounced query after delay
    searchDebounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setPage(1); // Reset to page 1 when search changes
    }, SEARCH_DEBOUNCE_DELAY);

    // Cleanup timer on unmount or when searchQuery changes again
    return () => {
      if (searchDebounceTimer.current) {
        clearTimeout(searchDebounceTimer.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    loadFilterOptions();
  }, [loadFilterOptions]);

  // reset page when filters/search/sort change
  useEffect(() => setPage(1), [filters, sortBy]);

  return (
    <div className="min-h-screen flex bg-gray-50 text-sm">
      <Sidebar />
      <main className="flex-1 overflow-x-auto">
        <Topbar
          data={rows}
          filters={filters}
          onFiltersChange={(f) => setFilters(f)}
          searchQuery={searchQuery}
          onSearch={(q) => setSearchQuery(q)}
          sortBy={sortBy}
          onSortChange={(s) => setSortBy(s)}
        />

        <div className="bg-white p-2 sm:p-4 m-2 md:m-3 lg:m-4 rounded shadow overflow-x-auto md:overflow-x-hidden">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : (
            <>
              <TransactionsTable rows={rows} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}
