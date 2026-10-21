import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DDG_EMPLOYEE_ROLES, type DdgEmployeeRole } from '@workspace/project-constants';
import { EmployeeSprite } from './EmployeeSprite';
import './employee-dock.css';

type Preferences = { hidden: boolean; quiet: boolean };
const STORAGE_KEY = 'ddg-employee-presentation';
function savedPreferences(): Preferences {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? 'null');
    return { hidden: value?.hidden === true, quiet: value?.quiet === true };
  } catch { return { hidden: false, quiet: false }; }
}

/** Presentation roster only. NotificationInbox remains the real saved-decision path. */
export function EmployeeDock() {
  const [preferences, setPreferences] = useState(savedPreferences);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<DdgEmployeeRole | null>(null);
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const cast = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch { /* Session preference still works. */ }
  }, [preferences]);
  useEffect(() => {
    const change = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); trigger.current?.focus(); }
    };
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target) &&
          !panel.current?.contains(event.target) && !cast.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('keydown', escape);
    document.addEventListener('pointerdown', outside);
    return () => {
      document.removeEventListener('keydown', escape);
      document.removeEventListener('pointerdown', outside);
    };
  }, [open]);

  function inspect(employee: DdgEmployeeRole) { setSelected(employee); setOpen(true); }
  function character(employee: DdgEmployeeRole, index: number) {
    return <button type="button" className="employee-character" key={employee.id}
      style={{ animationDelay: `${index * -1.7}s` }}
      aria-label={`${employee.name}, ${employee.role}. View character details`}
      onClick={() => inspect(employee)}>
      <EmployeeSprite employeeId={employee.id} />
    </button>;
  }

  return <div className="employee-presentation" ref={root}>
    <button type="button" className="theme-toggle" ref={trigger} aria-expanded={open} aria-controls={panelId}
      onClick={() => setOpen((value) => !value)}>Characters</button>
    {createPortal(<>
    {!preferences.hidden && <div ref={cast} className="employee-cast" data-quiet={preferences.quiet || !visible || open}>
      <div className="employee-side employee-side-left" role="group" aria-label="Company characters, first four">
        {DDG_EMPLOYEE_ROLES.slice(0, 4).map(character)}
      </div>
      <div className="employee-side employee-side-right" role="group" aria-label="Company characters, remaining five">
        {DDG_EMPLOYEE_ROLES.slice(4).map(character)}
      </div>
    </div>}
    {open && <section id={panelId} className="employee-settings" ref={panel} tabIndex={-1} aria-labelledby={`${panelId}-title`}>
      <div className="employee-settings-heading"><h2 id={`${panelId}-title`}>Company characters</h2>
        <button type="button" onClick={() => { setOpen(false); trigger.current?.focus(); }} aria-label="Close character panel">×</button></div>
      <p>Presentation only. Characters do not show active workers or live employee messages. Saved decisions stay in Notifications.</p>
      <div className="employee-preferences">
        <label><input type="checkbox" checked={preferences.hidden} onChange={(event) => setPreferences((value) => ({ ...value, hidden: event.target.checked }))} /> Hide bottom characters</label>
        <label><input type="checkbox" checked={preferences.quiet} onChange={(event) => setPreferences((value) => ({ ...value, quiet: event.target.checked }))} /> Quiet characters (no idle motion)</label>
      </div>
      <div className="employee-tray" role="group" aria-label="All nine company characters">
        {DDG_EMPLOYEE_ROLES.map((employee) => <button key={employee.id} type="button"
          aria-pressed={selected?.id === employee.id} onClick={() => setSelected(employee)}>
          <EmployeeSprite employeeId={employee.id} /><span>{employee.name}<small>{employee.role}</small></span>
        </button>)}
      </div>
      {selected && <p className="employee-detail" role="status"><strong>{selected.name}</strong> · {selected.role}. Company role; runtime identity and message connection are unverified.</p>}
    </section>}
    </>, document.body)}
  </div>;
}
