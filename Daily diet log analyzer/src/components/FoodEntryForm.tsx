import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { FoodEntry, MealType } from '../types';

interface FoodEntryFormProps {
  onAddEntry: (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => void;
}

export const FoodEntryForm: React.FC<FoodEntryFormProps> = ({ onAddEntry }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    meal: 'Breakfast' as MealType,
    food: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.food || !formData.calories) return;

    onAddEntry({
      date: formData.date,
      meal: formData.meal,
      food: formData.food,
      calories: parseInt(formData.calories),
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0
    });

    setFormData({
      ...formData,
      food: '',
      calories: '',
      protein: '',
      carbs: '',
      fat: ''
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Plus className="w-5 h-5" />
        Add Food Entry
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Meal</label>
            <select
              value={formData.meal}
              onChange={(e) => setFormData({ ...formData, meal: e.target.value as MealType })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Food Item</label>
          <input
            type="text"
            value={formData.food}
            onChange={(e) => setFormData({ ...formData, food: e.target.value })}
            placeholder="e.g., Grilled Chicken Breast"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Calories</label>
            <input
              type="number"
              value={formData.calories}
              onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
              placeholder="250"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Protein (g)</label>
            <input
              type="number"
              step="0.1"
              value={formData.protein}
              onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
              placeholder="25"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Carbs (g)</label>
            <input
              type="number"
              step="0.1"
              value={formData.carbs}
              onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
              placeholder="30"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Fat (g)</label>
            <input
              type="number"
              step="0.1"
              value={formData.fat}
              onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
              placeholder="10"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Entry
        </button>
      </form>
    </div>
  );
};