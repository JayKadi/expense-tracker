// src/pages/TransactionsPage.jsx
// src/pages/TransactionsPage.jsx
import { useState, useEffect } from "react";
import TransactionList from "../Components/TransactionList";
import CreateTransactionModal from "../Components/CreateTransactionModal";
import EditTransactionModal from "../Components/EditTransactionModal";
import DeleteConfirmationModal from "../Components/DeleteConfirmationModal";
import api from "../services/api";
import { Plus } from "lucide-react";
import FilterBar from "../Components/FilterBar";


function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 🌙 Apply dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

   //Filter transactions and pagination
const [filters, setFilters] = useState({ type: "", category: "", start_date: "", end_date: "" });
const [page, setPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
// 🔁 Reset page to 1 whenever filters change

useEffect(() => {
  setPage(1);
}, [filters]);

useEffect(() => {
  const fetchTransactions = async () => {
    try {
      let query = `transactions/?page=${page}`;
      const params = [];

      if (filters.type) params.push(`type=${filters.type}`);
      if (filters.category) params.push(`category=${filters.category}`);
      if (filters.start_date) params.push(`start_date=${filters.start_date}`);
      if (filters.end_date) params.push(`end_date=${filters.end_date}`);

      if (params.length > 0) {
        query += "&" + params.join("&");
      }

      const res = await api.get(query);

      setTransactions(res.data.results); // paginated results
      setTotalPages(Math.ceil(res.data.count / 10)); // match PAGE_SIZE
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  fetchTransactions();
}, [filters, page]);

  // ➕ Add new transaction
  const handleNewTransaction = (txn) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  // 🗑 Trigger delete confirmation
  const handleDeleteTransaction = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  // ✅ Confirm and perform delete
  const confirmDelete = async () => {
    try {
      await api.delete(`transactions/${deleteId}/`);
      setTransactions((prev) => prev.filter((txn) => txn.id !== deleteId));
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  // ✏️ Open edit modal
  const handleEditTransaction = (txn) => {
    setEditingTransaction(txn);
    setIsEditModalOpen(true);
  };

  // 🔁 Update edited transaction
  const handleUpdateTransaction = (updatedTxn) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === updatedTxn.id ? updatedTxn : txn))
    );
    setIsEditModalOpen(false);
  };
 

  // 💰 Calculations
  const totalIncome = transactions
    .filter((txn) => txn.type === "income")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const totalExpense = transactions
    .filter((txn) => txn.type === "expense")
    .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const balance = totalIncome - totalExpense;

  const toggleDarkMode = () => setDarkMode((prev) => !prev);
  
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors relative">
      {/* 🌓 Top Bar */}
      <div className="max-w-6xl mx-auto p-4 flex justify-end">
        <button
          onClick={toggleDarkMode}
          className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md transition"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* 🧾 Header */}
      <div className="max-w-6xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Expense Tracker
        </h1>

        {/* 💳 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900 shadow rounded-lg p-4 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-300 font-medium">Income</p>
            <p className="text-green-600 dark:text-green-400 font-bold text-xl">
              Ksh {totalIncome}
            </p>
          </div>

          <div className="bg-red-50 dark:bg-red-900 shadow rounded-lg p-4 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-300 font-medium">Expenses</p>
            <p className="text-red-600 dark:text-red-400 font-bold text-xl">
              Ksh {totalExpense}
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900 shadow rounded-lg p-4 text-center transition-colors">
            <p className="text-gray-500 dark:text-gray-300 font-medium">Balance</p>
            <p className="text-blue-600 dark:text-blue-400 font-bold text-xl">
              Ksh {balance}
            </p>
          </div>
        </div>

       {/* 📋 Transactions */}
<div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-colors">
  <FilterBar filters={filters} onFilterChange={setFilters} />
  <TransactionList
    transactions={transactions}
    onDelete={handleDeleteTransaction}
    onEdit={handleEditTransaction}
    page={page}
    totalPages={totalPages}
    setPage={setPage}
  />
</div>

      </div>

      {/* ➕ Floating Add Button */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition"
      >
        <Plus size={28} />
      </button>

      {/* 🪟 Create Modal */}
      <CreateTransactionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onNewTransaction={handleNewTransaction}
      />

      {/* ✏️ Edit Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        transaction={editingTransaction}
        onUpdate={handleUpdateTransaction}
      />

      {/* ❗ Delete Confirmation */}
      <DeleteConfirmationModal
  isOpen={isDeleteModalOpen}
  onClose={() => setIsDeleteModalOpen(false)}
  onConfirm={confirmDelete}
/>
    </div>
  );
}

export default TransactionsPage;
