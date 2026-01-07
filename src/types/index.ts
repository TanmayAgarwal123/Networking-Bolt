export interface Contact {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  email: string;
  phone?: string;
  linkedinUrl?: string;
  priority: number; // 1-100 scale
  lastContact: string;
  tags: string[];
  status: 'active' | 'needs_followup' | 'cold';
  avatar: string;
  notes: string;
  addedDate: string;
  industry: string;
  expertise: string[];
  lastInteractionDate?: Date;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: string;
  createdDate: string;
  completedDate?: string;
}

export interface Event {
  id: string;
  date: Date;
  time: string;
  title: string;
  type: 'meetup' | 'call' | 'event' | 'follow-up';
  location: string;
  priority: 'high' | 'medium' | 'low';
  contactId?: string;
  description?: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  earned: boolean;
  icon: string;
  earnedDate?: string;
  category: string;
  requirement?: number;
  progress?: number;
  points: number;
}

export interface ConversationTemplate {
  id: string;
  title: string;
  category: 'cold_outreach' | 'follow_up' | 'introduction' | 'coffee_chat' | 'thank_you' | 'referral_request';
  scenario: string;
  template: string;
  tips: string[];
  useCount?: number;
}

export interface ExpertSearchCriteria {
  company?: string;
  role?: string;
  skills?: string[];
  location?: string;
  industry?: string;
  experience?: string;
}

export interface ExpertProfile {
  id: string;
  name: string;
  role: string;
  company: string;
  location: string;
  skills: string[];
  industry: string;
  experience: string;
  linkedinUrl?: string;
  recentActivity?: string;
  mutualConnections?: number;
  connectionDifficulty: 'easy' | 'medium' | 'hard';
  avatar: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'guide' | 'templates' | 'masterclass' | 'course' | 'strategy' | 'comparison';
  readTime: string;
  category: string;
  content: string;
  url?: string;
  featured?: boolean;
}

export interface NetworkingStats {
  totalContacts: number;
  monthlyConnections: number;
  responseRate: number;
  meetingsScheduled: number;
  currentStreak: number;
  longestStreak: number;
  achievements: number;
  lastActivityDate?: string;
  streakHistory: { date: string; activity: string }[];
  weeklyGoals: number;
  monthlyGoals: number;
  averagePriority: number;
  contactsByIndustry: Record<string, number>;
  contactsByStatus: Record<string, number>;
  monthlyGrowth: number;
  completedGoals: number;
  totalGoals: number;
  upcomingMeetings: number;
  overdueFollowups: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
  streakHistory: { date: string; activity: string; type: 'contact' | 'meeting' | 'goal' }[];
}

export interface DailyGoals {
  date: string;
  goals: Goal[];
  generated: boolean;
}

export interface ResourceProgress {
  resourceId: string;
  completed: boolean;
  completedDate?: string;
  timeSpent?: number;
  rating?: number;
}