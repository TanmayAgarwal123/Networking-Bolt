import React, { useState } from 'react';
import { CheckCircle2, Circle, MessageSquare, Phone, Coffee, Star, Plus, Edit, Trash2 } from 'lucide-react';
import { Goal } from '../types';
import { useDailyGoals } from '../hooks/useDailyGoals';
import { useStreak } from '../hooks/useStreak';
import GoalModal from './GoalModal';

interface TodaysGoalsProps {
  contacts: any[];
}

const TodaysGoals: React.FC<TodaysGoalsProps> = ({ contacts }) => {
  const { getTodaysGoals, updateTodaysGoals, addCustomGoal } = useDailyGoals();
  const { addActivity } = useStreak();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadGoals = async () => {
      setIsLoading(true);
      try {
        const todaysGoals = await getTodaysGoals(contacts);
        setGoals(todaysGoals);
      } catch (error) {
        console.error('Error loading goals:', error);
        setGoals([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGoals();
  }, [contacts]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'MessageSquare': return MessageSquare;
      case 'Coffee': return Coffee;
      case 'Phone': return Phone;
      case 'Star': return Star;
      case 'UserPlus': return Plus;
      case 'Edit': return Edit;
      case 'Search': return MessageSquare;
      case 'Share': return MessageSquare;
      case 'Target': return Star;
      default: return Circle;
    }
  };

  const toggleGoal = (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (goal) {
      const updatedGoal = { 
        ...goal, 
        completed: !goal.completed,
        completedDate: !goal.completed ? new Date().toISOString().split('T')[0] : undefined
      };
      
      const updatedGoals = goals.map(g => g.id === id ? updatedGoal : g);
      setGoals(updatedGoals);
      updateTodaysGoals(updatedGoals);
      
      // Add to streak if completing a goal
      if (!goal.completed) {
        addActivity(`Completed goal: ${goal.text}`, 'goal');
      }
    }
  };

  const handleAddGoal = () => {
    setSelectedGoal(undefined);
    setIsModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleSaveGoal = (goal: Goal) => {
    if (selectedGoal) {
      const updatedGoals = goals.map(g => g.id === goal.id ? goal : g);
      setGoals(updatedGoals);
      updateTodaysGoals(updatedGoals);
    } else {
      const newGoals = [...goals, goal];
      setGoals(newGoals);
      updateTodaysGoals(newGoals);
    }
  };

  const handleDeleteGoal = (goalId: string) => {
    const updatedGoals = goals.filter(g => g.id !== goalId);
    setGoals(updatedGoals);
    updateTodaysGoals(updatedGoals);
  };

  const completedCount = goals.filter(goal => goal.completed).length;
  const progressPercentage = (completedCount / goals.length) * 100;

  if (isLoading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="ml-2 text-gray-600">Loading today's goals...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Today's Networking Goals</h3>
          <p className="text-sm text-gray-500">AI-generated daily recommendations</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleAddGoal}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Add custom goal"
          >
            <Plus className="w-4 h-4" />
          </button>
          <span className="text-sm font-medium text-gray-600">
            {completedCount}/{goals.length} completed
          </span>
          <div className="w-12 h-2 bg-gray-200 rounded-full">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {goals.map((goal) => {
          const Icon = getIcon(goal.icon);
          return (
            <div 
              key={goal.id}
              className={`group flex items-start space-x-3 p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                goal.completed 
                  ? 'bg-green-50 border-green-200 opacity-75' 
                  : 'bg-white border-gray-200 hover:border-blue-300'
              }`}
            >
              <button 
                className="flex-shrink-0 mt-0.5"
                onClick={() => toggleGoal(goal.id)}
              >
                {goal.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={`w-4 h-4 ${
                    goal.priority === 'high' ? 'text-red-500' : 'text-blue-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    goal.completed ? 'line-through text-gray-500' : 'text-gray-900'
                  }`}>
                    {goal.text}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    goal.priority === 'high' 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {goal.priority} priority
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditGoal(goal);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this goal?')) {
                      handleDeleteGoal(goal.id);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === goals.length && goals.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="font-medium text-green-700">All goals completed! 🎉</span>
          </div>
          <p className="text-sm text-green-600 mt-1">
            Amazing work! You're building momentum towards your dream job.
          </p>
        </div>
      )}
      
      {goals.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No goals for today yet</p>
          <button 
            onClick={handleAddGoal}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Add your first goal
          </button>
        </div>
      )}
      
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={selectedGoal}
        onSave={handleSaveGoal}
        onDelete={handleDeleteGoal}
      />
    </div>
  );
};

export default TodaysGoals;