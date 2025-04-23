import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

export default function SentimentPieChart({ data }) {
  const chartData = [
    { name: "Positive", value: data.positive || 0 },
    { name: "Neutral", value: data.neutral || 0 },
    { name: "Negative", value: data.negative || 0 },
  ];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
