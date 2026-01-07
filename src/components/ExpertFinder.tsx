import React, { useState } from 'react';
import { Search, Filter, MapPin, Building, Star, Users, ExternalLink, MessageCircle, Plus } from 'lucide-react';
import { ExpertProfile, ExpertSearchCriteria } from '../types';
import { mockExpertProfiles } from '../data/initialData';

interface ExpertFinderProps {
  onAddToNetwork: (expert: ExpertProfile) => void;
}

const ExpertFinder: React.FC<ExpertFinderProps> = ({ onAddToNetwork }) => {
  const [searchCriteria, setSearchCriteria] = useState<ExpertSearchCriteria>({});
  const [searchResults, setSearchResults] = useState<ExpertProfile[]>(mockExpertProfiles);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulate API search delay
    setTimeout(() => {
      let filtered = mockExpertProfiles;
      
      if (searchCriteria.company) {
        filtered = filtered.filter(expert => 
          expert.company.toLowerCase().includes(searchCriteria.company!.toLowerCase())
        );
      }
      
      if (searchCriteria.role) {
        filtered = filtered.filter(expert => 
          expert.role.toLowerCase().includes(searchCriteria.role!.toLowerCase())
        );
      }
      
      if (searchCriteria.skills && searchCriteria.skills.length > 0) {
        filtered = filtered.filter(expert => 
          searchCriteria.skills!.some(skill => 
            expert.skills.some(expertSkill => 
              expertSkill.toLowerCase().includes(skill.toLowerCase())
            )
          )
        );
      }
      
      if (searchCriteria.location) {
        filtered = filtered.filter(expert => 
          expert.location.toLowerCase().includes(searchCriteria.location!.toLowerCase())
        );
      }
      
      setSearchResults(filtered);
      setIsSearching(false);
    }, 1500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddSkill = (skill: string) => {
    if (skill.trim() && !searchCriteria.skills?.includes(skill.trim())) {
      setSearchCriteria(prev => ({
        ...prev,
        skills: [...(prev.skills || []), skill.trim()]
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSearchCriteria(prev => ({
      ...prev,
      skills: prev.skills?.filter(skill => skill !== skillToRemove) || []
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Expert Finder</h2>
        <p className="text-gray-600">Discover and connect with industry experts based on company, role, skills, and more</p>
      </div>

      {/* Search Filters */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Criteria</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              value={searchCriteria.company || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, company: e.target.value }))}
              placeholder="e.g., Google, Microsoft, Meta"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={searchCriteria.role || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, role: e.target.value }))}
              placeholder="e.g., Software Engineer, Product Manager"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
            <input
              type="text"
              value={searchCriteria.location || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., San Francisco, Seattle, New York"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={searchCriteria.industry || ''}
              onChange={(e) => setSearchCriteria(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Consulting">Consulting</option>
            </select>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {searchCriteria.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full flex items-center space-x-1"
              >
                <span>{skill}</span>
                <button
                  onClick={() => removeSkill(skill)}
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
              placeholder="Add a skill (e.g., Python, React, Machine Learning)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddSkill(e.currentTarget.value);
                  e.currentTarget.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder*="Add a skill"]') as HTMLInputElement;
                if (input?.value) {
                  handleAddSkill(input.value);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
        >
          {isSearching ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Find Experts</span>
            </>
          )}
        </button>
      </div>

      {/* Search Results */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Results ({searchResults.length} experts found)
          </h3>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Sorted by relevance</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {searchResults.map((expert) => (
            <div key={expert.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-2xl">
                    {expert.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg">{expert.name}</h4>
                    <p className="text-gray-600">{expert.role}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{expert.company}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{expert.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(expert.connectionDifficulty)}`}>
                    {expert.connectionDifficulty} to connect
                  </span>
                  {expert.mutualConnections && expert.mutualConnections > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-blue-600">
                      <Users className="w-3 h-3" />
                      <span>{expert.mutualConnections} mutual</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-gray-700">Experience: {expert.experience}</span>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {expert.skills.slice(0, 4).map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                      {skill}
                    </span>
                  ))}
                  {expert.skills.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                      +{expert.skills.length - 4} more
                    </span>
                  )}
                </div>
                {expert.recentActivity && (
                  <p className="text-sm text-gray-600 italic">Recent: {expert.recentActivity}</p>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => onAddToNetwork(expert)}
                  className="flex items-center space-x-2 flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to Network</span>
                </button>
                <button
                  onClick={() => window.open(expert.linkedinUrl, '_blank')}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>LinkedIn</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600">Try adjusting your search criteria to find more experts</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertFinder;