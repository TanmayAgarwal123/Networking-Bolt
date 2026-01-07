import React from 'react';
import { MessageCircle, Calendar, ExternalLink, User } from 'lucide-react';
import { Contact } from '../types';

interface WeekendRecommendationsProps {
  contacts: Contact[];
  onSendMessage: (contact: Contact) => void;
}

const WeekendRecommendations: React.FC<WeekendRecommendationsProps> = ({ 
  contacts, 
  onSendMessage 
}) => {
  // Generate recommendations based on last contact date and priority
  const recommendations = contacts
    .filter(contact => {
      const needsFollowup = (contact.lastContact && contact.lastContact.includes('week')) || 
                           (contact.lastContact && contact.lastContact.includes('month')) || 
                           contact.status === 'needs_followup';
      return needsFollowup && contact.priority >= 70;
    })
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3)
    .map(contact => ({
      ...contact,
      reason: generateReason(contact)
    }));

  function generateReason(contact: Contact): string {
    if (contact.lastContact && contact.lastContact.includes('month')) {
      return 'Long time since last contact - great time to reconnect!';
    }
    if (contact.lastContact && contact.lastContact.includes('week')) {
      return 'Perfect timing for a follow-up conversation';
    }
    if (contact.status === 'needs_followup') {
      return 'Marked for follow-up - don\'t let this connection go cold!';
    }
    if (contact.tags.includes('Alumni')) {
      return 'Alumni connection - leverage shared background';
    }
    if (contact.priority >= 90) {
      return 'High priority contact - maintain strong relationship';
    }
    return 'Good opportunity to strengthen professional relationship';
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Weekend Catch-ups</h3>
        <span className="text-sm text-gray-500">AI-powered suggestions</span>
      </div>

      <div className="space-y-4">
        {recommendations.length > 0 ? recommendations.map((person) => (
          <div key={person.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xl">
                  {person.avatar}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{person.name}</h4>
                  <p className="text-sm text-gray-600">{person.role} at {person.company}</p>
                  <p className="text-xs text-gray-500 mt-1">Last contact: {person.lastContact}</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                  Priority {person.priority}/100
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">{person.reason}</p>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button 
                onClick={() => onSendMessage(person)}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Message</span>
              </button>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" />
                <span>Schedule</span>
              </button>
              <button 
                onClick={() => person.linkedinUrl && window.open(person.linkedinUrl, '_blank')}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                disabled={!person.linkedinUrl}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No recommendations available</p>
            <p className="text-sm">Add more contacts to get personalized suggestions</p>
          </div>
        )}
      </div>

      {recommendations.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing top {recommendations.length} recommendations based on your network
        </div>
      )}
    </div>
  );
};

export default WeekendRecommendations;