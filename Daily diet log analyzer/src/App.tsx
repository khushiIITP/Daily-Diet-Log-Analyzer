import React, { useState, useEffect } from 'react';
import { Calculator, Download, Upload, BarChart3, PieChart, Brain, Target, Activity, Utensils } from 'lucide-react';
import { FoodEntry, NutritionGoals } from './types';
import { FoodEntryForm } from './components/FoodEntryForm';
import { StatCard } from './components/StatCard';
import { PieChart as CustomPieChart } from './components/PieChart';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';
import { AnalyticsInsights } from './components/AnalyticsInsights';
import { exportToCSV, importFromCSV } from './utils/csvHandler';
import { calculateDailyStats, calculateWeeklyStats, performAdvancedAnalytics, calculateNutritionalBalance } from './utils/analytics';

function App() {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [goals, setGoals] = useState<NutritionGoals>({
    dailyCalories: 2000,
    protein: 120,
    carbs: 250,
    fat: 65
  });

  // Load data from localStorage on startup
  useEffect(() => {
    const savedEntries = localStorage.getItem('dietEntries');
    const savedGoals = localStorage.getItem('nutritionGoals');
    
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Save data to localStorage whenever entries or goals change
  useEffect(() => {
    localStorage.setItem('dietEntries', JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('nutritionGoals', JSON.stringify(goals));
  }, [goals]);

  const handleAddEntry = (newEntry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const entry: FoodEntry = {
      ...newEntry,
      id: `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    setEntries(prev => [...prev, entry]);
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const handleExportCSV = () => {
    exportToCSV(entries);
  };

  const handleImportCSV = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const importedEntries = await importFromCSV(file);
        setEntries(prev => [...prev, ...importedEntries]);
      } catch (error) {
        alert('Error importing CSV file. Please check the format.');
      }
    }
  };

  // Calculate statistics
  const dailyStats = calculateDailyStats(entries);
  const weeklyStats = calculateWeeklyStats(dailyStats);
  const recentStats = dailyStats.slice(-7);
  const analytics = performAdvancedAnalytics(entries, goals.dailyCalories);
  const nutritionalBalance = calculateNutritionalBalance(entries.filter(entry => 
    entry.date === new Date().toISOString().split('T')[0]
  ));

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter(entry => entry.date === today);
  const todayCalories = todayEntries.reduce((sum, entry) => sum + entry.calories, 0);
  const todayMeals = todayEntries.length;

  // This week's stats
  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const thisWeekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= thisWeekStart;
  });

  // Calculate meal breakdown for pie chart
  const mealBreakdown = todayEntries.reduce((acc, entry) => {
    acc[entry.meal] = (acc[entry.meal] || 0) + entry.calories;
    return acc;
  }, {} as Record<any, number>);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calculator className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold">Daily Diet Log Analyzer</h1>
              <p className="text-gray-400 text-sm">Advanced nutrition tracking with ML-powered insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
              id="csv-upload"
            />
            <label
              htmlFor="csv-upload"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </label>
            
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Food Entry Form */}
          <div className="lg:col-span-1">
            <FoodEntryForm onAddEntry={handleAddEntry} />
          </div>

          {/* Key Statistics */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              title="Today's Calories"
              value={todayCalories}
              icon={Activity}
              color="bg-blue-600"
              subtitle={`of ${goals.dailyCalories} goal`}
              trend={todayCalories > goals.dailyCalories ? 'up' : todayCalories < goals.dailyCalories * 0.8 ? 'down' : 'stable'}
            />
            
            <StatCard
              title="Today's Meals"
              value={todayMeals}
              icon={Utensils}
              color="bg-green-600"
              subtitle="entries logged"
            />
            
            <StatCard
              title="Weekly Avg"
              value={analytics.avgDailyCalories}
              icon={BarChart3}
              color="bg-purple-600"
              subtitle="calories/day"
              trend={analytics.trend === 'increasing' ? 'up' : analytics.trend === 'decreasing' ? 'down' : 'stable'}
            />
            
            <StatCard
              title="Goal Compliance"
              value={`${analytics.complianceRate}%`}
              icon={Target}
              color="bg-orange-600"
              subtitle="within target range"
            />
          </div>
        </div>

        {/* Analytics Insights */}
        <div className="mb-8">
          <AnalyticsInsights analytics={analytics} targetCalories={goals.dailyCalories} />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Meal Distribution Pie Chart */}
          <CustomPieChart
            data={mealBreakdown}
            title="Today's Calorie Distribution by Meal"
          />

          {/* Weekly Trends Bar Chart */}
          <BarChart
            data={recentStats.map(stat => ({
              label: new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              value: stat.totalCalories
            }))}
            title="7-Day Calorie Trend"
            color="#36A2EB"
            targetLine={goals.dailyCalories}
          />
        </div>

        {/* Data Table */}
        <div className="mb-8">
          <DataTable
            entries={entries} // Show all entries (DataTable will limit to 100)
            onDeleteEntry={handleDeleteEntry}
          />
        </div>

        {/* Goals Configuration */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4">Nutrition Goals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Daily Calories</label>
              <input
                type="number"
                value={goals.dailyCalories}
                onChange={(e) => setGoals({ ...goals, dailyCalories: parseInt(e.target.value) || 2000 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Protein (g)</label>
              <input
                type="number"
                value={goals.protein}
                onChange={(e) => setGoals({ ...goals, protein: parseInt(e.target.value) || 120 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Carbs (g)</label>
              <input
                type="number"
                value={goals.carbs}
                onChange={(e) => setGoals({ ...goals, carbs: parseInt(e.target.value) || 250 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Fat (g)</label>
              <input
                type="number"
                value={goals.fat}
                onChange={(e) => setGoals({ ...goals, fat: parseInt(e.target.value) || 65 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;