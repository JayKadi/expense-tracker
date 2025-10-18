import { useState } from "react";
import { Pie, Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, BarElement, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

function ChartView({ data }) {
  const [chartType, setChartType] = useState("pie");

  const income = data.filter(txn => txn.type === "income")
                     .reduce((sum, txn) => sum + Number(txn.amount), 0);
  const expense = data.filter(txn => txn.type === "expense")
                      .reduce((sum, txn) => sum + Number(txn.amount), 0);

  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [{
      data: [income, expense],
      backgroundColor: ["#4ade80", "#f87171"],
      borderColor: ["#22c55e", "#ef4444"],
      borderWidth: 1,
    }],
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Income vs Expense</h2>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded px-2 py-1"
        >
          <option value="pie">Pie</option>
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
      </div>

      {chartType === "pie" && <Pie data={chartData} />}
      {chartType === "bar" && <Bar data={chartData} />}
      {chartType === "line" && <Line data={chartData} />}
    </div>
  );
}

export default ChartView;
