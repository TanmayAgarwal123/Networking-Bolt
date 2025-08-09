import React from 'react';
import { TrendingUp, Award, Target, Users, MessageCircle, Calendar, Download, Plus, Edit } from 'lucide-react';
import { Contact, Event, Achievement } from '../types';
import { useStreak } from '../hooks/useStreak';
import { useLocalStorage } from '../hooks/useLocalStorage';
import AchievementModal from './AchievementModal';

interface AnalyticsProps {
  contacts: Contact[];
  events: Event[];
}

const Analytics: React.FC<AnalyticsProps> = ({ contacts, events }) => {
  const { streakData } = useStreak();
  const [achievements, setAchievements] = useLocalStorage<Achievement[]>('networkmaster-achievements', []);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedAchievement, setSelectedAchievement] = React.useState<Achievement | undefined>();
  
  const totalContacts = contacts.length;
  const monthlyConnections = contacts.filter(c => {
    const addedDate = new Date(c.addedDate);
    const currentMonth = new Date().getMonth();
    return addedDate.getMonth() === currentMonth;
  }).length;
  
  const responseRate = 78; // This would be calculated based on actual interaction data
  const meetingsScheduled = events.filter(e => e.date >= new Date()).length;
  const earnedAchievements = achievements.filter(a => a.earned).length;
  
  // Update achievements based on current stats
  React.useEffect(() => {
    const updatedAchievements = achievements.map(achievement => {
      let progress = achievement.progress || 0;
      let earned = achievement.earned;
      
      switch (achievement.category) {
        case 'milestone':
          if (achievement.title.includes('First Connection')) {
            progress = totalContacts > 0 ? 1 : 0;
            earned = totalContacts > 0;
          }
          break;
        case 'streak':
          if (achievement.title.includes('Week Warrior')) {
            progress = streakData.currentStreak;
            earned = streakData.currentStreak >= 7;
          }
          break;
        case 'meetings':
          if (achievement.title.includes('Coffee Champion')) {
            progress = events.filter(e => e.type === 'meetup').length;
            earned = events.filter(e => e.type === 'meetup').length >= (achievement.requirement || 10);
          }
          break;
        case 'connections':
          progress = totalContacts;
          earned = totalContacts >= (achievement.requirement || 50);
          break;
      }
      
      return {
        ...achievement,
        progress,
        earned,
        earnedDate: earned && !achievement.earned ? new Date().toISOString().split('T')[0] : achievement.earnedDate
      };
    });
    
    setAchievements(updatedAchievements);
  }, [totalContacts, streakData.currentStreak, events.length]);

  const monthlyGoal = 40;

  const monthlyStats = [
    { month: 'Oct', connections: 12, messages: 28, meetings: 6 },
    { month: 'Nov', connections: 18, messages: 35, meetings: 8 },
    { month: 'Dec', connections: 22, messages: 41, meetings: 12 },
    { month: 'Jan', connections: 34, messages: 67, meetings: 18 }
  ];

  const exportAnalytics = () => {
    const analyticsData = {
      totalContacts,
      monthlyConnections,
      responseRate,
      meetingsScheduled,
      currentStreak: streakData.currentStreak,
      longestStreak: streakData.longestStreak,
      earnedAchievements,
      totalAchievements: achievements.length,
      contactsByCompany: contacts.reduce((acc, contact) => {
        acc[contact.company] = (acc[contact.company] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      contactsByPriority: contacts.reduce((acc, contact) => {
        const priority = contact.priority >= 8 ? 'High' : contact.priority >= 6 ? 'Medium' : 'Low';
        acc[priority] = (acc[priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
    
    const jsonContent = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'networking-analytics.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportContacts = () => {
    const csvContent = [
      ['Name', 'Role', 'Company', 'Location', 'Email', 'Priority', 'Status', 'Last Contact', 'Tags'],
      ...contacts.map(c => [
        c.name, c.role, c.company, c.location, c.email, c.priority.toString(), 
        c.status, c.lastContact, c.tags.join('; ')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'networking-contacts.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCalendar = () => {
    const csvContent = [
      ['Title', 'Date', 'Time', 'Type', 'Location', 'Priority', 'Contact', 'Description'],
      ...events.map(e => {
        const contact = contacts.find(c => c.id === e.contactId);
        return [
          e.title, e.date.toISOString().split('T')[0], e.time, e.type, 
          e.location, e.priority, contact?.name || '', e.description || ''
        ];
      })
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'networking-calendar.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
      setAchievements(achievements.map(a => a.id === achievement.id ? achievement : a));
    } else {
      setAchievements([...achievements, achievement]);
    }
  };

  const handleDeleteAchievement = (achievementId: string) => {
    setAchievements(achievements.filter(a => a.id !== achievementId));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics & Achievements</h2>
        <p className="text-gray-600">Track your networking progress and celebrate milestones</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalContacts}</p>
              <p className="text-sm text-gray-600">Total Network</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+{monthlyConnections} this month</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{responseRate}%</p>
              <p className="text-sm text-gray-600">Response Rate</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">Above industry avg</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{meetingsScheduled}</p>
              <p className="text-sm text-gray-600">Meetings Scheduled</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-orange-600">{events.filter(e => {
              const eventDate = new Date(e.date);
              const today = new Date();
              const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
              return eventDate >= today && eventDate <= weekFromNow;
            }).length} this week</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">{monthlyConnections}/{monthlyGoal}</p>
              <p className="text-sm text-gray-600">Monthly Goal</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((monthlyConnections / monthlyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Progress</h3>
        <div className="space-y-6">
          {monthlyStats.map((stat, index) => (
            <div key={stat.month} className="flex items-center space-x-4">
              <div className="w-12 text-sm font-medium text-gray-600">{stat.month}</div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Connections</span>
                    <span className="font-medium">{stat.connections}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stat.connections / 40) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Messages</span>
                    <span className="font-medium">{stat.messages}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stat.messages / 80) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Meetings</span>
                    <span className="font-medium">{stat.meetings}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(stat.meetings / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Achievements</h3>
            <p className="text-sm text-gray-500">Track your networking milestones</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAddAchievement}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Create achievement"
            >
              <Plus className="w-4 h-4" />
            </button>
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-600">
              {earnedAchievements}/{achievements.length} unlocked
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`group p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                achievement.earned
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-sm'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              onClick={() => handleEditAchievement(achievement)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl ${achievement.earned ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-medium ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {achievement.earned && (
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAchievement(achievement);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-all"
                  >
                    <Edit className="w-3 h-3" />
                  </button>
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
            </div>
          ))}
        </div>
        
        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No achievements yet</p>
            <button 
              onClick={handleAddAchievement}
              className="mt-2 text-blue-600 hover:text-blue-700"
            >
              Create your first achievement
            </button>
          </div>
        )}
      </div>

      {/* Streak Analytics */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Networking Streak Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{streakData.currentStreak}</div>
            <div className="text-sm text-gray-600">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{streakData.longestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{streakData.streakHistory.length}</div>
            <div className="text-sm text-gray-600">Total Active Days</div>
          </div>
        </div>
        
        {streakData.streakHistory.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-3">Recent Activity</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {streakData.streakHistory.slice(-10).reverse().map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.type === 'contact' ? 'bg-blue-500' :
                    activity.type === 'meeting' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{activity.activity}</div>
                    <div className="text-xs text-gray-500">{activity.date}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.type === 'contact' ? 'bg-blue-100 text-blue-700' :
                    activity.type === 'meeting' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {activity.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Data */}
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Export</h3>
        <p className="text-gray-600 mb-4">Export your networking data for backup or analysis</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={exportContacts}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Contacts (CSV)</span>
            </div>
          </button>
          <button 
            onClick={exportAnalytics}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Analytics (JSON)</span>
            </div>
          </button>
          <button 
            onClick={exportCalendar}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Calendar (CSV)</span>
            </div>
          </button>
        </div>
      </div>

      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        achievement={selectedAchievement}
        onSave={handleSaveAchievement}
        onDelete={handleDeleteAchievement}
      />
    </div>
  );
};

export default Analytics;