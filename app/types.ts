export type ActionStatus = 'pending' | 'done' | 'cancel';

export type PlanStatus = 'active' | 'completed' | 'closed';

export interface Action {
  id: string;
  planId: string;
  title: string;
  status: ActionStatus;
  createdAt: string;
  completedAt?: string;
  dateMode?: 'none' | 'date_range' | 'specific_date';
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: PlanStatus;
  createdAt: string;
  closedAt?: string;
}
