import React, { useState } from 'react';
import { Search, Filter, Plus, Star, Building, MapPin, Calendar, Edit, MessageCircle, Phone } from 'lucide-react';
import { Contact } from '../types';
import ContactModal from './ContactModal';

interface ContactsProps {
  contacts: Contact[];
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onAddContact: (contact: Contact) => void;
}

const Contacts: React.FC<ContactsProps> = ({
  contacts,
  onUpdateContact,
  onDeleteContact,
  onAddContact
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' ||
                         (filter === 'high_priority' && contact.priority >= 80) ||
                         (filter === 'needs_followup' && contact.status === 'needs_followup') ||
                         (filter === 'recent' && contact.lastContact.includes('day'));
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => b.priority - a.priority);

  const handleAddContact = () => {
    setSelectedContact(undefined);
    setIsModalOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSaveContact = (contact: Contact) => {
    if (selectedContact) {
      onUpdateContact(contact);
    } else {
      onAddContact(contact);
    }
  };

  const handleSendMessage = (contact: Contact) => {
    if (contact.email) {
      window.open(`mailto:${contact.email}?subject=Following up on our connection`);
    } else if (contact.linkedinUrl) {
      window.open(contact.linkedinUrl, '_blank');
    }
  };

  const handleCall = (contact: Contact) => {
    if (contact.phone) {
      window.open(`tel:${contact.phone}`);
    }
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'text-red-600 bg-red-50';
    if (priority >= 50) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'needs_followup': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Network</h2>
          <p className="text-gray-600">
            Manage and prioritize your professional connections ({contacts.length} contacts)
          </p>
        </div>
        <button 
          onClick={handleAddContact}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search contacts by name, company, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Contacts</option>
            <option value="high_priority">High Priority</option>
            <option value="needs_followup">Needs Follow-up</option>
            <option value="recent">Recent Activity</option>
          </select>
        </div>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredContacts.map((contact) => (
          <div key={contact.id} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-xl">
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                  <p className="text-gray-600">{contact.role}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{contact.location}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(contact.priority)}`}>
                  <Star className="w-3 h-3" />
                  <span>{contact.priority}/100</span>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status.replace('_', ' ')}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Last contact: {contact.lastContact}</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {contact.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex space-x-2">
              <button 
                onClick={() => handleSendMessage(contact)}
                className="flex items-center justify-center space-x-1 flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                Message
              </button>
              {contact.phone && (
                <button 
                  onClick={() => handleCall(contact)}
                  className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              )}
              <button 
                onClick={() => handleEditContact(contact)}
                className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm || filter !== 'all' ? 'No contacts match your filters' : 'No contacts yet'}
          </div>
          {!searchTerm && filter === 'all' && (
            <button 
              onClick={handleAddContact}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Contact
            </button>
          )}
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selectedContact}
        onSave={handleSaveContact}
        onDelete={onDeleteContact}
      />
    </div>
  );
};

export default Contacts;