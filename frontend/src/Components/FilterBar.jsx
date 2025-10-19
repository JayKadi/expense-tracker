// src/components/FilterBar.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, X, ChevronDown, ChevronUp, Download } from "lucide-react";
import api from "../services/api";

const CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'food', label: 'Food' },
  { value: 'transport', label: 'Transport' },
  { value: 'bills', label: 'Bills' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'salary', label: 'Salary' },
  { value: 'other', label: 'Other' },
];

function FilterBar({ filters, onFilterChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    onFilterChange({ ...filters, search: e.target.value });
  };

  const clearFilters = () => {
    setSearchTerm("");
    onFilterChange({ type: "", category: "", start_date: "", end_date: "", search: "" });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Build query params from filters
      let query = 'transactions/export_csv/?';
      const params = [];
      
      if (filters.type) params.push(`type=${filters.type}`);
      if (filters.category) params.push(`category=${filters.category}`);
      if (filters.start_date) params.push(`start_date=${filters.start_date}`);
      if (filters.end_date) params.push(`end_date=${filters.end_date}`);
      if (filters.search) params.push(`search=${filters.search}`);
      
      if (params.length > 0) {
        query += params.join("&");
      }

      // Get the full URL with token
      const token = localStorage.getItem("access_token");
      const baseURL = api.defaults.baseURL;
      const url = `${baseURL}/${query}`;

      // Fetch with authorization
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      // Create blob and download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export transactions. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters = filters.type || filters.category || filters.start_date || filters.end_date || searchTerm;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 mb-6 transition-colors"
    >
      {/* Search Bar and Buttons */}
      <div className="flex gap-3 mb-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
          <input
            type="text"
            placeholder="Search by category or description..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                     placeholder-gray-400 dark:placeholder-gray-500
                     transition-all"
          />
        </div>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleExport}
          disabled={isExporting}
          className="px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:bg-green-400
                   text-white font-medium transition-all flex items-center gap-2 shadow-lg shadow-green-500/30"
        >
          <Download size={20} className={isExporting ? "animate-bounce" : ""} />
          {isExporting ? "Exporting..." : "Export CSV"}
        </motion.button>

        {/* Filter Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all relative ${
            showFilters || hasActiveFilters
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          <Filter size={20} />
          Filters
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {hasActiveFilters && !showFilters && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          )}
        </motion.button>

        {/* Clear Filters Button */}
        <AnimatePresence>
          {hasActiveFilters && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-lg bg-red-100 dark:bg-red-900/30 
                       text-red-600 dark:text-red-400 
                       hover:bg-red-200 dark:hover:bg-red-900/50 
                       transition-colors flex items-center gap-2 font-medium"
            >
              <X size={20} />
              Clear
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Collapsible Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Type
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500
                             transition-colors cursor-pointer"
                    value={filters.type}
                    onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500
                             transition-colors cursor-pointer"
                    value={filters.category}
                    onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500
                             transition-colors"
                    value={filters.start_date || ""}
                    onChange={(e) => onFilterChange({ ...filters, start_date: e.target.value })}
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-2.5
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                             focus:outline-none focus:ring-2 focus:ring-indigo-500
                             transition-colors"
                    value={filters.end_date || ""}
                    onChange={(e) => onFilterChange({ ...filters, end_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FilterBar;