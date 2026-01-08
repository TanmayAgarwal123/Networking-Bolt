import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Award } from 'lucide-react';
import { Achievement } from '../types';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
  achievement?: Achievement;
  onSave: (achievement: Achievement) => void;
  onDelete?: (achievementId: string) => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({
  isOpen,
  onClose,
  achievement,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<Achievement>>({
    title: '',
    description: '',
    earned: false,
    icon: '🎯',
    category: 'milestone',
    requirement: 1,
    progress: 0,
    points: 10
  });

  useEffect(() => {
    if (achievement) {
      setFormData(achievement);
    } else {
      setFormData({
        title: '',
        description: '',
        earned: false,
        icon: '🎯',
        category: 'milestone',
        requirement: 1,
        progress: 0,
        points: 10
      });
    }
  }, [achievement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const achievementData: Achievement = {
      id: achievement?.id || crypto.randomUUID(),
      title: formData.title || '',
      description: formData.description || '',
      earned: formData.earned || false,
      icon: formData.icon || '🎯',
      category: formData.category || 'milestone',
      requirement: formData.requirement || 1,
      progress: formData.progress || 0,
      points: formData.points || 10,
      earnedDate: formData.earned ? (formData.earnedDate || new Date().toISOString().split('T')[0]) : undefined
    };

    onSave(achievementData);
    onClose();
  };

  if (!isOpen) return null;

  const iconOptions = ['🎯', '🔥', '☕', '🏆', '⭐', '💪', '🚀', '👑', '💎', '🎉', '📱', '💼', '🌟', '⚡', '🎓', '📅', '✅', '🌅', '📝', '🏷️', '👤', '📚', '💬', '🌐', '✨', '🔄', '💚', '📆', '🔴', '💯', '🏅', '🌴', '🦉'];
  const categoryOptions = ['milestone', 'streak', 'meetings', 'connections', 'growth', 'engagement'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {achievement ? 'Edit Achievement' : 'Create New Achievement'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Achievement Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., First Connection, Week Warrior"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Describe what this achievement represents..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon
              </label>
              <select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {iconOptions.map(icon => (
                  <option key={icon} value={icon}>{icon} {icon}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categoryOptions.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirement
              </label>
              <input
                type="number"
                min="1"
                value={formData.requirement}
                onChange={(e) => setFormData(prev => ({ ...prev, requirement: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Progress
              </label>
              <input
                type="number"
                min="0"
                max={formData.requirement}
                value={formData.progress}
                onChange={(e) => setFormData(prev => ({ ...prev, progress: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points
              </label>
              <input
                type="number"
                min="1"
                value={formData.points || 10}
                onChange={(e) => setFormData(prev => ({ ...prev, points: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="earned"
              checked={formData.earned}
              onChange={(e) => setFormData(prev => ({ ...prev, earned: e.target.checked }))}
              className="mr-2"
            />
            <label htmlFor="earned" className="text-sm text-gray-700">
              Mark as earned
            </label>
          </div>

          <div className="flex justify-between pt-4">
            <div>
              {achievement && onDelete && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this achievement?')) {
                      onDelete(achievement.id);
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
                <span>Save Achievement</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AchievementModal;