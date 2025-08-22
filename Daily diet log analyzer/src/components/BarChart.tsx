import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
  data: { label: string; value: number }[];
  title: string;
  color?: string;
  targetLine?: number;
}

export const BarChart: React.FC<BarChartProps> = ({ data, title, color = '#36A2EB', targetLine }) => {
  const chartData = {
    labels: data.map(item => item.label),
    datasets: [
      {
        label: 'Calories',
        data: data.map(item => item.value),
        backgroundColor: color + '80',
        borderColor: color,
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1F2937',
        titleColor: '#F3F4F6',
        bodyColor: '#E5E7EB',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
          maxRotation: 45,
        },
        grid: {
          color: '#374151',
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
        },
        grid: {
          color: '#374151',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      {targetLine && (
        <div className="mt-2 text-sm text-gray-400">
          Target: {targetLine} calories/day
        </div>
      )}
    </div>
  );
};