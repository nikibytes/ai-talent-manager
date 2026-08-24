'use client';

import { PageHeader, StatusPill } from '../shared/ui';
import { posts } from '../shared/data';

export function ContentPage() {
  return (
    <>
      <PageHeader
        eyebrow="CONTENT"
        title="LinkedIn Content"
        description="Draft, review and schedule professional posts from one place."
        action={<button className="primary-button">+ New draft</button>}
      />
      <section className="content-grid">
        {posts.map((post) => (
          <article className="content-card panel" key={post.title}>
            <div className="content-card-top">
              <span className="approval-type">{post.type}</span>
              <StatusPill>{post.status}</StatusPill>
            </div>
            <h2><a href="#" style={{textDecoration: "underline", color: "inherit"}}>{post.title}</a></h2>
            <p className="muted">{post.schedule}</p>
            <div className="post-preview">
              A polished preview of the post will appear here. Keep the candidate voice professional,
              specific and grounded in verified experience.
            </div>
            <div className="card-actions">
              <button className="secondary-button">Edit</button>
              <button className="primary-button">Review</button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
