import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { Contact } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact?: Contact;
  onSave: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
}

const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  contact,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<Contact>>({
    name: '',
    role: '',
    company: '',
    location: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    priority: 5,
    tags: [],
    status: 'active',
    avatar: '👤',
    notes: '',
    industry: '',
    expertise: []
  });

  const [newTag, setNewTag] = useState('');
  const [newExpertise, setNewExpertise] = useState('');

  useEffect(() => {
    if (contact) {
      setFormData(contact);
    } else {
      setFormData({
        name: '',
        role: '',
        company: '',
        location: '',
        email: '',
        phone: '',
        linkedinUrl: '',
        priority: 5,
        tags: [],
        status: 'active',
        avatar: '👤',
        notes: '',
        industry: '',
        expertise: []
      });
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData: Contact = {
      id: contact?.id || crypto.randomUUID(),
      name: formData.name || '',
      role: formData.role || '',
      company: formData.company || '',
      location: formData.location || '',
      email: formData.email || '',
      phone: formData.phone || '',
      linkedinUrl: formData.linkedinUrl || '',
      priority: formData.priority || 5,
      lastContact: contact?.lastContact || 'Never',
      tags: formData.tags || [],
      status: formData.status || 'active',
      avatar: formData.avatar || '👤',
      notes: formData.notes || '',
      addedDate: contact?.addedDate || new Date().toISOString().split('T')[0],
      industry: formData.industry || '',
      expertise: formData.expertise || []
    };

    onSave(contactData);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise?.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...(prev.expertise || []), newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  const removeExpertise = (expertiseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise?.filter(exp => exp !== expertiseToRemove) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {contact ? 'Edit Contact' : 'Add New Contact'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <input
                type="text"
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Score (1-100) *
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={formData.priority}
                onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter priority score (1-100)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Higher scores (80-100) for key contacts, medium (50-79) for regular network, lower (1-49) for casual connections
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Contact['status'] }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="needs_followup">Needs Follow-up</option>
                <option value="cold">Cold</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expertise
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.expertise?.map((exp, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full flex items-center space-x-1"
                >
                  <span>{exp}</span>
                  <button
                    type="button"
                    onClick={() => removeExpertise(exp)}
                    className="text-green-500 hover:text-green-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newExpertise}
                onChange={(e) => setNewExpertise(e.target.value)}
                placeholder="Add expertise"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addExpertise())}
              />
              <button
                type="button"
                onClick={addExpertise}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add notes about this contact..."
            />
          </div>

          <div className="flex justify-between">
            <div>
              {contact && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this contact?')) {
                      onDelete(contact.id);
                      onClose();
                    }
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Save Contact</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;