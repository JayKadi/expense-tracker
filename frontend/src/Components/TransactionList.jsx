// src/components/TransactionList.jsx
// src/components/TransactionList.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import EditTransactionModal from "./EditTransactionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Pencil, Trash2 } from "lucide-react";

function TransactionList({ transactions: propTransactions, onDelete, onEdit }) {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  useEffect(() => {
    if (propTransactions) {
      setTransactions(propTransactions);
    } else {
      api
        .get("transactions/")
        .then((response) => setTransactions(response.data))
        .catch((error) => console.error("Error fetching transactions:", error));
    }
  }, [propTransactions]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`transactions/${id}/`);
      setTransactions(transactions.filter((txn) => txn.id !== id));
      if (onDelete) onDelete(id);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleSaveEdit = async (updatedTxn) => {
    try {
      await api.put(`transactions/${updatedTxn.id}/`, updatedTxn);
      const updatedList = transactions.map((txn) =>
        txn.id === updatedTxn.id ? updatedTxn : txn
      );
      setTransactions(updatedList);
      if (onEdit) onEdit(updatedTxn);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Transactions
      </h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((txn) => (
            <li
              key={txn.id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-md transition-colors
                ${
                  txn.type === "expense"
                    ? "bg-red-50 dark:bg-red-900/30"
                    : "bg-green-50 dark:bg-green-900/30"
                }`}
            >
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">
                  {txn.title}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {txn.category}
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">
                  {txn.date}
                </p>
              </div>

              <span
                className={`font-semibold ${
                  txn.type === "expense"
                    ? "text-red-600 dark:text-red-400"
                    : "text-green-600 dark:text-green-400"
                }`}
              >
                {txn.type === "expense" ? "-" : "+"} Ksh {txn.amount}
              </span>

              <div className="flex items-center gap-2">
                {/* EDIT ICON */}
                <button
                  onClick={() => setEditingTransaction(txn)}
                  className="text-blue-500 hover:text-blue-700 transition"
                >
                  <Pencil size={18} />
                </button>

                {/* DELETE ICON */}
                <button
                  onClick={() => setDeletingTransaction(txn)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* EDIT MODAL */}
      {editingTransaction && (
  <EditTransactionModal
    isOpen={!!editingTransaction}   // ✅ add this line
    transaction={editingTransaction}
    onClose={() => setEditingTransaction(null)}
    onSave={(updatedTxn) => {
      handleSaveEdit(updatedTxn);
      setEditingTransaction(null);
    }}
  />
)}


      {/* DELETE MODAL */}
      {deletingTransaction && (
  <DeleteConfirmationModal
    isOpen={!!deletingTransaction}   // ✅ Add this line
    onClose={() => setDeletingTransaction(null)}
    onConfirm={() => {
      handleDelete(deletingTransaction.id);
      setDeletingTransaction(null);
    }}
  />
)}
    </div>
  );
}

export default TransactionList;
