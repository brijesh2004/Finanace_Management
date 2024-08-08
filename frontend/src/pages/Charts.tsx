// src/components/Charts.tsx
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ChartsProps {
  incomeData: { amount: number; date: string; }[];
  expenseData: { amount: number; date: string; }[];
}

const Charts: React.FC<ChartsProps> = ({ incomeData, expenseData }) => {
  const processChartData = (data: { amount: number; date: string; }[]) => {
    const dateMap = new Map<string, number>();

    data.forEach(item => {
      const date = new Date(item.date).toLocaleDateString();
      if (!dateMap.has(date)) {
        dateMap.set(date, 0);
      }
      dateMap.set(date, (dateMap.get(date) || 0) + item.amount);
    });

    const dates = Array.from(dateMap.keys());
    const amounts = Array.from(dateMap.values());

    return { dates, amounts };
  };

  const incomeChartData = processChartData(incomeData);
  const expenseChartData = processChartData(expenseData);

  // Merge income and expense dates
  const allDates = Array.from(new Set([...incomeChartData.dates, ...expenseChartData.dates]));

  // Create a map for easy lookup
  const incomeMap = new Map(incomeChartData.dates.map((date, index) => [date, incomeChartData.amounts[index]]));
  const expenseMap = new Map(expenseChartData.dates.map((date, index) => [date, expenseChartData.amounts[index]]));

  const barData = {
    labels: allDates,
    datasets: [
      {
        label: 'Income',
        data: allDates.map(date => incomeMap.get(date) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: allDates.map(date => expenseMap.get(date) || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Expenses and Income Over Time</h2>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <Bar data={barData} />
      </div>
    </div>
  );
};

export default Charts;
