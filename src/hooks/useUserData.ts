import { useAuth } from './useAuth';
import { useLocalStorage } from './useLocalStorage';
import { Contact, Event, Achievement, Goal } from '../types';

export function useUserData() {
  const { user } = useAuth();
  
  // Create user-specific keys for data storage
  const getUserKey = (key: string) => user ? `${key}-${user.id}` : key;
  
  // User-specific data hooks
  const [contacts, setContacts] = useLocalStorage<Contact[]>(getUserKey('networkmaster-contacts'), []);
  const [events, setEvents] = useLocalStorage<Event[]>(getUserKey('networkmaster-events'), []);
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>(getUserKey('networkmaster-achievements'), []);
  const [goals, setGoals] = useLocalStorage<Goal[]>(getUserKey('networkmaster-goals'), []);
  
  return {
    contacts,
    setContacts,
    events,
    setEvents,
    achievements,
    setAchievements,
    goals,
    setGoals,
    userId: user?.id
  };
}