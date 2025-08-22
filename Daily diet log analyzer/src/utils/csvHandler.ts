import Papa from 'papaparse';
import { FoodEntry } from '../types';

export const exportToCSV = (entries: FoodEntry[]): void => {
  const csvData = entries.map(entry => ({
    Date: entry.date,
    Meal: entry.meal,
    Food: entry.food,
    Calories: entry.calories,
    Protein: entry.protein || 0,
    Carbs: entry.carbs || 0,
    Fat: entry.fat || 0,
    Timestamp: entry.timestamp
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `diet_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const importFromCSV = (file: File): Promise<FoodEntry[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const entries: FoodEntry[] = results.data.map((row: any, index: number) => ({
            id: `imported-${Date.now()}-${index}`,
            date: row.Date || new Date().toISOString().split('T')[0],
            meal: row.Meal || 'Snack',
            food: row.Food || 'Unknown',
            calories: parseInt(row.Calories) || 0,
            protein: parseFloat(row.Protein) || 0,
            carbs: parseFloat(row.Carbs) || 0,
            fat: parseFloat(row.Fat) || 0,
            timestamp: row.Timestamp || new Date().toISOString()
          }));
          resolve(entries.filter(entry => entry.food !== 'Unknown'));
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
};