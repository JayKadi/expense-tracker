// src/components/TransactionList.jsx
// src/components/TransactionList.jsx
import { useRef, useCallback, useState, useEffect } from "react";
import api from "../services/api";
import EditTransactionModal from "./EditTransactionModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { Pencil, Trash2 } from "lucide-react";



function TransactionList({ transactions, onDelete, onEdit, loadMore }) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const handleDelete = async (id) => {
  if (onDelete) onDelete(id);
};

  const handleSaveEdit = async (updatedTxn) => {
  if (onEdit) onEdit(updatedTxn);
};

  //infinite scroll handles page advancement using intersectionobserver

  const observer = useRef();

  const lastTxnRef= useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadMore]
  );

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
