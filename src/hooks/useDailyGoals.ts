import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Goal } from '../types';

interface DailyGoals {
  date: string;
  goals: Goal[];
  generated: boolean;
}

export function useDailyGoals() {
  const [dailyGoals, setDailyGoals] = useLocalStorage<DailyGoals[]>('networkmaster-daily-goals', []);
  const { generateDailyGoals } = useAI();

  const generateDailyGoalsSync = (contacts: any[]): Goal[] => {
    const today = new Date().toISOString().split('T')[0];
    
    // AI-powered goal generation based on contacts and networking best practices
    const goalTemplates = [
      {
        text: "Send a LinkedIn message to a high-priority contact",
        icon: "MessageSquare",
        priority: "high" as const,
        category: "outreach"
      },
      {
        text: "Schedule a coffee chat with someone from your network",
        icon: "Coffee",
        priority: "medium" as const,
        category: "meeting"
      },
      {
        text: "Follow up with a contact you haven't spoken to in 2+ weeks",
        icon: "Phone",
        priority: "high" as const,
        category: "follow-up"
      },
      {
        text: "Add 2 new contacts to your network",
        icon: "UserPlus",
        priority: "medium" as const,
        category: "growth"
      },
      {
        text: "Update notes for 3 existing contacts",
        icon: "Edit",
        priority: "low" as const,
        category: "maintenance"
      },
      {
        text: "Research and connect with an industry expert",
        icon: "Search",
        priority: "medium" as const,
        category: "expansion"
      },
      {
        text: "Share a valuable article with your network",
        icon: "Share",
        priority: "low" as const,
        category: "value-add"
      }
    ];

    // Smart goal selection based on network state
    let selectedTemplates = [...goalTemplates];
    
    // Prioritize based on network size
    if (contacts.length < 5) {
      selectedTemplates = selectedTemplates.filter(t => 
        t.category === 'growth' || t.category === 'outreach'
      );
    }
    
    // Select 3-4 goals
    const selectedGoals = selectedTemplates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(Math.floor(Math.random() * 2) + 3, selectedTemplates.length))
      .map((template, index) => ({
        id: `daily-${today}-${index}`,
        text: template.text,
        completed: false,
        icon: template.icon,
        priority: template.priority,
        category: template.category,
        dueDate: today,
        createdDate: today
      }));

    return selectedGoals;
  };

  const getTodaysGoals = async (contacts: any[]): Promise<Goal[]> => {
    const today = new Date().toISOString().split('T')[0];
    const todaysGoals = dailyGoals.find(dg => dg.date === today);

    if (!todaysGoals) {
      // Generate new goals for today
      const newGoals = await generateDailyGoals(contacts, []);
      const newDailyGoals = {
        date: today,
        goals: newGoals,
        generated: true
      };
      
      setDailyGoals([...dailyGoals.filter(dg => dg.date !== today), newDailyGoals]);
      return newGoals;
    }

    return todaysGoals.goals;
  };

  const updateTodaysGoals = (updatedGoals: Goal[]) => {
    const today = new Date().toISOString().split('T')[0];
    const updatedDailyGoals = dailyGoals.map(dg => 
      dg.date === today 
        ? { ...dg, goals: updatedGoals }
        : dg
    );
    
    setDailyGoals(updatedDailyGoals);
  };

  const addCustomGoal = (goalText: string, priority: 'high' | 'medium' | 'low' = 'medium') => {
    const today = new Date().toISOString().split('T')[0];
    const newGoal: Goal = {
      id: `custom-${Date.now()}`,
      text: goalText,
      completed: false,
      icon: "Target",
      priority,
      category: "custom",
      dueDate: today,
      createdDate: today
    };

    getTodaysGoals([]).then(todaysGoals => {
      updateTodaysGoals([...todaysGoals, newGoal]);
    });
  };

  return {
    getTodaysGoals,
    updateTodaysGoals,
    addCustomGoal
  };
}