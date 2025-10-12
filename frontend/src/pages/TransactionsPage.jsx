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
    <div style={{ padding: "2rem" }}>
      <h1>My Transactions</h1>
      <CreateTransaction onNewTransaction={handleNewTransaction} />
      <TransactionList transactions={transactions} />
    </div>
  );
}

export default TransactionsPage;
