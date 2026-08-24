'use client';

import { navItems } from './shared/data';
import { useView } from './shared/useView';
import { Overview } from './pages/Overview';
import { QueuePage } from './pages/QueuePage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { ContentPage } from './pages/ContentPage';
import { SettingsPage } from './pages/SettingsPage';

export default function Dashboard() {
  const [view, go] = useView();

  const page = {
    overview: <Overview go={go} />,
    queue: <QueuePage />,
    applications: <ApplicationsPage />,
    approvals: <ApprovalsPage />,
    content: <ContentPage />,
    settings: <SettingsPage />,
  }[view];

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <span>Talent Manager</span>
        </div>
        <nav>
          {navItems.map((item) => (
            <a
              key={item.id}
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              href={`#${item.id}`}
            >
              {item.label}
              {item.badge ? <span>{item.badge}</span> : null}
            </a>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="status-dot" /> System ready
          <div className="version">Frontend · DASH-001_002</div>
        </div>
      </aside>
      <section className="content">{page}</section>
    </main>
  );
}
