// src/components/CreateTransaction.jsx
// src/components/CreateTransaction.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { Utensils, Bus, Wallet, Music, ShoppingBag, HeartPulse, GraduationCap, WalletCards, MoreHorizontal } from "lucide-react";

const categoryIcons = {
  food: <Utensils size={18} />,
  transport: <Bus size={18} />,
  bills: <Wallet size={18} />,
  entertainment: <Music size={18} />,
  shopping: <ShoppingBag size={18} />,
  health: <HeartPulse size={18} />,
  education: <GraduationCap size={18} />,
  salary: <WalletCards size={18} />,
  other: <MoreHorizontal size={18} />,
};
function CreateTransactionModal({ isOpen, onClose, onNewTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("transactions/", {
        title,
        amount,
        category,
        type,
        date,
      });
      onNewTransaction(response.data);
      onClose();
      setTitle(""); setAmount(""); setCategory(""); setType("expense"); setDate("");
    } catch (error) {
      console.error("Error creating transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-md p-6 relative">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Add Transaction
              </h2>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />

                <input
                  type="number"
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                  placeholder="Amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
<div className="flex items-center gap-3">
  <div className="text-gray-700 dark:text-gray-300">
    {categoryIcons[category] || <MoreHorizontal size={18} />}
  </div>
  <select
    className="flex-1 border border-gray-300 dark:border-gray-600 rounded-md p-2 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
    value={category}
    onChange={(e) => setCategory(e.target.value)}
    required
  >
    <option value="">Select Category</option>
    <option value="food">Food</option>
    <option value="transport">Transport</option>
    <option value="bills">Bills</option>
    <option value="entertainment">Entertainment</option>
    <option value="shopping">Shopping</option>
    <option value="health">Health</option>
    <option value="education">Education</option>
    <option value="salary">Salary</option>
    <option value="other">Other</option>
  </select>
</div>

                <select
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>

                <input
                  type="date"
                  className="border border-gray-300 dark:border-gray-600 rounded-md p-2 w-full 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100
                            focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-500"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    {loading ? "Saving..." : "Add"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CreateTransactionModal;
