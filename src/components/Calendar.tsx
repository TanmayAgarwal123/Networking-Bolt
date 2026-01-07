import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User, MapPin } from 'lucide-react';
import { Event, Contact } from '../types';
import EventModal from './EventModal';
import GoogleCalendarIntegration from './GoogleCalendarIntegration';
import { useStreak } from '../hooks/useStreak';

interface CalendarProps {
  events: Event[];
  contacts: Contact[];
  onUpdateEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onAddEvent: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  events,
  contacts,
  onUpdateEvent,
  onDeleteEvent,
  onAddEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const { addActivity } = useStreak();

  const upcomingEvents = events
    .filter(event => event.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (event: Event) => {
    if (selectedEvent) {
      onUpdateEvent(event);
      addActivity(`Updated event: ${event.title}`, 'meeting');
    } else {
      onAddEvent(event);
      addActivity(`Scheduled: ${event.title}`, 'meeting');
    }
  };

  const getContactName = (contactId?: string) => {
    if (!contactId) return null;
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + (direction === 'next' ? 1 : -1), 1));
  };

  const hasEvent = (day: number) => {
    return events.some(event => 
      event.date.getDate() === day && 
      event.date.getMonth() === currentDate.getMonth() &&
      event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Networking Calendar</h2>
        <p className="text-gray-600">Schedule and track your networking activities</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2 order-1">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigateMonth('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <button 
                  onClick={() => navigateMonth('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="h-10"></div>
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const isToday = today.getDate() === day && 
                  today.getMonth() === currentDate.getMonth() && 
                  today.getFullYear() === currentDate.getFullYear();
                const eventExists = hasEvent(day);

                return (
                  <div
                    key={day}
                    className={`h-10 flex items-center justify-center text-sm rounded-lg cursor-pointer transition-colors relative ${
                      isToday 
                        ? 'bg-blue-600 text-white font-semibold' 
                        : eventExists
                        ? 'bg-green-100 text-green-800 font-medium hover:bg-green-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    {day}
                    {eventExists && (
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="space-y-6 order-2">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const contactName = getContactName(event.contactId);
                return (
                <div 
                  key={event.id} 
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleEditEvent(event)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      event.priority === 'high' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {event.priority}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{event.date.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                    {contactName && (
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>{contactName}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <span className="text-xs text-gray-500">Click to edit</span>
                  </div>
                </div>
              );
              })}
              
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No upcoming events</p>
                  <button 
                    onClick={handleAddEvent}
                    className="mt-2 text-blue-600 hover:text-blue-700"
                  >
                    Schedule your first event
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleAddEvent}
              className="w-full mt-4 py-2 text-center text-blue-600 font-medium border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Add New Event
            </button>
          </div>

          {/* Quick Add */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Schedule</h3>
            <div className="space-y-3">
              <button 
                onClick={handleAddEvent}
                className="w-full flex items-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CalendarIcon className="w-4 h-4" />
                <span>Schedule Coffee Chat</span>
              </button>
              <button 
                onClick={handleAddEvent}
                className="w-full flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Clock className="w-4 h-4" />
                <span>Add Follow-up Reminder</span>
              </button>
            </div>
          </div>
          
          <GoogleCalendarIntegration />
        </div>
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
        contacts={contacts}
        onSave={handleSaveEvent}
        onDelete={onDeleteEvent}
      />
    </div>
  );
};

export default Calendar;