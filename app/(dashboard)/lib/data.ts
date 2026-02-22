import { Plan, Action } from '@/app/types';

export const initialPlans: Plan[] = [
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
  },
  {
    id: '6',
    title: 'Website Redesign Phase 1',
    description: 'Revamped landing pages, typography, and responsive layout.',
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    title: 'API Performance Optimization',
    description: 'Reduced response time and optimized database queries.',
    startDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const initialActions: Action[] = [
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
