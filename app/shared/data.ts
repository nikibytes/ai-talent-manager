import type { View } from './types';

export const navItems: { id: View; label: string; badge?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'queue', label: 'Opportunity Queue', badge: 12 },
  { id: 'applications', label: 'Applications', badge: 8 },
  { id: 'approvals', label: 'Approvals', badge: 3 },
  { id: 'content', label: 'Content' },
  { id: 'settings', label: 'Settings' },
];

export const queue = [
  { company: 'Stripe', role: 'Senior Backend Engineer', score: 92, status: 'Ready', location: 'Remote', source: 'LinkedIn', posted: '2h ago' },
  { company: 'Linear', role: 'Software Engineer', score: 88, status: 'Ready', location: 'Remote', source: 'LinkedIn', posted: '4h ago' },
  { company: 'Vercel', role: 'Senior Full Stack Engineer', score: 84, status: 'Review', location: 'Remote', source: 'LinkedIn', posted: '5h ago' },
  { company: 'Ramp', role: 'Backend Engineer', score: 79, status: 'Review', location: 'New York / Remote', source: 'LinkedIn', posted: '7h ago' },
  { company: 'Notion', role: 'Senior Software Engineer', score: 76, status: 'Review', location: 'San Francisco / Remote', source: 'Agent Reach', posted: 'Yesterday' },
];

export const applications = [
  { company: 'Stripe', role: 'Senior Backend Engineer', status: 'Applied', date: 'Aug 24', fit: 92, next: 'Awaiting response' },
  { company: 'Linear', role: 'Software Engineer', status: 'Tailored', date: 'Aug 24', fit: 88, next: 'Ready for approval' },
  { company: 'Vercel', role: 'Senior Full Stack Engineer', status: 'Draft', date: 'Aug 23', fit: 84, next: 'CV validation' },
  { company: 'Ramp', role: 'Backend Engineer', status: 'Rejected', date: 'Aug 21', fit: 79, next: 'Closed' },
  { company: 'Notion', role: 'Senior Software Engineer', status: 'Interview', date: 'Aug 19', fit: 76, next: 'Technical round' },
];

export const approvals = [
  { type: 'Application', title: 'Senior Backend Engineer · Stripe', meta: 'Tailored CV ready', tone: 'purple' },
  { type: 'Recruiter DM', title: 'Message · Engineering Recruiter', meta: 'Personalized draft ready', tone: 'blue' },
  { type: 'LinkedIn Post', title: 'AI engineering job-search update', meta: 'Draft · scheduled for review', tone: 'amber' },
];

export const posts = [
  { title: 'AI engineering job-search update', status: 'Needs approval', schedule: 'Tomorrow · 10:00', type: 'LinkedIn Post' },
  { title: 'What I learned from building an agentic workflow', status: 'Scheduled', schedule: 'Aug 27 · 10:00', type: 'LinkedIn Post' },
  { title: 'Backend engineering interview notes', status: 'Draft', schedule: 'Not scheduled', type: 'LinkedIn Post' },
];
