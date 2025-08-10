import React from 'react';
import { Contact, Goal, Event, Achievement } from '../types';
import { 
  Target, 
  Calendar, 
  TrendingUp, 
  Award,
  Users,
  MessageCircle,
  Clock,
  Zap
} from 'lucide-react';
import StreakCounter from './StreakCounter';
import TodaysGoals from './TodaysGoals';
import WeekendRecommendations from './WeekendRecommendations';
import QuickActions from './QuickActions';
import { useStreak } from '../hooks/useStreak';

interface DashboardProps {
  contacts: Contact[];
  events: Event[];
  onSendMessage: (contact: Contact) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  contacts,
  events,
  onSendMessage
}) => {
  const { streakData } = useStreak();
  const monthlyConnections = contacts.filter(c => {
    const addedDate = new Date(c.addedDate);
    const currentMonth = new Date().getMonth();
    return addedDate.getMonth() === currentMonth;
  }).length;
  
  const responseRate = 78; // This would be calculated based on actual data
  const meetingsScheduled = events.filter(e => e.date >= new Date()).length;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
          Welcome back, Networking Champion! 🚀
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your journey to landing that dream job in tech starts with meaningful connections. 
          Let's make today count!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Network</p>
              <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">+{monthlyConnections} this month</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">{monthlyConnections}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <Target className="w-4 h-4 text-blue-500 mr-1" />
            <span className="text-sm text-gray-600">Goal: 40 contacts</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-3xl font-bold text-gray-900">{responseRate}%</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-orange-600">Above average!</span>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-3xl font-bold text-gray-900">{streakData.currentStreak}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-purple-600">Best: {streakData.longestStreak} days</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <StreakCounter />
          <TodaysGoals contacts={contacts} />
        </div>
        <div className="space-y-8">
          <WeekendRecommendations 
            contacts={contacts} 
            onSendMessage={onSendMessage} 
          />
          <QuickActions 
            onAddContact={() => alert('Navigate to the Network tab to add new contacts')}
            onExportData={() => alert('Navigate to the Analytics tab to export your data')}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;