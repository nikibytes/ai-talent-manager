'use client';

import { useState } from 'react';
import { PageHeader, StatusPill } from '../shared/ui';
import { queue } from '../shared/data';

export function QueuePage() {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const visible = queue.filter(
    (job) =>
      (filter === 'All' || job.status === filter) &&
      `${job.company} ${job.role}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <PageHeader
        eyebrow="OPPORTUNITIES"
        title="Opportunity Queue"
        description="Review and prioritize qualifying roles before they enter the application workflow."
      />
      <section className="panel">
        <div className="toolbar">
          <div className="tabs">
            {['All', 'Ready', 'Review'].map((item) => (
              <button
                key={item}
                className={filter === item ? 'tab active' : 'tab'}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <input
            className="search-input"
            placeholder="Search roles or companies"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="table wide-table">
          <div className="table-head queue-head">
            <span>Opportunity</span>
            <span>Fit</span>
            <span>Status</span>
            <span>Source</span>
            <span>Posted</span>
          </div>
          {visible.map((job) => (
            <div className="table-row queue-row" key={job.company}>
              <div className="job">
                <div className="company-logo">{job.company[0]}</div>
                <div><a href="#" style={{textDecoration: "underline", color: "inherit"}}><b>{job.role}</b></a><small>{job.company} · {job.location}</small></div>
              </div>
              <strong className="score">{job.score}%</strong>
              <StatusPill>{job.status}</StatusPill>
              <span className="muted">{job.source}</span>
              <span className="muted">{job.posted}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
