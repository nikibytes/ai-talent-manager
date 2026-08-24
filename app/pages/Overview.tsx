'use client';

import { useState } from 'react';
import { PageHeader, StatusPill } from '../shared/ui';
import { queue, approvals } from '../shared/data';
import type { View } from '../shared/types';

export function Overview({ go }: { go: (view: View) => void }) {
  const [running, setRunning] = useState(false);
  const runNow = () => { setRunning(true); window.setTimeout(() => setRunning(false), 1400); };

  return (
    <>
      <PageHeader
        eyebrow="CONTROL CENTER"
        title="Good morning"
        description="Your talent manager is ready for today's run."
        action={
          <button className="run-button" onClick={runNow} disabled={running}>
            {running ? 'Running…' : '▶ Run Now'}
          </button>
        }
      />

      <section className="stats-grid">
        <article className="stat-card"><span>Daily target</span><strong>5 / 10</strong><small>applications today</small></article>
        <article className="stat-card"><span>Queue</span><strong>12</strong><small>qualifying opportunities</small></article>
        <article className="stat-card"><span>Approvals</span><strong>3</strong><small>awaiting your decision</small></article>
        <article className="stat-card"><span>Last run</span><strong>09:58</strong><small>completed successfully</small></article>
      </section>

      <div className="grid-main">
        <section className="panel queue-panel">
          <div className="panel-header">
            <div>
              <h2>Opportunity Queue</h2>
              <p className="muted">Top matches waiting for processing</p>
            </div>
            <button className="text-button" onClick={() => go('queue')}>View all →</button>
          </div>
          <div className="table">
            {queue.slice(0, 4).map((job) => (
              <div className="table-row" key={job.company}>
                <div className="job">
                  <div className="company-logo">{job.company[0]}</div>
                  <div><b>{job.role}</b><small>{job.company} · {job.location}</small></div>
                </div>
                <strong className="score">{job.score}%</strong>
                <StatusPill>{job.status}</StatusPill>
              </div>
            ))}
          </div>
        </section>

        <section className="panel approvals-panel">
          <div className="panel-header">
            <div>
              <h2>Needs your approval</h2>
              <p className="muted">Manual mode is active</p>
            </div>
          </div>
          <div className="approval-list">
            {approvals.map((item) => (
              <article className="approval" key={item.title}>
                <div className={`approval-icon ${item.tone}`}>
                  {item.type === 'Application' ? '↗' : item.type === 'Recruiter DM' ? '✉' : '✦'}
                </div>
                <div className="approval-copy">
                  <span>{item.type}</span>
                  <b>{item.title}</b>
                  <small>{item.meta}</small>
                </div>
                <button className="review-button" onClick={() => go('approvals')}>Review</button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
