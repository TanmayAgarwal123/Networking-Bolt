import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { useStreak } from '../hooks/useStreak';

interface StreakCounterProps {
  // No props needed - we'll get data from the hook
}

const StreakCounter: React.FC<StreakCounterProps> = () => {
  const { streakData } = useStreak();
  const weeklyGoal = 7;

            <span className="font-medium text-gray-900">
              {Math.round((Math.min(streakData.currentStreak, weeklyGoal) / weeklyGoal) * 100)}%
            </span>
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Networking Streak</h3>
        <div className="flex items-center space-x-2">
              style={{ 
                width: `${Math.min((streakData.currentStreak / weeklyGoal) * 100, 100)}%` 
              }}
          <span className="text-sm font-medium text-orange-600">On fire!</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="relative">
            <div className={`w-20 h-20 mx-auto bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-3 ${streakData.currentStreak > 0 ? 'animate-pulse' : ''}`}>
              <span className="text-2xl font-bold text-white">{streakData.currentStreak}</span>
                    <span className={`w-2 h-2 rounded-full ${
                      activity.type === 'contact' ? 'bg-blue-400' :
                      activity.type === 'meeting' ? 'bg-green-400' : 'bg-purple-400'
                    }`}></span>
            {streakData.currentStreak > 0 && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Flame className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          <p className="text-sm font-medium text-gray-900">Current Streak</p>
          <p className="text-xs text-gray-600">Days in a row</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mb-3">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-900">Best Streak</p>
          <p className="text-xs text-gray-600">{streakData.longestStreak} days</p>
        </div>

        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <p className="text-sm font-medium text-gray-900">Weekly Goal</p>
          <p className="text-xs text-gray-600">{Math.min(streakData.currentStreak, weeklyGoal)}/{weeklyGoal} completed</p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Weekly Progress</span>
          <span className="font-medium text-gray-900">{Math.round((Math.min(streakData.currentStreak, weeklyGoal) / weeklyGoal) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min((Math.min(streakData.currentStreak, weeklyGoal) / weeklyGoal) * 100, 100)}%` }}
          ></div>
        </div>
        
        {streakData.streakHistory.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Recent Activity:</p>
            <div className="space-y-1">
              {streakData.streakHistory.slice(-3).map((activity, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>{activity.date}: {activity.activity}</span>
                </div>
              ))}
            </div>
          </div>
          
          {streakData.streakHistory.length === 0 && (
            <div className="mt-4 text-center text-xs text-gray-500">
              <p>Start your networking journey today!</p>
              <p>Add a contact or complete a goal to begin your streak.</p>
            </div>
          )}
        )}
      </div>
    </div>
  );
};

export default StreakCounter;