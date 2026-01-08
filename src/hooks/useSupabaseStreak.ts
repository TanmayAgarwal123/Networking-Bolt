import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { StreakData } from '../types';

export function useSupabaseStreak() {
  const { user, isAuthenticated } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 1,
    longestStreak: 1,
    lastActivityDate: '',
    streakHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user && supabase) {
      fetchStreakData();
    } else {
      setStreakData({
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: '',
        streakHistory: []
      });
      setLoading(false);
    }
  }, [isAuthenticated, user?.id]);

  const fetchStreakData = async () => {
    if (!user || !supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('streak_data')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching streak data:', error);
        return;
      }

      if (data) {
        setStreakData({
          currentStreak: data.current_streak,
          longestStreak: data.longest_streak,
          lastActivityDate: data.last_activity_date,
          streakHistory: (data.streak_history as any[]) || []
        });
      }
    } catch (error) {
      console.error('Error fetching streak data:', error);
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activity: string, type: 'contact' | 'meeting' | 'goal' = 'contact') => {
    if (!user || !supabase) return streakData;

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
      
      const newActivity = { date: today, activity, type };
      const newHistory = [...streakData.streakHistory, newActivity].slice(-30); // Keep last 30 days
      
      const newStreakData = {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, streakData.longestStreak),
        lastActivityDate: today,
        streakHistory: newHistory
      };

      try {
        const { error } = await supabase
          .from('streak_data')
          .upsert({
            user_id: user.id,
            current_streak: newStreakData.currentStreak,
            longest_streak: newStreakData.longestStreak,
            last_activity_date: newStreakData.lastActivityDate,
            streak_history: newStreakData.streakHistory
          });

        if (!error) {
          setStreakData(newStreakData);
          return newStreakData;
        }
      } catch (error) {
        console.error('Error updating streak data:', error);
      }
    }
    
    return streakData;
  };

  const checkStreakValidity = async () => {
    if (!user || !supabase) return streakData;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // For new users, initialize with day 1
    if (!streakData.lastActivityDate && streakData.currentStreak === 0) {
      const initialStreakData = {
        ...streakData,
        currentStreak: 1,
        longestStreak: 1
      };
      
      try {
        await supabase
          .from('streak_data')
          .upsert({
            user_id: user.id,
            current_streak: 1,
            longest_streak: 1,
            last_activity_date: today,
            streak_history: []
          });
        
        setStreakData(initialStreakData);
        return initialStreakData;
      } catch (error) {
        console.error('Error initializing streak data:', error);
      }
    }
    
    // If last activity was more than 1 day ago, reset streak
    if (streakData.lastActivityDate && 
        streakData.lastActivityDate !== today && 
        streakData.lastActivityDate !== yesterday) {
      const resetStreakData = {
        ...streakData,
        currentStreak: 1
      };
      
      try {
        await supabase
          .from('streak_data')
          .update({ current_streak: 1 })
          .eq('user_id', user.id);
        
        setStreakData(resetStreakData);
        return resetStreakData;
      } catch (error) {
        console.error('Error resetting streak data:', error);
      }
    }
    
    return streakData;
  };

  return {
    streakData,
    loading,
    addActivity,
    checkStreakValidity,
    refetch: fetchStreakData
  };
}