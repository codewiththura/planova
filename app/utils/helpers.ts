import { Plan, Action } from '../types';

export const calculateProgress = (plan: Plan, actions: Action[]): number => {
  const planActions = actions.filter(action => action.planId === plan.id);

  if (planActions.length === 0) return 0;

  const completedActions = planActions.filter(action => action.status === 'done').length;
  return Math.round((completedActions / planActions.length) * 100);
};

export const getDaysLeft = (plan: Plan): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const endDate = new Date(plan.endDate);
  endDate.setHours(0, 0, 0, 0);

  const diffTime = endDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

export const isOverdue = (plan: Plan): boolean => {
  return getDaysLeft(plan) < 0 && plan.status === 'active';
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTime = (timeStr: string): string => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${suffix}`;
};
