import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { Contact, Event, Achievement, Goal } from '../types';
import { Database } from '../types/database';

type ContactRow = Database['public']['Tables']['contacts']['Row'];
type EventRow = Database['public']['Tables']['events']['Row'];
type AchievementRow = Database['public']['Tables']['achievements']['Row'];
type GoalRow = Database['public']['Tables']['goals']['Row'];

// Helper functions to convert between database rows and app types
const convertContactFromDB = (row: ContactRow): Contact => ({
  id: row.id,
  name: row.name,
  role: row.role,
  company: row.company,
  location: row.location || '',
  email: row.email || '',
  phone: row.phone || '',
  linkedinUrl: row.linkedin_url || '',
  priority: row.priority,
  lastContact: row.last_contact,
  tags: row.tags,
  status: row.status,
  avatar: row.avatar,
  notes: row.notes,
  addedDate: row.added_date,
  industry: row.industry,
  expertise: row.expertise,
  lastInteractionDate: row.last_interaction_date ? new Date(row.last_interaction_date) : undefined,
});

const convertContactToDB = (contact: Contact, userId: string): Database['public']['Tables']['contacts']['Insert'] => ({
  id: contact.id,
  user_id: userId,
  name: contact.name,
  role: contact.role,
  company: contact.company,
  location: contact.location || null,
  email: contact.email || null,
  phone: contact.phone || null,
  linkedin_url: contact.linkedinUrl || null,
  priority: contact.priority,
  last_contact: contact.lastContact,
  tags: contact.tags,
  status: contact.status,
  avatar: contact.avatar,
  notes: contact.notes,
  industry: contact.industry,
  expertise: contact.expertise,
  added_date: contact.addedDate,
  last_interaction_date: contact.lastInteractionDate?.toISOString() || null,
});

const convertEventFromDB = (row: EventRow): Event => ({
  id: row.id,
  date: new Date(row.event_date + 'T' + row.event_time),
  time: row.event_time,
  title: row.title,
  type: row.type,
  location: row.location,
  priority: row.priority,
  contactId: row.contact_id || undefined,
  description: row.description || undefined,
  completed: row.completed,
});

const convertEventToDB = (event: Event, userId: string): Database['public']['Tables']['events']['Insert'] => ({
  id: event.id,
  user_id: userId,
  contact_id: event.contactId || null,
  title: event.title,
  event_date: event.date.toISOString().split('T')[0],
  event_time: event.time,
  type: event.type,
  location: event.location,
  priority: event.priority,
  description: event.description || '',
  completed: event.completed,
});

const convertAchievementFromDB = (row: AchievementRow): Achievement => ({
  id: row.id,
  title: row.title,
  description: row.description,
  earned: row.earned,
  icon: row.icon,
  earnedDate: row.earned_date || undefined,
  category: row.category,
  requirement: row.requirement || undefined,
  progress: row.progress || undefined,
  points: row.points,
});

const convertAchievementToDB = (achievement: Achievement, userId: string): Database['public']['Tables']['achievements']['Insert'] => ({
  id: achievement.id,
  user_id: userId,
  title: achievement.title,
  description: achievement.description,
  earned: achievement.earned,
  icon: achievement.icon,
  earned_date: achievement.earnedDate || null,
  category: achievement.category,
  requirement: achievement.requirement || 1,
  progress: achievement.progress || 0,
  points: achievement.points,
});

const convertGoalFromDB = (row: GoalRow): Goal => ({
  id: row.id,
  text: row.text,
  completed: row.completed,
  icon: row.icon,
  priority: row.priority,
  category: row.category,
  dueDate: row.due_date || undefined,
  createdDate: row.created_date,
  completedDate: row.completed_date || undefined,
});

const convertGoalToDB = (goal: Goal, userId: string): Database['public']['Tables']['goals']['Insert'] => ({
  id: goal.id,
  user_id: userId,
  text: goal.text,
  completed: goal.completed,
  icon: goal.icon,
  priority: goal.priority,
  category: goal.category,
  due_date: goal.dueDate || null,
  created_date: goal.createdDate,
  completed_date: goal.completedDate || null,
});

export function useSupabaseData() {
  const { user, isAuthenticated } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all user data
  useEffect(() => {
    if (isAuthenticated && user && supabase) {
      fetchAllData();
    } else {
      setContacts([]);
      setEvents([]);
      setAchievements([]);
      setGoals([]);
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchAllData = async () => {
    if (!user || !supabase) return;

    try {
      setLoading(true);
      
      // Fetch contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch events
      const { data: eventsData } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      // Fetch achievements
      const { data: achievementsData } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Fetch goals
      const { data: goalsData } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setContacts(contactsData?.map(convertContactFromDB) || []);
      setEvents(eventsData?.map(convertEventFromDB) || []);
      setAchievements(achievementsData?.map(convertAchievementFromDB) || []);
      setGoals(goalsData?.map(convertGoalFromDB) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Contact operations
  const addContact = async (contact: Contact) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .insert(convertContactToDB(contact, user.id));

      if (!error) {
        setContacts(prev => [contact, ...prev]);
      }
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const updateContact = async (contact: Contact) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('contacts')
        .update(convertContactToDB(contact, user.id))
        .eq('id', contact.id);

      if (!error) {
        setContacts(prev => prev.map(c => c.id === contact.id ? contact : c));
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('contacts')
        .delete()
        .eq('id', contactId);

      if (!error) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
        setEvents(prev => prev.filter(e => e.contactId !== contactId));
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  // Event operations
  const addEvent = async (event: Event) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('events')
        .insert(convertEventToDB(event, user.id));

      if (!error) {
        setEvents(prev => [...prev, event].sort((a, b) => a.date.getTime() - b.date.getTime()));
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const updateEvent = async (event: Event) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('events')
        .update(convertEventToDB(event, user.id))
        .eq('id', event.id);

      if (!error) {
        setEvents(prev => prev.map(e => e.id === event.id ? event : e).sort((a, b) => a.date.getTime() - b.date.getTime()));
      }
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (!error) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  // Achievement operations
  const addAchievement = async (achievement: Achievement) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .insert(convertAchievementToDB(achievement, user.id));

      if (!error) {
        setAchievements(prev => [achievement, ...prev]);
      }
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  const updateAchievement = async (achievement: Achievement) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('achievements')
        .update(convertAchievementToDB(achievement, user.id))
        .eq('id', achievement.id);

      if (!error) {
        setAchievements(prev => prev.map(a => a.id === achievement.id ? achievement : a));
      }
    } catch (error) {
      console.error('Error updating achievement:', error);
    }
  };

  const deleteAchievement = async (achievementId: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', achievementId);

      if (!error) {
        setAchievements(prev => prev.filter(a => a.id !== achievementId));
      }
    } catch (error) {
      console.error('Error deleting achievement:', error);
    }
  };

  // Goal operations
  const addGoal = async (goal: Goal) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert(convertGoalToDB(goal, user.id));

      if (!error) {
        setGoals(prev => [goal, ...prev]);
      }
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const updateGoal = async (goal: Goal) => {
    if (!user || !supabase) return;

    try {
      const { error } = await supabase
        .from('goals')
        .update(convertGoalToDB(goal, user.id))
        .eq('id', goal.id);

      if (!error) {
        setGoals(prev => prev.map(g => g.id === goal.id ? goal : g));
      }
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!supabase) return;
    
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', goalId);

      if (!error) {
        setGoals(prev => prev.filter(g => g.id !== goalId));
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  return {
    // Data
    contacts,
    events,
    achievements,
    goals,
    loading,
    
    // Contact operations
    addContact,
    updateContact,
    deleteContact,
    
    // Event operations
    addEvent,
    updateEvent,
    deleteEvent,
    
    // Achievement operations
    addAchievement,
    updateAchievement,
    deleteAchievement,
    
    // Goal operations
    addGoal,
    updateGoal,
    deleteGoal,
    
    // Refresh data
    refetch: fetchAllData,
  };
}