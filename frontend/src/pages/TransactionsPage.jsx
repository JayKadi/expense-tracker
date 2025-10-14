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
  const totalIncome = transactions
  .filter(txn => txn.type === "income")
  .reduce((sum, txn) => sum + Number(txn.amount), 0);

const totalExpense = transactions
  .filter(txn => txn.type === "expense")
  .reduce((sum, txn) => sum + Number(txn.amount), 0);

const balance = totalIncome - totalExpense;

  return (
    <div className="max-w-6xl mx-auto p-4">{/*limits width on large screens and centers horizontally.*/}
      {/* Page Header */}
      <h1 className="text-3xl font-bold text-center mb-6">Expense Tracker</h1> {/*big, bold, centered page title.*/}
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 font-medium">Income</p>
          <p className="text-green-600 font-bold text-xl">Ksh {totalIncome}</p>
        </div>
        <div className="bg-red-50 shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 font-medium">Expenses</p>
          <p className="text-red-600 font-bold text-xl">Ksh {totalExpense}</p>
        </div>
        <div className="bg-blue-50 shadow rounded-lg p-4 text-center">
          <p className="text-gray-500 font-medium">Balance</p>
          <p className="text-blue-600 font-bold text-xl">Ksh {balance}</p>
        </div>
      </div>

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
