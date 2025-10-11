// src/components/TransactionList.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

function TransactionList({ transactions: propTransactions }) {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (propTransactions) {
      // Use transactions passed from parent
      setTransactions(propTransactions);
    } else {
      // Fetch from API if no prop is provided
      api.get("transactions/")
        .then((response) => setTransactions(response.data))
        .catch((error) => console.error("Error fetching transactions:", error));
    }
  }, [propTransactions]); // re-run if propTransactions changes

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "left" }}>
      <h2>Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {transactions.map((txn) => (
            <li
              key={txn.id}
              style={{
                backgroundColor: txn.type === "expense" ? "#ffe0e0" : "#e0ffe0",
                marginBottom: "0.5rem",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <strong>{txn.title}</strong> — {txn.category}  
              <span style={{ float: "right" }}>
                {txn.type === "expense" ? "-" : "+"} Ksh {txn.amount}
              </span>
              <br />
              <small>{txn.date}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransactionList;
