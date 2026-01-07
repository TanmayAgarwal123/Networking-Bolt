import React, { useState } from 'react';
import { MessageSquare, Copy, Eye, Search, Filter, CheckCircle, Star } from 'lucide-react';
import { ConversationTemplate } from '../types';
import { conversationTemplates } from '../data/initialData';

interface ConversationTemplatesProps {
  onTemplateUse?: (templateId: string) => void;
}

const ConversationTemplates: React.FC<ConversationTemplatesProps> = ({ onTemplateUse }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<ConversationTemplate | null>(null);
  const [copiedTemplate, setCopiedTemplate] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Templates', count: conversationTemplates.length },
    { id: 'cold_outreach', label: 'Cold Outreach', count: conversationTemplates.filter(t => t.category === 'cold_outreach').length },
    { id: 'follow_up', label: 'Follow Up', count: conversationTemplates.filter(t => t.category === 'follow_up').length },
    { id: 'coffee_chat', label: 'Coffee Chat', count: conversationTemplates.filter(t => t.category === 'coffee_chat').length },
    { id: 'thank_you', label: 'Thank You', count: conversationTemplates.filter(t => t.category === 'thank_you').length },
    { id: 'referral_request', label: 'Referral Request', count: conversationTemplates.filter(t => t.category === 'referral_request').length },
    { id: 'introduction', label: 'Introduction', count: conversationTemplates.filter(t => t.category === 'introduction').length }
  ];

  const filteredTemplates = conversationTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.scenario.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyTemplate = async (template: ConversationTemplate) => {
    try {
      await navigator.clipboard.writeText(template.template);
      setCopiedTemplate(template.id);
      if (onTemplateUse) {
        onTemplateUse(template.id);
      }
      setTimeout(() => setCopiedTemplate(null), 2000);
    } catch (err) {
      console.error('Failed to copy template:', err);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cold_outreach': return 'bg-blue-100 text-blue-700';
      case 'follow_up': return 'bg-green-100 text-green-700';
      case 'coffee_chat': return 'bg-orange-100 text-orange-700';
      case 'thank_you': return 'bg-purple-100 text-purple-700';
      case 'referral_request': return 'bg-red-100 text-red-700';
      case 'introduction': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Conversation Templates</h2>
        <p className="text-gray-600">Professional templates for every networking scenario</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">Filter by category</span>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{template.title}</h3>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(template.category)}`}>
                  {template.category.replace('_', ' ')}
                </span>
              </div>
              {template.useCount && template.useCount > 0 && (
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="w-3 h-3" />
                  <span>Used {template.useCount} times</span>
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-4">{template.scenario}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-800 font-mono leading-relaxed">
                {template.template.substring(0, 200)}...
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Key Tips:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                {template.tips.slice(0, 2).map((tip, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="w-1 h-1 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    <span>{tip}</span>
                  </li>
                ))}
                {template.tips.length > 2 && (
                  <li className="text-blue-600 text-xs">+{template.tips.length - 2} more tips</li>
                )}
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="flex items-center space-x-2 flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Full</span>
              </button>
              <button
                onClick={() => handleCopyTemplate(template)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  copiedTemplate === template.id
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copiedTemplate === template.id ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600">Try adjusting your search or category filter</p>
        </div>
      )}

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{selectedTemplate.title}</h2>
                <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(selectedTemplate.category)}`}>
                  {selectedTemplate.category.replace('_', ' ')}
                </span>
              </div>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Scenario:</h3>
                <p className="text-gray-600">{selectedTemplate.scenario}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Template:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                    {selectedTemplate.template}
                  </pre>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Tips for Success:</h3>
                <ul className="space-y-2">
                  {selectedTemplate.tips.map((tip, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleCopyTemplate(selectedTemplate)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                    copiedTemplate === selectedTemplate.id
                      ? 'bg-green-600 text-white'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {copiedTemplate === selectedTemplate.id ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Template</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setSelectedTemplate(null)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversationTemplates;