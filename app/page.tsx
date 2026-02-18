"use client";

import { useState } from 'react';
import { Plan, Action, ActionStatus, PlanStatus } from '@/app/types';
import { Button } from '@/app/components/ui/button';
import { PlanCard } from '@/app/components/PlanCard';
import { CreatePlanDialog } from '@/app/components/CreatePlanDialog';
import { PlusIcon } from '@radix-ui/react-icons';

// Dummy data
const initialPlans: Plan[] = [
  {
    id: '1',
    title: 'Q1 Product Launch',
    description: 'Launch the new features for the Q1 release.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Brand Refresh',
    description: 'Update visual identity, including new logo and color palette.',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    title: 'Market Expansion: EMEA',
    description: 'Researching localization requirements for European markets.',
    startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    title: 'Security Audit',
    description: 'Annual penetration testing and compliance review.',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '5',
    title: 'Mobile App Beta',
    description: 'Onboarding first 500 testers for the iOS and Android builds.',
    startDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'closed',
    createdAt: new Date().toISOString(),
  }
];

const initialActions: Action[] = [
  {
    id: '1',
    planId: '1',
    title: 'Finalize designs',
    status: 'done',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    planId: '1',
    title: 'Development sprint',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

];

export default function Dashboard() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [actions, setActions] = useState<Action[]>(initialActions);
  const [showCreatePlan, setShowCreatePlan] = useState(false);

  const handleCreatePlan = (newPlan: { title: string; description: string; startDate: string; endDate: string }) => {
    const plan: Plan = {
      id: Math.random().toString(36).substr(2, 9),
      ...newPlan,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setPlans([...plans, plan]);
  };

  const handleCreateAction = (planId: string, title: string) => {
    const action: Action = {
      id: Math.random().toString(36).substr(2, 9),
      planId,
      title,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setActions([...actions, action]);
  };

  const handleUpdateActionStatus = (actionId: string, status: ActionStatus) => {
    setActions(actions.map(a => a.id === actionId ? { ...a, status } : a));
  };

  const handleUpdatePlanStatus = (planId: string, status: PlanStatus) => {
    setPlans(plans.map(p => p.id === planId ? { ...p, status } : p));
  };

  const activePlans = plans.filter(p => p.status === 'active');

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button onClick={() => setShowCreatePlan(true)}>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      {activePlans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 border rounded-lg border-dashed">
          <div className="bg-muted rounded-full p-4 mb-4">
            <PlusIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Active Plans</h3>
          <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
            Create your first plan to start organizing your goals and tracking your progress.
          </p>
          <Button onClick={() => setShowCreatePlan(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create Your First Plan
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {activePlans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              actions={actions}
              onCreateAction={handleCreateAction}
              onUpdateActionStatus={handleUpdateActionStatus}
              onUpdatePlanStatus={handleUpdatePlanStatus}
            />
          ))}
        </div>
      )}

      <CreatePlanDialog
        open={showCreatePlan}
        onOpenChange={setShowCreatePlan}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  );
}
