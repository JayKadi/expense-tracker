// src/components/CreateTransaction.jsx
import { useState } from "react";
import api from "../services/api";

function CreateTransaction({ onNewTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTransaction = { title, amount, type, category, date };

    try {
      setLoading(true);
      const res = await api.post("transactions/", newTransaction);
      onNewTransaction(res.data);
      setTitle("");
      setAmount("");
      setCategory("");
      setDate("");
      setType("expense");
    } catch (err) {
      console.error("Error creating transaction:", err);
      alert("Failed to create transaction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginBottom: "2rem",
      maxWidth: "600px"
    }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </button>
    </form>
  );
}

export default CreateTransaction;
