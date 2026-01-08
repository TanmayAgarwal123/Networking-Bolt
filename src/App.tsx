import React, { useState, useEffect } from 'react';
import { Resource } from './types';
import { initialResources } from './data/initialData';
import { AuthProvider } from './components/AuthProvider';
import { useAuth } from './hooks/useAuth';
import { useSupabaseData } from './hooks/useSupabaseData';
import { useSupabaseStreak } from './hooks/useSupabaseStreak';
import LoginForm from './components/LoginForm';
import UserProfile from './components/UserProfile';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';
import Resources from './components/Resources';
import ConversationTemplates from './components/ConversationTemplates';
import Achievements from './components/Achievements';
import AdminDashboard from './components/AdminDashboard';
import Navigation from './components/Navigation';
import OnboardingModal from './components/OnboardingModal';
import {
  createSampleContacts,
  createSampleEvents,
  createSampleGoals,
  createSampleAchievements,
} from './utils/sampleData';

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showProfile, setShowProfile] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user, profile, isAuthenticated, isAdmin } = useAuth();
  const { addActivity, streakData } = useSupabaseStreak();

  // Supabase data management
  const {
    contacts,
    events,
    achievements,
    goals,
    loading,
    addContact,
    updateContact,
    deleteContact,
    addEvent,
    updateEvent,
    deleteEvent,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addGoal,
  } = useSupabaseData();

  const resources = initialResources;

  useEffect(() => {
    if (!loading && isAuthenticated && contacts.length === 0) {
      const hasSeenOnboarding = localStorage.getItem('networkmaster-onboarding-seen');
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [loading, isAuthenticated, contacts.length]);
  
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading NetworkMaster...</h2>
          <p className="text-gray-600">Setting up your networking dashboard</p>
        </div>
      </div>
    );
  }
  
  // Contact management
  const handleAddContact = (contact: any) => {
    addContact(contact);
    addActivity(`Added new contact: ${contact.name}`, 'contact');
  };

  const handleUpdateContact = (updatedContact: any) => {
    updateContact(updatedContact);
    addActivity(`Updated contact: ${updatedContact.name}`, 'contact');
  };

  const handleDeleteContact = (contactId: string) => {
    deleteContact(contactId);
  };

  // Event management
  const handleAddEvent = (event: any) => {
    addEvent(event);
    addActivity(`Scheduled: ${event.title}`, 'meeting');
  };

  const handleUpdateEvent = (updatedEvent: any) => {
    updateEvent(updatedEvent);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  // Achievement management
  const handleAddAchievement = (achievement: any) => {
    addAchievement(achievement);
  };

  const handleUpdateAchievement = (updatedAchievement: any) => {
    updateAchievement(updatedAchievement);
  };

  const handleDeleteAchievement = (achievementId: string) => {
    deleteAchievement(achievementId);
  };

  // Message handling
  const handleSendMessage = (contact: any) => {
    if (contact.email) {
      window.open(`mailto:${contact.email}?subject=Following up on our connection`);
    } else if (contact.linkedinUrl) {
      window.open(contact.linkedinUrl, '_blank');
    }
  };

  const handleCreateSampleData = async () => {
    const sampleContacts = createSampleContacts();
    const sampleEvents = createSampleEvents();
    const sampleGoals = createSampleGoals();
    const sampleAchievements = createSampleAchievements();

    for (const contact of sampleContacts) {
      await addContact(contact);
    }

    for (const event of sampleEvents) {
      await addEvent(event);
    }

    for (const goal of sampleGoals) {
      await addGoal(goal);
    }

    for (const achievement of sampleAchievements) {
      await addAchievement(achievement);
    }

    await addActivity('Completed onboarding with sample data', 'milestone');
    localStorage.setItem('networkmaster-onboarding-seen', 'true');
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('networkmaster-onboarding-seen', 'true');
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            contacts={contacts}
            events={events}
            onSendMessage={handleSendMessage}
          />
        );
      case 'contacts':
        return (
          <Contacts 
            contacts={contacts}
            onAddContact={handleAddContact}
            onUpdateContact={handleUpdateContact}
            onDeleteContact={handleDeleteContact}
          />
        );
      case 'calendar':
        return (
          <Calendar 
            events={events}
            contacts={contacts}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        );
      case 'analytics':
        return (
          <Analytics 
            contacts={contacts}
            events={events}
            achievements={achievements}
            onUpdateAchievement={handleUpdateAchievement}
            onDeleteAchievement={handleDeleteAchievement}
            onAddAchievement={handleAddAchievement}
          />
        );
      case 'templates':
        return <ConversationTemplates />;
      case 'achievements':
        return (
          <Achievements 
            achievements={achievements}
            onUpdateAchievement={handleUpdateAchievement}
            onDeleteAchievement={handleDeleteAchievement}
            onAddAchievement={handleAddAchievement}
            totalContacts={contacts.length}
            currentStreak={streakData.currentStreak}
          />
        );
      case 'resources':
        return <Resources resources={resources} />;
      case 'admin':
        return isAdmin ? <AdminDashboard /> : (
          <div className="text-center py-12 text-red-600">Access denied. Admin privileges required.</div>
        );
      default:
        return (
          <Dashboard 
            contacts={contacts}
            events={events}
            onSendMessage={handleSendMessage}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="py-6 border-b border-gray-200/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  NetworkMaster
                </h1>
                <p className="text-sm text-gray-600">Your path to career success</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">{streakData.currentStreak} day streak!</span>
              </div>
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center space-x-2 px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full border border-gray-200/50 hover:bg-white/80 transition-colors"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                  {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm font-medium text-gray-700">{profile?.full_name || 'User'}</span>
              </button>
            </div>
          </div>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="py-8">
          {renderActiveTab()}
        </main>
        
        <UserProfile
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
        />

        <OnboardingModal
          isOpen={showOnboarding}
          onClose={handleCloseOnboarding}
          onCreateSampleData={handleCreateSampleData}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;