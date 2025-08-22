import React from 'react';
import { TrendingUp, TrendingDown, Target, Brain, Award } from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsInsightsProps {
  analytics: AnalyticsData;
  targetCalories: number;
}

export const AnalyticsInsights: React.FC<AnalyticsInsightsProps> = ({ analytics, targetCalories }) => {
  const getTrendIcon = () => {
    switch (analytics.trend) {
      case 'increasing': return <TrendingUp className="w-5 h-5 text-red-400" />;
      case 'decreasing': return <TrendingDown className="w-5 h-5 text-green-400" />;
      default: return <Target className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTrendMessage = () => {
    switch (analytics.trend) {
      case 'increasing': return 'Your calorie intake is trending upward. Consider monitoring portion sizes.';
      case 'decreasing': return 'Your calorie intake is decreasing. Ensure you\'re meeting your nutritional needs.';
      default: return 'Your calorie intake is stable. Great consistency!';
    }
  };

  const getComplianceColor = () => {
    if (analytics.complianceRate >= 70) return 'text-green-400';
    if (analytics.complianceRate >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        AI-Powered Insights
      </h3>
      
      <div className="space-y-4">
        {/* Trend Analysis */}
        <div className="flex items-start gap-3 p-4 bg-gray-700 rounded-lg">
          {getTrendIcon()}
          <div>
            <h4 className="font-medium text-white mb-1">Calorie Trend Analysis</h4>
            <p className="text-sm text-gray-300">{getTrendMessage()}</p>
            <p className="text-xs text-gray-400 mt-1">
              7-day average: {analytics.avgDailyCalories} calories
            </p>
          </div>
        </div>

        {/* Goal Compliance */}
        <div className="flex items-start gap-3 p-4 bg-gray-700 rounded-lg">
          <Award className={`w-5 h-5 ${getComplianceColor()}`} />
          <div>
            <h4 className="font-medium text-white mb-1">Goal Compliance</h4>
            <p className="text-sm text-gray-300">
              You're meeting your calorie goals <span className={getComplianceColor()}>{analytics.complianceRate}%</span> of the time
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Target: {targetCalories} calories/day
            </p>
          </div>
        </div>

        {/* Eating Patterns */}
        <div className="flex items-start gap-3 p-4 bg-gray-700 rounded-lg">
          <Target className="w-5 h-5 text-purple-400" />
          <div>
            <h4 className="font-medium text-white mb-1">Eating Patterns</h4>
            <p className="text-sm text-gray-300">
              Your most frequent meal type is <span className="text-purple-400 font-medium">{analytics.mostCommonMeal}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Consider balancing meal distribution throughout the day
            </p>
          </div>
        </div>

        {/* Prediction */}
        <div className="flex items-start gap-3 p-4 bg-gray-700 rounded-lg">
          <Brain className="w-5 h-5 text-cyan-400" />
          <div>
            <h4 className="font-medium text-white mb-1">Next Week Prediction</h4>
            <p className="text-sm text-gray-300">
              Based on current trends, predicted average: <span className="text-cyan-400 font-medium">{analytics.predictedNextWeek} calories/day</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Prediction based on 7-day moving average
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};