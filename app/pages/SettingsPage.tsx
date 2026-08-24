'use client';

import { useState } from 'react';
import { PageHeader } from '../shared/ui';

export function SettingsPage() {
  const [mode, setMode] = useState<'MANUAL' | 'AUTONOMOUS'>('MANUAL');
  const [target, setTarget] = useState(10);
  const [amPm, setAmPm] = useState<'AM' | 'PM'>('AM');

  return (
    <>
      <PageHeader
        eyebrow="SETTINGS"
        title="Control Center Settings"
        description="Configure the frontend controls. These values are local UI state only and are not persisted."
      />
      <div className="settings-grid">
        <section className="panel settings-card">
          <div>
            <h2>Execution mode</h2>
            <p className="muted">Choose how proposed external actions should be handled.</p>
          </div>
          <div className="mode-switch full">
            {(['MANUAL', 'AUTONOMOUS'] as const).map((item) => (
              <button
                key={item}
                className={mode === item ? 'selected' : ''}
                onClick={() => setMode(item)}
              >
                {item === 'MANUAL' ? 'Manual' : 'Autonomous'}
                <small>{item === 'MANUAL' ? 'Approve actions' : 'Execute automatically'}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="panel settings-card">
          <div>
            <h2>Daily application target</h2>
            <p className="muted">Maximum applications planned for each daily run.</p>
          </div>
          <div className="number-control">
            <button onClick={() => setTarget(Math.max(1, target - 1))}>−</button>
            <strong>{target}</strong>
            <button onClick={() => setTarget(Math.min(50, target + 1))}>+</button>
          </div>
        </section>

        <section className="panel settings-card">
          <div>
            <h2>Daily run schedule</h2>
            <p className="muted">Default schedule from the project specification.</p>
          </div>
          <div className="settings-fields">
            <label>
              Time
              <div style={{ display: "flex", alignItems: "center", gap: "0", marginTop: "8px" }}>
                <input defaultValue="10:00" style={{ width: "80px", borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRight: "none" }} />
                <div className="mode-switch" style={{ display: "inline-flex", width: "auto", padding: "2px", margin: 0, borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}>
                  {(['AM', 'PM'] as const).map((item) => (
                    <button
                      key={item}
                      className={amPm === item ? 'selected' : ''}
                      onClick={() => setAmPm(item)}
                      style={{ padding: "4px 8px" }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </label>
            <label>
              Timezone
              <select defaultValue="Asia/Kolkata">
              {/* TODO: Convert select into component and add all the timezones in the picker */}
                <option>Asia/Kolkata</option>
                <option>America/Los_Angeles</option>
                <option>UTC</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel settings-card">
          <div>
            <h2>Notifications</h2>
            <p className="muted">Configure report delivery and alerts.</p>
          </div>
          <div className="settings-fields" style={{marginTop: "16px", marginBottom: "16px"}}>
            <label>EOD Report Email<input type="email" defaultValue="candidate@example.com" placeholder="Enter email address" /></label>
          </div>
          <label className="toggle-row"><span>EOD report email</span><input type="checkbox" defaultChecked /></label>
          <label className="toggle-row"><span>Approval alerts</span><input type="checkbox" defaultChecked /></label>
        </section>
      </div>

      <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button className="secondary-button">Cancel</button>
        <button className="primary-button">Save Changes</button>
      </div>
    </>
  );
}
