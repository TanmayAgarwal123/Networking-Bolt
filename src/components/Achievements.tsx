import React, { useState } from 'react';
import { Award, Trophy, Star, Plus, Edit, Trash2, Crown, Target } from 'lucide-react';
import { Achievement } from '../types';
import AchievementModal from './AchievementModal';

interface AchievementsProps {
  achievements: Achievement[];
  onUpdateAchievement: (achievement: Achievement) => void;
  onDeleteAchievement: (achievementId: string) => void;
  onAddAchievement: (achievement: Achievement) => void;
  totalContacts: number;
  currentStreak: number;
}

const Achievements: React.FC<AchievementsProps> = ({
  achievements,
  onUpdateAchievement,
  onDeleteAchievement,
  onAddAchievement,
  totalContacts,
  currentStreak
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | undefined>();

  // Calculate total points and level
  const totalPoints = achievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);
  const currentLevel = Math.floor(totalPoints / 1000) + 1;
  const pointsToNextLevel = (currentLevel * 1000) - totalPoints;

  // Group achievements by category
  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  const handleAddAchievement = () => {
    setSelectedAchievement(undefined);
    setIsModalOpen(true);
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsModalOpen(true);
  };

  const handleSaveAchievement = (achievement: Achievement) => {
    if (selectedAchievement) {
      onUpdateAchievement(achievement);
    } else {
      onAddAchievement(achievement);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'milestone': return Target;
      case 'streak': return Trophy;
      case 'engagement': return Star;
      case 'growth': return Award;
      case 'special': return Crown;
      default: return Award;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'milestone': return 'from-blue-500 to-blue-600';
      case 'streak': return 'from-orange-500 to-red-600';
      case 'engagement': return 'from-purple-500 to-purple-600';
      case 'growth': return 'from-green-500 to-green-600';
      case 'special': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const unlockedCount = earnedAchievements.length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Achievements</h2>
        <p className="text-gray-600">Track your networking milestones and earn rewards</p>
      </div>

      {/* Achievement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Achievements Unlocked</p>
              <p className="text-3xl font-bold">{unlockedCount}/{achievements.length}</p>
            </div>
            <Award className="w-12 h-12 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Total Points</p>
              <p className="text-3xl font-bold">{totalPoints.toLocaleString()}</p>
            </div>
            <Star className="w-12 h-12 text-yellow-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Current Level</p>
              <p className="text-3xl font-bold">{currentLevel}</p>
            </div>
            <Trophy className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Next Level</p>
              <p className="text-lg font-bold">{pointsToNextLevel} points</p>
            </div>
            <Crown className="w-12 h-12 text-green-200" />
          </div>
          <div className="mt-3">
            <div className="w-full bg-green-400 rounded-full h-2">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500"
                style={{ width: `${((totalPoints % 1000) / 1000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Categories */}
      {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
        const CategoryIcon = getCategoryIcon(category);
        const categoryColor = getCategoryColor(category);
        
        return (
          <div key={category} className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${categoryColor} rounded-lg flex items-center justify-center`}>
                  <CategoryIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">
                    {category} Achievements
                  </h3>
                  <p className="text-sm text-gray-500">
                    {categoryAchievements.filter(a => a.earned).length}/{categoryAchievements.length} unlocked
                  </p>
                </div>
              </div>
              <button
                onClick={handleAddAchievement}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add achievement"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`group relative p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                    achievement.earned
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm hover:shadow-md'
                      : 'bg-gray-50 border-gray-200 opacity-70 hover:opacity-90'
                  }`}
                  onClick={() => handleEditAchievement(achievement)}
                >
                  {achievement.earned && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <div className={`text-3xl ${achievement.earned ? '' : 'grayscale'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {achievement.description}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          achievement.earned 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {achievement.points} points
                        </span>
                        {achievement.earnedDate && (
                          <span className="text-xs text-gray-500">
                            {new Date(achievement.earnedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {achievement.requirement && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.progress || 0}/{achievement.requirement}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            achievement.earned ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ 
                            width: `${Math.min(((achievement.progress || 0) / achievement.requirement) * 100, 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditAchievement(achievement);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Delete this achievement?')) {
                            onDeleteAchievement(achievement.id);
                          }
                        }}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {achievements.length === 0 && (
        <div className="text-center py-12">
          <Award className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
          <p className="text-gray-600 mb-4">Create your first achievement to start tracking your networking progress</p>
          <button 
            onClick={handleAddAchievement}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Achievement
          </button>
        </div>
      )}

      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        achievement={selectedAchievement}
        onSave={handleSaveAchievement}
        onDelete={onDeleteAchievement}
      />
    </div>
  );
};

export default Achievements;