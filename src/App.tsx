import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Contact, Event, Resource } from './types';
import { initialContacts, initialEvents, initialResources } from './data/initialData';
import Dashboard from './components/Dashboard';
import Contacts from './components/Contacts';
import Calendar from './components/Calendar';
import Analytics from './components/Analytics';
import Resources from './components/Resources';
import Navigation from './components/Navigation';
import { useStreak } from './hooks/useStreak';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { addActivity } = useStreak();
  
  // Data management with localStorage
  const [contacts, setContacts] = useLocalStorage<Contact[]>('networkmaster-contacts', initialContacts);
  const [events, setEvents] = useLocalStorage<Event[]>('networkmaster-events', initialEvents);
  const [resources] = useLocalStorage<Resource[]>('networkmaster-resources', initialResources);
  
  // Contact management
  const handleAddContact = (contact: Contact) => {
    setContacts([...contacts, contact]);
    addActivity(`Added new contact: ${contact.name}`, 'contact');
  };

  const handleUpdateContact = (updatedContact: Contact) => {
    setContacts(contacts.map(c => c.id === updatedContact.id ? updatedContact : c));
    addActivity(`Updated contact: ${updatedContact.name}`, 'contact');
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
    setEvents(events.filter(e => e.contactId !== contactId));
  };

  // Event management
  const handleAddEvent = (event: Event) => {
    setEvents([...events, event]);
    addActivity(`Scheduled: ${event.title}`, 'meeting');
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  // Message handling
  const handleSendMessage = (contact: Contact) => {
    if (contact.email) {
      window.open(`mailto:${contact.email}?subject=Following up on our connection`);
    } else if (contact.linkedinUrl) {
      window.open(contact.linkedinUrl, '_blank');
    }
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
          />
        );
      case 'resources':
        return <Resources resources={resources} />;
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
                <span className="text-sm font-medium text-green-700">7 day streak!</span>
              </div>
            </div>
          </div>
        </header>

        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="py-8">
          {renderActiveTab()}
        </main>
      </div>
    </div>
  );
}

export default App;