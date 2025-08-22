import { FoodEntry, DailyStats, WeeklyStats, AnalyticsData, MealType } from '../types';

export const calculateDailyStats = (entries: FoodEntry[]): DailyStats[] => {
  const dailyMap = new Map<string, DailyStats>();

  entries.forEach(entry => {
    const date = entry.date;
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        date,
        totalCalories: 0,
        mealsCount: 0,
        breakdown: { Breakfast: 0, Lunch: 0, Dinner: 0, Snack: 0 }
      });
    }

    const dayStats = dailyMap.get(date)!;
    dayStats.totalCalories += entry.calories;
    dayStats.mealsCount += 1;
    dayStats.breakdown[entry.meal] += entry.calories;
  });

  return Array.from(dailyMap.values()).sort((a, b) => a.date.localeCompare(b.date));
};

export const calculateWeeklyStats = (dailyStats: DailyStats[]): WeeklyStats[] => {
  const weeklyMap = new Map<string, { totalCalories: number; daysLogged: number }>();

  dailyStats.forEach(day => {
    const date = new Date(day.date);
    const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
    const weekKey = weekStart.toISOString().split('T')[0];

    if (!weeklyMap.has(weekKey)) {
      weeklyMap.set(weekKey, { totalCalories: 0, daysLogged: 0 });
    }

    const weekStats = weeklyMap.get(weekKey)!;
    weekStats.totalCalories += day.totalCalories;
    weekStats.daysLogged += 1;
  });

  return Array.from(weeklyMap.entries())
    .map(([week, stats]) => ({
      week,
      avgCalories: Math.round(stats.totalCalories / stats.daysLogged),
      totalCalories: stats.totalCalories,
      daysLogged: stats.daysLogged
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
};

export const performAdvancedAnalytics = (entries: FoodEntry[], targetCalories: number = 2000): AnalyticsData => {
  const dailyStats = calculateDailyStats(entries);
  const recent7Days = dailyStats.slice(-7).filter(day => day.totalCalories > 0);
  
  // If no recent data, return default values
  if (recent7Days.length === 0) {
    return {
      trend: 'stable',
      avgDailyCalories: 0,
      mostCommonMeal: 'Breakfast',
      predictedNextWeek: targetCalories,
      complianceRate: 0
    };
  }

  // Trend analysis using linear regression
  const avgCalories = recent7Days.length > 0 
    ? recent7Days.reduce((sum, day) => sum + day.totalCalories, 0) / recent7Days.length 
    : 0;
  
  // Simple trend calculation
  const firstHalf = recent7Days.slice(0, Math.ceil(recent7Days.length / 2));
  const secondHalf = recent7Days.slice(Math.ceil(recent7Days.length / 2));
  
  const firstHalfAvg = firstHalf.length > 0 
    ? firstHalf.reduce((sum, day) => sum + day.totalCalories, 0) / firstHalf.length 
    : 0;
  const secondHalfAvg = secondHalf.length > 0 
    ? secondHalf.reduce((sum, day) => sum + day.totalCalories, 0) / secondHalf.length 
    : 0;
  
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  const difference = secondHalfAvg - firstHalfAvg;
  if (Math.abs(difference) > 100) {
    trend = difference > 0 ? 'increasing' : 'decreasing';
  }

  // Most common meal type
  const mealCounts = entries.reduce((acc, entry) => {
    acc[entry.meal] = (acc[entry.meal] || 0) + 1;
    return acc;
  }, {} as Record<MealType, number>);
  
  const mostCommonMeal = Object.entries(mealCounts).reduce((max, [meal, count]) => 
    count > max.count ? { meal: meal as MealType, count } : max, 
    { meal: 'Snack' as MealType, count: 0 }
  ).meal;

  // Prediction using simple moving average
  const predictedNextWeek = avgCalories;

  // Compliance rate (within 10% of target)
  const compliantDays = recent7Days.filter(day => {
    const deviation = Math.abs(day.totalCalories - targetCalories);
    const allowedDeviation = targetCalories * 0.15; // 15% tolerance
    return deviation <= allowedDeviation && day.totalCalories > 0;
  }
  ).length;
  
  const complianceRate = recent7Days.length > 0 
    ? Math.round((compliantDays / recent7Days.length) * 100)
    : 0;

  return {
    trend,
    avgDailyCalories: Math.round(avgCalories),
    mostCommonMeal,
    predictedNextWeek: Math.round(predictedNextWeek),
    complianceRate
  };
};

export const calculateNutritionalBalance = (entries: FoodEntry[]) => {
  const totals = entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + (entry.protein || 0),
    carbs: acc.carbs + (entry.carbs || 0),
    fat: acc.fat + (entry.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return {
    ...totals,
    proteinPercent: totals.calories > 0 ? Math.round((totals.protein * 4 / totals.calories) * 100) : 0,
    carbsPercent: totals.calories > 0 ? Math.round((totals.carbs * 4 / totals.calories) * 100) : 0,
    fatPercent: totals.calories > 0 ? Math.round((totals.fat * 9 / totals.calories) * 100) : 0
  };
};