// src/components/TransactionList.jsx
// src/components/TransactionList.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

function TransactionList({ transactions: propTransactions,onDelete  }) {
  const [transactions, setTransactions] = useState([]);

 useEffect(() => {
  if (propTransactions) {
    setTransactions(propTransactions);
  } else {
    api.get("transactions/")
      .then((response) => setTransactions(response.data))
      .catch((error) => console.error("Error fetching transactions:", error));
  }
}, [propTransactions]);
 const handleDelete = async (id) => {
    try {
      await api.delete(`transactions/${id}/`);
      // Update local state
      setTransactions(transactions.filter(txn => txn.id !== id));
      if (onDelete) onDelete(id); // inform parent if needed
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-4"> {/*centers content with padding.*/}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Transactions</h2>

      {transactions.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <ul className="space-y-4">{/*ensures consistent vertical gaps between cards.*/}
          {transactions.map((txn) => (
  
            <li
              key={txn.id}
              className={`flex justify-between items-center p-4 rounded-lg shadow-md
                ${txn.type === "expense" ? "bg-red-50" : "bg-green-50"}`}
            >
              <div>
                <p className="font-medium text-gray-800">{txn.title}</p>
                <p className="text-gray-500 text-sm">{txn.category}</p>
                <p className="text-gray-400 text-xs">{txn.date}</p>
              </div>
              <span
                className={`font-semibold ${
                  txn.type === "expense" ? "text-red-600" : "text-green-600"
                }`}
              >
                {txn.type === "expense" ? "-" : "+"} Ksh {txn.amount}
              </span>
              <button
              className="text-red-500 hover:text-red-700 text-sm"
              onClick={() => onDelete(txn.id)}
            >
              🗑 Delete
            </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;
