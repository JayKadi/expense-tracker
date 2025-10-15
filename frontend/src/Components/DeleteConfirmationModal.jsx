import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-gray-200 dark:border-gray-700"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 150, damping: 18 }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full">
                <AlertTriangle
                  size={36}
                  className="text-red-600 dark:text-red-400"
                />
              </div>

              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Confirm Deletion
              </h2>

              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Are you sure you want to delete this transaction?{" "}
                <br /> This action <span className="font-semibold">cannot be undone</span>.
              </p>

              <div className="flex justify-center gap-3 mt-4 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={onConfirm}
                  className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DeleteConfirmationModal;

