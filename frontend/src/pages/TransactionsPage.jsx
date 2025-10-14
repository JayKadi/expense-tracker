// src/pages/TransactionsPage.jsx
// src/pages/TransactionsPage.jsx
import { useState, useEffect } from "react";
import TransactionList from "../Components/TransactionList";
import CreateTransaction from "../Components/CreateTransaction";
import api from "../services/api";

function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  // Fetch initial transactions
  useEffect(() => {
    api.get("transactions/")
      .then((res) => setTransactions(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleNewTransaction = (txn) => {
    setTransactions((prev) => [txn, ...prev]);
  };

  return (
    <div className="max-w-6xl mx-auto p-4">{/*limits width on large screens and centers horizontally.*/}
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Expense Tracker</h1> {/*big, bold, centered page title.*/}

      {/* Main Container: Form + Transactions List */}
      <div className="flex flex-col md:flex-row gap-6"> {/*stacks on mobile, side-by-side on desktop.*/}
        {/* Left: Create Transaction Form */}
        <div className="md:w-1/3 bg-white shadow rounded-lg p-6">{/*form takes 1/3 width, list 2/3 on desktop.*/}
          <CreateTransaction onNewTransaction={handleNewTransaction} />
        </div>

        {/* Right: Transactions List */}
        <div className="md:w-2/3 bg-white shadow rounded-lg p-6"> {/*gives modern card look for both form and list*/}
          <TransactionList transactions={transactions} />
        </div>
      </div>
    </div>
  );
}

export default TransactionsPage;
