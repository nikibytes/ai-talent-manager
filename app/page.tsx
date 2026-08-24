'use client';

import { useEffect, useState } from 'react';

type View = 'overview' | 'queue' | 'applications' | 'approvals' | 'content' | 'settings';

const queue = [
  { company: 'Stripe', role: 'Senior Backend Engineer', score: 92, status: 'Ready', location: 'Remote', source: 'LinkedIn', posted: '2h ago' },
  { company: 'Linear', role: 'Software Engineer', score: 88, status: 'Ready', location: 'Remote', source: 'LinkedIn', posted: '4h ago' },
  { company: 'Vercel', role: 'Senior Full Stack Engineer', score: 84, status: 'Review', location: 'Remote', source: 'LinkedIn', posted: '5h ago' },
  { company: 'Ramp', role: 'Backend Engineer', score: 79, status: 'Review', location: 'New York / Remote', source: 'LinkedIn', posted: '7h ago' },
  { company: 'Notion', role: 'Senior Software Engineer', score: 76, status: 'Review', location: 'San Francisco / Remote', source: 'Agent Reach', posted: 'Yesterday' },
];

const applications = [
  { company: 'Stripe', role: 'Senior Backend Engineer', status: 'Applied', date: 'Aug 24', fit: 92, next: 'Awaiting response' },
  { company: 'Linear', role: 'Software Engineer', status: 'Tailored', date: 'Aug 24', fit: 88, next: 'Ready for approval' },
  { company: 'Vercel', role: 'Senior Full Stack Engineer', status: 'Draft', date: 'Aug 23', fit: 84, next: 'CV validation' },
  { company: 'Ramp', role: 'Backend Engineer', status: 'Rejected', date: 'Aug 21', fit: 79, next: 'Closed' },
  { company: 'Notion', role: 'Senior Software Engineer', status: 'Interview', date: 'Aug 19', fit: 76, next: 'Technical round' },
];

const approvals = [
  { type: 'Application', title: 'Senior Backend Engineer · Stripe', meta: 'Tailored CV ready', tone: 'purple' },
  { type: 'Recruiter DM', title: 'Message · Engineering Recruiter', meta: 'Personalized draft ready', tone: 'blue' },
  { type: 'LinkedIn Post', title: 'AI engineering job-search update', meta: 'Draft · scheduled for review', tone: 'amber' },
];

const posts = [
  { title: 'AI engineering job-search update', status: 'Needs approval', schedule: 'Tomorrow · 10:00', type: 'LinkedIn Post' },
  { title: 'What I learned from building an agentic workflow', status: 'Scheduled', schedule: 'Aug 27 · 10:00', type: 'LinkedIn Post' },
  { title: 'Backend engineering interview notes', status: 'Draft', schedule: 'Not scheduled', type: 'LinkedIn Post' },
];

const navItems: { id: View; label: string; badge?: number }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'queue', label: 'Opportunity Queue', badge: 12 },
  { id: 'applications', label: 'Applications', badge: 8 },
  { id: 'approvals', label: 'Approvals', badge: 3 },
  { id: 'content', label: 'Content' },
  { id: 'settings', label: 'Settings' },
];

function useView(): [View, (view: View) => void] {
  const getView = (): View => {
    const value = window.location.hash.replace('#', '') as View;
    return navItems.some((item) => item.id === value) ? value : 'overview';
  };
  const [view, setViewState] = useState<View>('overview');
  useEffect(() => {
    const sync = () => setViewState(getView());
    sync();
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);
  const setView = (next: View) => { window.location.hash = next; setViewState(next); };
  return [view, setView];
}

function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: React.ReactNode }) {
  return <header className="topbar"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{description}</p></div>{action}</header>;
}

function StatusPill({ children }: { children: React.ReactNode }) {
  const tone = String(children).toLowerCase().replace(/\s/g, '-');
  return <span className={`pill ${tone}`}>{children}</span>;
}

function Overview({ go }: { go: (view: View) => void }) {
  const [running, setRunning] = useState(false);
  const runNow = () => { setRunning(true); window.setTimeout(() => setRunning(false), 1400); };
  return <>
    <PageHeader eyebrow="CONTROL CENTER" title="Good morning" description="Your talent manager is ready for today's run." action={<button className="run-button" onClick={runNow} disabled={running}>{running ? 'Running…' : '▶ Run Now'}</button>} />
    <section className="stats-grid">
      <article className="stat-card"><span>Daily target</span><strong>5 / 10</strong><small>applications today</small></article>
      <article className="stat-card"><span>Queue</span><strong>12</strong><small>qualifying opportunities</small></article>
      <article className="stat-card"><span>Approvals</span><strong>3</strong><small>awaiting your decision</small></article>
      <article className="stat-card"><span>Last run</span><strong>09:58</strong><small>completed successfully</small></article>
    </section>
    <div className="grid-main">
      <section className="panel queue-panel"><div className="panel-header"><div><h2>Opportunity Queue</h2><p className="muted">Top matches waiting for processing</p></div><button className="text-button" onClick={() => go('queue')}>View all →</button></div><div className="table">{queue.slice(0, 4).map((job) => <div className="table-row" key={job.company}><div className="job"><div className="company-logo">{job.company[0]}</div><div><b>{job.role}</b><small>{job.company} · {job.location}</small></div></div><strong className="score">{job.score}%</strong><StatusPill>{job.status}</StatusPill></div>)}</div></section>
      <section className="panel approvals-panel"><div className="panel-header"><div><h2>Needs your approval</h2><p className="muted">Manual mode is active</p></div></div><div className="approval-list">{approvals.map((item) => <article className="approval" key={item.title}><div className={`approval-icon ${item.tone}`}>{item.type === 'Application' ? '↗' : item.type === 'Recruiter DM' ? '✉' : '✦'}</div><div className="approval-copy"><span>{item.type}</span><b>{item.title}</b><small>{item.meta}</small></div><button className="review-button" onClick={() => go('approvals')}>Review</button></article>)}</div></section>
    </div>
  </>;
}

function QueuePage() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const visible = queue.filter((job) => (filter === 'All' || job.status === filter) && `${job.company} ${job.role}`.toLowerCase().includes(query.toLowerCase()));
  return <><PageHeader eyebrow="OPPORTUNITIES" title="Opportunity Queue" description="Review and prioritize qualifying roles before they enter the application workflow." /><section className="panel"><div className="toolbar"><div className="tabs">{['All', 'Ready', 'Review'].map((item) => <button key={item} className={filter === item ? 'tab active' : 'tab'} onClick={() => setFilter(item)}>{item}</button>)}</div><input className="search-input" placeholder="Search roles or companies" value={query} onChange={(e) => setQuery(e.target.value)} /></div><div className="table wide-table"><div className="table-head queue-head"><span>Opportunity</span><span>Fit</span><span>Status</span><span>Source</span><span>Posted</span></div>{visible.map((job) => <div className="table-row queue-row" key={job.company}><div className="job"><div className="company-logo">{job.company[0]}</div><div><b>{job.role}</b><small>{job.company} · {job.location}</small></div></div><strong className="score">{job.score}%</strong><StatusPill>{job.status}</StatusPill><span className="muted">{job.source}</span><span className="muted">{job.posted}</span></div>)}</div></section></>;
}

function ApplicationsPage() {
  return <><PageHeader eyebrow="APPLICATIONS" title="Applications" description="Track tailored applications from draft through response and interview." action={<button className="secondary-button">Export view</button>} /><section className="stats-grid three"><article className="stat-card"><span>Active</span><strong>8</strong><small>applications in progress</small></article><article className="stat-card"><span>Interviews</span><strong>2</strong><small>next steps scheduled</small></article><article className="stat-card"><span>Response rate</span><strong>37%</strong><small>last 30 days</small></article></section><section className="panel"><div className="toolbar"><div className="section-label">Application pipeline</div><div className="tabs"><button className="tab active">All</button><button className="tab">Draft</button><button className="tab">Applied</button><button className="tab">Interview</button></div></div><div className="table wide-table"><div className="table-head application-head"><span>Role</span><span>Status</span><span>Fit</span><span>Applied</span><span>Next</span></div>{applications.map((app) => <div className="table-row application-row" key={app.company}><div className="job"><div className="company-logo">{app.company[0]}</div><div><b>{app.role}</b><small>{app.company}</small></div></div><StatusPill>{app.status}</StatusPill><strong className="score">{app.fit}%</strong><span className="muted">{app.date}</span><span className="muted">{app.next}</span></div>)}</div></section></>;
}

function ApprovalsPage() {
  const [items, setItems] = useState(approvals);
  const remove = (title: string) => setItems((current) => current.filter((item) => item.title !== title));
  return <><PageHeader eyebrow="APPROVAL CENTER" title="Approvals" description="Review proposed external actions. This frontend preview does not execute or persist actions." /><section className="approval-grid">{items.map((item) => <article className="approval-card panel" key={item.title}><div className={`approval-icon ${item.tone}`}>{item.type === 'Application' ? '↗' : item.type === 'Recruiter DM' ? '✉' : '✦'}</div><span className="approval-type">{item.type}</span><h2>{item.title}</h2><p className="muted">{item.meta}</p><div className="approval-preview">Preview content for this proposed action. The real execution layer will be connected separately.</div><div className="card-actions"><button className="secondary-button" onClick={() => remove(item.title)}>Reject</button><button className="primary-button" onClick={() => remove(item.title)}>Approve</button></div></article>)}</section>{items.length === 0 && <div className="empty-state panel"><strong>All caught up.</strong><span>No pending approvals in the mock queue.</span></div>}</>;
}

function ContentPage() {
  return <><PageHeader eyebrow="CONTENT" title="LinkedIn Content" description="Draft, review and schedule professional posts from one place." action={<button className="primary-button">+ New draft</button>} /><section className="content-grid">{posts.map((post) => <article className="content-card panel" key={post.title}><div className="content-card-top"><span className="approval-type">{post.type}</span><StatusPill>{post.status}</StatusPill></div><h2>{post.title}</h2><p className="muted">{post.schedule}</p><div className="post-preview">A polished preview of the post will appear here. Keep the candidate voice professional, specific and grounded in verified experience.</div><div className="card-actions"><button className="secondary-button">Edit</button><button className="primary-button">Review</button></div></article>)}</section></>;
}

function SettingsPage() {
  const [mode, setMode] = useState<'MANUAL' | 'AUTONOMOUS'>('MANUAL');
  const [target, setTarget] = useState(10);
  return <><PageHeader eyebrow="SETTINGS" title="Control Center Settings" description="Configure the frontend controls. These values are local UI state only and are not persisted." /><div className="settings-grid"><section className="panel settings-card"><div><h2>Execution mode</h2><p className="muted">Choose how proposed external actions should be handled.</p></div><div className="mode-switch full">{(['MANUAL', 'AUTONOMOUS'] as const).map((item) => <button key={item} className={mode === item ? 'selected' : ''} onClick={() => setMode(item)}>{item === 'MANUAL' ? 'Manual' : 'Autonomous'}<small>{item === 'MANUAL' ? 'Approve actions' : 'Execute automatically'}</small></button>)}</div></section><section className="panel settings-card"><div><h2>Daily application target</h2><p className="muted">Maximum applications planned for each daily run.</p></div><div className="number-control"><button onClick={() => setTarget(Math.max(1, target - 1))}>−</button><strong>{target}</strong><button onClick={() => setTarget(Math.min(50, target + 1))}>+</button></div></section><section className="panel settings-card"><div><h2>Daily run schedule</h2><p className="muted">Default schedule from the project specification.</p></div><div className="settings-fields"><label>Time<input defaultValue="10:00" /></label><label>Timezone<select defaultValue="Asia/Kolkata"><option>Asia/Kolkata</option><option>America/Los_Angeles</option><option>UTC</option></select></label></div></section><section className="panel settings-card"><div><h2>Notifications</h2><p className="muted">Frontend preview of notification preferences.</p></div><label className="toggle-row"><span>EOD report email</span><input type="checkbox" defaultChecked /></label><label className="toggle-row"><span>Approval alerts</span><input type="checkbox" defaultChecked /></label></section></div></>;
}

export default function Dashboard() {
  const [view, go] = useView();
  const page = { overview: <Overview go={go} />, queue: <QueuePage />, applications: <ApplicationsPage />, approvals: <ApprovalsPage />, content: <ContentPage />, settings: <SettingsPage /> }[view];
  return <main className="shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">✦</span><span>Talent Manager</span></div><nav>{navItems.map((item) => <a key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} href={`#${item.id}`}>{item.label}{item.badge ? <span>{item.badge}</span> : null}</a>)}</nav><div className="sidebar-footer"><div className="status-dot" /> System ready<div className="version">Frontend · DASH-001_002</div></div></aside><section className="content">{page}</section></main>;
}
