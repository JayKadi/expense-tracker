// src/components/CreateTransaction.jsx
// src/components/CreateTransaction.jsx
import { useState } from "react";
import api from "../services/api";

function CreateTransaction({ onNewTransaction }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("expense");
  const [date, setDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("transactions/", { title, amount, category, type, date });
      onNewTransaction(response.data); // Update parent state
      setTitle(""); setAmount(""); setCategory(""); setType("expense"); setDate("");
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4"> 
      <h2 className="text-xl font-semibold mb-2">Add Transaction</h2>

      <input
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <input
        type="number"
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />

      <input
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />

      <select
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
      </select>

      <input
        type="date"
        className="border rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <button
        type="submit"
        className="bg-indigo-500 text-white font-semibold py-2 rounded-md hover:bg-indigo-600 transition"
      >
        Add Transaction
      </button>
    </form>
  );
}

export default CreateTransaction;
