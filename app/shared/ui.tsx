import React from 'react';

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="muted">{description}</p>
      </div>
      {action}
    </header>
  );
}

export function StatusPill({ children }: { children: React.ReactNode }) {
  const tone = String(children).toLowerCase().replace(/\s/g, '-');
  return <span className={`pill ${tone}`}>{children}</span>;
}
