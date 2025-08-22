export interface FoodEntry {
  id: string;
  date: string;
  meal: MealType;
  food: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  timestamp: string;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface DailyStats {
  date: string;
  totalCalories: number;
  mealsCount: number;
  breakdown: Record<MealType, number>;
}

export interface WeeklyStats {
  week: string;
  avgCalories: number;
  totalCalories: number;
  daysLogged: number;
}

export interface NutritionGoals {
  dailyCalories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalyticsData {
  trend: 'increasing' | 'decreasing' | 'stable';
  avgDailyCalories: number;
  mostCommonMeal: MealType;
  predictedNextWeek: number;
  complianceRate: number;
}