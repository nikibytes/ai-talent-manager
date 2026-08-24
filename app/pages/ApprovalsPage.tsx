'use client';

import { useState } from 'react';
import { PageHeader } from '../shared/ui';
import { approvals as initialApprovals } from '../shared/data';

export function ApprovalsPage() {
  const [items, setItems] = useState(initialApprovals);
  const remove = (title: string) =>
    setItems((current) => current.filter((item) => item.title !== title));

  return (
    <>
      <PageHeader
        eyebrow="APPROVAL CENTER"
        title="Approvals"
        description="Review proposed external actions. This frontend preview does not execute or persist actions."
      />
      <section className="approval-grid">
        {items.map((item) => (
          <article className="approval-card panel" key={item.title}>
            <div className={`approval-icon ${item.tone}`}>
              {item.type === 'Application' ? '↗' : item.type === 'Recruiter DM' ? '✉' : '✦'}
            </div>
            <span className="approval-type">{item.type}</span>
            <h2>{item.title}</h2>
            <p className="muted">{item.meta}</p>
            <div className="approval-preview">
              Preview content for this proposed action. The real execution layer will be connected separately.
            </div>
            <div className="card-actions">
              <button className="secondary-button" onClick={() => remove(item.title)}>Reject</button>
              <button className="primary-button" onClick={() => remove(item.title)}>Approve</button>
            </div>
          </article>
        ))}
      </section>
      {items.length === 0 && (
        <div className="empty-state panel">
          <strong>All caught up.</strong>
          <span>No pending approvals in the mock queue.</span>
        </div>
      )}
    </>
  );
}
