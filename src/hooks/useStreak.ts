import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: { date: string; activity: string; type: 'contact' | 'meeting' | 'goal' }[];
}

export function useStreak() {
  const [streakData, setStreakData] = useLocalStorage<StreakData>('networkmaster-streak', {
    currentStreak: 1,
    longestStreak: 1,
    lastActivityDate: '',
    streakHistory: []
  });

  const addActivity = (activity: string, type: 'contact' | 'meeting' | 'goal' = 'contact') => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Check if we already have activity today
    const hasActivityToday = streakData.streakHistory.some(h => h.date === today);
    
    if (!hasActivityToday) {
      let newStreak = 1;
      
      // If last activity was yesterday, continue streak
      if (streakData.lastActivityDate === yesterday) {
        newStreak = streakData.currentStreak + 1;
      } else if (!streakData.lastActivityDate) {
        // First time user - start with day 1
        newStreak = 1;
      }
      
      const newStreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streakData.longestStreak),
        lastActivityDate: today,
        streakHistory: [
          ...streakData.streakHistory,
          { date: today, activity, type }
        ].slice(-30) // Keep last 30 days
      };
      
      setStreakData(newStreakData);
      return newStreakData;
    }
    
    return streakData;
  };

  const checkStreakValidity = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // For new users, initialize with day 1
    if (!streakData.lastActivityDate && streakData.currentStreak === 0) {
      const initialStreakData = {
        ...streakData,
        currentStreak: 1,
        longestStreak: 1
      };
      setStreakData(initialStreakData);
      return initialStreakData;
    }
    
    // If last activity was more than 1 day ago, reset streak
    if (streakData.lastActivityDate && 
        streakData.lastActivityDate !== today && 
        streakData.lastActivityDate !== yesterday) {
      const resetStreakData = {
        ...streakData,
        currentStreak: 1
      };
      setStreakData(resetStreakData);
      return resetStreakData;
    }
    
    return streakData;
  };

  useEffect(() => {
    checkStreakValidity();
  }, []);

  return {
    streakData: checkStreakValidity(),
    addActivity
  };
}