import { useLocalStorage } from './useLocalStorage';
import { useAuth } from './useAuth';
import { ResourceProgress } from '../types';

export function useResourceProgress() {
  const { user } = useAuth();
  const getUserKey = (key: string) => user ? `${key}-${user.id}` : key;
  
  const [progress, setProgress] = useLocalStorage<ResourceProgress[]>(getUserKey('networkmaster-resource-progress'), []);

  const markResourceCompleted = (resourceId: string, timeSpent?: number, rating?: number) => {
    const existingProgress = progress.find(p => p.resourceId === resourceId);
    
    if (existingProgress) {
      setProgress(progress.map(p => 
        p.resourceId === resourceId 
          ? { ...p, completed: true, completedDate: new Date().toISOString().split('T')[0], timeSpent, rating }
          : p
      ));
    } else {
      setProgress([...progress, {
        resourceId,
        completed: true,
        completedDate: new Date().toISOString().split('T')[0],
        timeSpent,
        rating
      }]);
    }
  };

  const getResourceProgress = (resourceId: string): ResourceProgress | undefined => {
    return progress.find(p => p.resourceId === resourceId);
  };

  const getCompletedResources = (): string[] => {
    return progress.filter(p => p.completed).map(p => p.resourceId);
  };

  const getCompletionStats = () => {
    const completed = progress.filter(p => p.completed).length;
    const total = progress.length;
    const averageRating = progress
      .filter(p => p.completed && p.rating)
      .reduce((sum, p) => sum + (p.rating || 0), 0) / Math.max(1, progress.filter(p => p.rating).length);
    
    return {
      completed,
      total,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      averageRating: Math.round(averageRating * 10) / 10 || 0
    };
  };

  return {
    progress,
    markResourceCompleted,
    getResourceProgress,
    getCompletedResources,
    getCompletionStats
  };
}