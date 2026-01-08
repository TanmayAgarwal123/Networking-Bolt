import { Contact, Event, Goal, Achievement } from '../types';

export const createSampleContacts = (): Contact[] => {
  return [
    {
      id: crypto.randomUUID(),
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'Tech Innovations Inc',
      location: 'San Francisco, CA',
      email: 'sarah.chen@example.com',
      phone: '+1 (555) 123-4567',
      linkedinUrl: 'https://linkedin.com/in/sarahchen',
      priority: 85,
      lastContact: '2 days ago',
      tags: ['JavaScript', 'React', 'Mentor'],
      status: 'active',
      avatar: '👩‍💻',
      notes: 'Met at Tech Conference 2024. Very helpful with career advice. Follow up about referral opportunity.',
      addedDate: new Date().toISOString().split('T')[0],
      industry: 'Technology',
      expertise: ['Frontend Development', 'System Design', 'Team Leadership'],
    },
    {
      id: crypto.randomUUID(),
      name: 'Marcus Johnson',
      role: 'Engineering Manager',
      company: 'CloudScale Systems',
      location: 'Austin, TX',
      email: 'marcus.j@example.com',
      phone: '+1 (555) 234-5678',
      linkedinUrl: 'https://linkedin.com/in/marcusjohnson',
      priority: 70,
      lastContact: '1 week ago',
      tags: ['Cloud', 'AWS', 'Management'],
      status: 'active',
      avatar: '👨‍💼',
      notes: 'Former colleague. Now managing a team at CloudScale. Interested in discussing opportunities.',
      addedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      industry: 'Technology',
      expertise: ['Cloud Architecture', 'Team Management', 'DevOps'],
    },
    {
      id: crypto.randomUUID(),
      name: 'Emily Rodriguez',
      role: 'Tech Recruiter',
      company: 'TalentBridge',
      location: 'New York, NY',
      email: 'emily.r@talentbridge.com',
      phone: '+1 (555) 345-6789',
      linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
      priority: 90,
      lastContact: 'Yesterday',
      tags: ['Recruiting', 'Job Search', 'Career'],
      status: 'active',
      avatar: '👩‍💼',
      notes: 'Active recruiter specializing in tech placements. Has several open positions that match my profile.',
      addedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      industry: 'Recruiting',
      expertise: ['Technical Recruiting', 'Career Coaching', 'Interview Prep'],
    },
  ];
};

export const createSampleEvents = (): Event[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    {
      id: crypto.randomUUID(),
      date: tomorrow,
      time: '14:00',
      title: 'Coffee Chat with Sarah',
      type: 'call',
      location: 'Zoom',
      priority: 'high',
      description: 'Discuss frontend architecture and career growth opportunities',
      completed: false,
    },
    {
      id: crypto.randomUUID(),
      date: nextWeek,
      time: '10:00',
      title: 'Tech Networking Meetup',
      type: 'event',
      location: 'Tech Hub Downtown',
      priority: 'medium',
      description: 'Monthly networking event for tech professionals',
      completed: false,
    },
  ];
};

export const createSampleGoals = (): Goal[] => {
  const today = new Date().toISOString().split('T')[0];

  return [
    {
      id: crypto.randomUUID(),
      text: 'Send follow-up message to Sarah Chen',
      completed: false,
      icon: 'MessageCircle',
      priority: 'high',
      category: 'follow-up',
      dueDate: today,
      createdDate: today,
    },
    {
      id: crypto.randomUUID(),
      text: 'Update LinkedIn profile',
      completed: false,
      icon: 'User',
      priority: 'medium',
      category: 'profile',
      dueDate: today,
      createdDate: today,
    },
    {
      id: crypto.randomUUID(),
      text: 'Research 5 companies for job applications',
      completed: false,
      icon: 'Search',
      priority: 'high',
      category: 'research',
      dueDate: today,
      createdDate: today,
    },
  ];
};

export const createSampleAchievements = (): Achievement[] => {
  return [
    {
      id: crypto.randomUUID(),
      title: 'First Contact',
      description: 'Add your first professional contact',
      earned: true,
      icon: '🎯',
      earnedDate: new Date().toISOString().split('T')[0],
      category: 'milestone',
      requirement: 1,
      progress: 1,
      points: 10,
    },
    {
      id: crypto.randomUUID(),
      title: 'Network Builder',
      description: 'Add 5 professional contacts',
      earned: false,
      icon: '👥',
      category: 'milestone',
      requirement: 5,
      progress: 3,
      points: 25,
    },
    {
      id: crypto.randomUUID(),
      title: 'Meeting Master',
      description: 'Schedule 3 networking meetings',
      earned: false,
      icon: '📅',
      category: 'meetings',
      requirement: 3,
      progress: 2,
      points: 20,
    },
  ];
};
