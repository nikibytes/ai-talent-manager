'use client';

import { useState } from 'react';
import { PageHeader, StatusPill } from '../shared/ui';
import { applications as initialApplications } from '../shared/data';

export function ApplicationsPage() {
  const [apps, setApps] = useState(initialApplications);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const [editStatus, setEditStatus] = useState('');
  const [editNext, setEditNext] = useState('');

  const handleDelete = (company: string) => {
    setApps(apps.filter(app => app.company !== company));
    setMenuOpenId(null);
  };

  const handleEditClick = (app: any) => {
    setEditingId(app.company);
    setEditStatus(app.status);
    setEditNext(app.next);
    setMenuOpenId(null);
  };

  const handleSave = (company: string) => {
    setApps(apps.map(app => 
      app.company === company 
        ? { ...app, status: editStatus, next: editNext } 
        : app
    ));
    setEditingId(null);
  };

  return (
    <>
      <PageHeader
        eyebrow="APPLICATIONS"
        title="Applications"
        description="Track tailored applications from draft through response and interview."
        action={<button className="secondary-button">Export view</button>}
      />
      <section className="stats-grid three">
        <article className="stat-card"><span>Active</span><strong>8</strong><small>applications in progress</small></article>
        <article className="stat-card"><span>Interviews</span><strong>2</strong><small>next steps scheduled</small></article>
        <article className="stat-card"><span>Response rate</span><strong>37%</strong><small>last 30 days</small></article>
      </section>
      <section className="panel">
        <div className="toolbar">
          <div className="section-label">Application pipeline</div>
          <div className="tabs">
            <button className="tab active">All</button>
            <button className="tab">Draft</button>
            <button className="tab">Applied</button>
            <button className="tab">Interview</button>
          </div>
        </div>
        <div className="table wide-table" style={{paddingBottom: "100px"}}>
          <div className="table-head application-head" style={{gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 50px"}}>
            <span>Role</span>
            <span>Status</span>
            <span>Fit</span>
            <span>Applied</span>
            <span>Next</span>
            <span></span>
          </div>
          {apps.map((app) => (
            <div className="table-row application-row" key={app.company} style={{gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 50px", position: "relative"}}>
              <div className="job">
                <div className="company-logo">{app.company[0]}</div>
                <div>
                  <a href="#" style={{textDecoration: "underline", color: "inherit"}}><b>{app.role}</b></a>
                  <small>{app.company}</small>
                </div>
              </div>
              
              {editingId === app.company ? (
                <>
                  <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} style={{padding: "4px", alignSelf: "center"}}>
                    <option>Draft</option>
                    <option>Applied</option>
                    <option>Interview</option>
                    <option>Rejected</option>
                    <option>Tailored</option>
                  </select>
                  <strong className="score">{app.fit}%</strong>
                  <span className="muted">{app.date}</span>
                  <input type="text" value={editNext} onChange={(e) => setEditNext(e.target.value)} style={{padding: "4px", alignSelf: "center", width: "100%"}} />
                  <div style={{display: "flex", gap: "4px", alignSelf: "center"}}>
                    <button onClick={() => handleSave(app.company)} style={{background: "transparent", border: "none", cursor: "pointer", fontSize: "16px"}}>✅</button>
                    <button onClick={() => setEditingId(null)} style={{background: "transparent", border: "none", cursor: "pointer", fontSize: "16px"}}>❌</button>
                  </div>
                </>
              ) : (
                <>
                  <StatusPill>{app.status}</StatusPill>
                  <strong className="score">{app.fit}%</strong>
                  <span className="muted">{app.date}</span>
                  <span className="muted">{app.next}</span>
                  <div style={{alignSelf: "center", justifySelf: "end", position: "relative"}}>
                    <button 
                      onClick={() => setMenuOpenId(menuOpenId === app.company ? null : app.company)} 
                      style={{background: "transparent", border: "none", cursor: "pointer", padding: "4px", fontSize: "18px"}}
                    >
                      ⋮
                    </button>
                    {menuOpenId === app.company && (
                      <div className="dropdown-menu" style={{
                        position: "absolute", right: 0, top: "100%", background: "var(--panel)", border: "1px solid var(--border)", 
                        borderRadius: "8px", padding: "4px", zIndex: 10, minWidth: "160px", boxShadow: "0 8px 24px rgba(0,0,0,0.6)"
                      }}>
                        <button onClick={() => handleEditClick(app)} style={{display: "flex", alignItems: "center", gap: "8px", width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", borderRadius: "6px", fontSize: "13px"}}>✏️ Edit manually</button>
                        <button onClick={() => alert('Viewing details...')} style={{display: "flex", alignItems: "center", gap: "8px", width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "var(--text)", cursor: "pointer", borderRadius: "6px", fontSize: "13px"}}>📄 View Details</button>
                        <hr style={{borderColor: "var(--border)", margin: "4px 0"}} />
                        <button onClick={() => handleDelete(app.company)} style={{display: "flex", alignItems: "center", gap: "8px", width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", color: "#ff4d4d", cursor: "pointer", borderRadius: "6px", fontSize: "13px"}}>
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
