'use client';

import { useState } from 'react';

const queue = [
  { company: 'Stripe', role: 'Senior Backend Engineer', score: 92, status: 'Ready', location: 'Remote' },
  { company: 'Linear', role: 'Software Engineer', score: 88, status: 'Ready', location: 'Remote' },
  { company: 'Vercel', role: 'Senior Full Stack Engineer', score: 84, status: 'Review', location: 'Remote' },
  { company: 'Ramp', role: 'Backend Engineer', score: 79, status: 'Review', location: 'New York / Remote' },
];

const approvals = [
  { type: 'Application', title: 'Senior Backend Engineer · Stripe', meta: 'Tailored CV ready', tone: 'purple' },
  { type: 'Recruiter DM', title: 'Message · Engineering Recruiter', meta: 'Personalized draft ready', tone: 'blue' },
  { type: 'LinkedIn Post', title: 'AI engineering job-search update', meta: 'Draft · scheduled for review', tone: 'amber' },
];

export default function Dashboard() {
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'MANUAL' | 'AUTONOMOUS'>('MANUAL');

  const runNow = () => {
    setRunning(true);
    window.setTimeout(() => setRunning(false), 1400);
  };

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">✦</span><span>Talent Manager</span></div>
        <nav>
          <a className="nav-item active" href="#overview">Overview</a>
          <a className="nav-item" href="#queue">Opportunity Queue <span>12</span></a>
          <a className="nav-item" href="#applications">Applications <span>8</span></a>
          <a className="nav-item" href="#approvals">Approvals <span>3</span></a>
          <a className="nav-item" href="#content">Content</a>
          <a className="nav-item" href="#settings">Settings</a>
        </nav>
        <div className="sidebar-footer"><div className="status-dot" /> System ready<div className="version">Frontend · DASH-001_002</div></div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div><p className="eyebrow">CONTROL CENTER</p><h1>Good morning</h1><p className="muted">Your talent manager is ready for today&apos;s run.</p></div>
          <button className="run-button" onClick={runNow} disabled={running}>{running ? 'Running…' : '▶ Run Now'}</button>
        </header>

        <section id="overview" className="stats-grid">
          <article className="stat-card"><span>Daily target</span><strong>5 / 10</strong><small>applications today</small></article>
          <article className="stat-card"><span>Queue</span><strong>12</strong><small>qualifying opportunities</small></article>
          <article className="stat-card"><span>Approvals</span><strong>3</strong><small>awaiting your decision</small></article>
          <article className="stat-card"><span>Last run</span><strong>09:58</strong><small>completed successfully</small></article>
        </section>

        <div className="grid-main">
          <section id="queue" className="panel queue-panel">
            <div className="panel-header"><div><h2>Opportunity Queue</h2><p className="muted">Top matches waiting for processing</p></div><button className="text-button">View all →</button></div>
            <div className="table">
              <div className="table-head"><span>Opportunity</span><span>Fit</span><span>Status</span></div>
              {queue.map((job) => <div className="table-row" key={job.company}><div className="job"><div className="company-logo">{job.company[0]}</div><div><b>{job.role}</b><small>{job.company} · {job.location}</small></div></div><strong className="score">{job.score}%</strong><span className={`pill ${job.status.toLowerCase()}`}>{job.status}</span></div>)}
            </div>
          </section>

          <section id="approvals" className="panel approvals-panel">
            <div className="panel-header"><div><h2>Needs your approval</h2><p className="muted">Manual mode is active</p></div></div>
            <div className="approval-list">
              {approvals.map((item) => <article className="approval" key={item.title}><div className={`approval-icon ${item.tone}`}>{item.type === 'Application' ? '↗' : item.type === 'Recruiter DM' ? '✉' : '✦'}</div><div className="approval-copy"><span>{item.type}</span><b>{item.title}</b><small>{item.meta}</small></div><button className="review-button">Review</button></article>)}
            </div>
          </section>
        </div>

        <section id="settings" className="panel settings-panel">
          <div><h2>Execution mode</h2><p className="muted">Controls how external actions are handled. Frontend-only preview — no settings are persisted.</p></div>
          <div className="mode-switch" role="group" aria-label="Execution mode">
            <button className={mode === 'MANUAL' ? 'selected' : ''} onClick={() => setMode('MANUAL')}>Manual <small>Approve actions</small></button>
            <button className={mode === 'AUTONOMOUS' ? 'selected' : ''} onClick={() => setMode('AUTONOMOUS')}>Autonomous <small>Execute automatically</small></button>
          </div>
        </section>
      </section>
    </main>
  );
}
