import React from 'react';
import { Trash2, Edit } from 'lucide-react';
import { FoodEntry } from '../types';

interface DataTableProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ entries, onDeleteEntry }) => {
  const getMealColor = (meal: string) => {
    switch (meal) {
      case 'Breakfast': return 'bg-orange-900 text-orange-200';
      case 'Lunch': return 'bg-blue-900 text-blue-200';
      case 'Dinner': return 'bg-purple-900 text-purple-200';
      case 'Snack': return 'bg-green-900 text-green-200';
      default: return 'bg-gray-700 text-gray-200';
    }
  };

  const sortedEntries = [...entries].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  }).slice(0, 100); // Limit to maximum 100 entries

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Recent Entries</h3>
        <span className="text-sm text-gray-400">
          Showing {Math.min(entries.length, 100)} of {entries.length} entries
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Meal</th>
              <th className="px-4 py-3">Food</th>
              <th className="px-4 py-3">Calories</th>
              <th className="px-4 py-3">Protein</th>
              <th className="px-4 py-3">Carbs</th>
              <th className="px-4 py-3">Fat</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntries.map((entry) => (
              <tr key={entry.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-750">
                <td className="px-4 py-3">{entry.date}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMealColor(entry.meal)}`}>
                    {entry.meal}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium">{entry.food}</td>
                <td className="px-4 py-3">{entry.calories}</td>
                <td className="px-4 py-3">{entry.protein?.toFixed(1) || '0.0'}g</td>
                <td className="px-4 py-3">{entry.carbs?.toFixed(1) || '0.0'}g</td>
                <td className="px-4 py-3">{entry.fat?.toFixed(1) || '0.0'}g</td>
                <td className="px-4 py-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {entries.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No entries found. Start by adding your first meal!
          </div>
        )}
      </div>
    </div>
  );
};