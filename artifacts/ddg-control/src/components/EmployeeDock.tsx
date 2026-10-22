import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { DDG_EMPLOYEE_ROLES, type DdgEmployeeRole } from '@workspace/project-constants';
import { EmployeeSprite, employeeSequences } from './EmployeeSprite';
import { EMPLOYEE_BANTER } from '../lib/employee-banter';
import './employee-dock.css';

type Preferences = { hidden: boolean; quiet: boolean };
const STORAGE_KEY = 'ddg-employee-presentation';
const DESKTOP_CAST_QUERY = '(min-width: 1051px)';
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
  const [remarkIndex, setRemarkIndex] = useState<number | null>(null);
  const [action, setAction] = useState('idle');
  const [playId, setPlayId] = useState(0);
  const [dockAction, setDockAction] = useState<{ employeeId: string; action: string; partnerId?: string } | null>(null);
  const sceneIndex = useRef(0);
  const [visible, setVisible] = useState(() => document.visibilityState === 'visible');
  const [desktopCast, setDesktopCast] = useState(() => window.matchMedia(DESKTOP_CAST_QUERY).matches);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const panelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const cast = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const remarkTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!desktopCast || preferences.hidden || preferences.quiet || !visible || open || reducedMotion) {
      setDockAction(null);
      return;
    }
    // One decorative scene at a time; source frames, not a worker/activity signal.
    const scenes = [
      { employeeId: 'person-mimir', action: 'discuss-daedalus', partnerId: 'person-daedalus' },
      { employeeId: 'person-freya', action: 'raven-storm' },
      { employeeId: 'person-njord', action: 'splash-daedalus', partnerId: 'person-daedalus' },
      { employeeId: 'person-plutus', action: 'count-money' },
      { employeeId: 'person-daedalus', action: 'gadget' },
      { employeeId: 'person-harald', action: 'slam-book' },
      { employeeId: 'person-njord', action: 'high-five', partnerId: 'person-daedalus' },
      { employeeId: 'person-plutus', action: 'high-five', partnerId: 'person-njord' },
      { employeeId: 'person-freya', action: 'laptop' },
      { employeeId: 'person-mimir', action: 'data-spell' },
      { employeeId: 'person-daedalus', action: 'drone-swarm' },
      { employeeId: 'person-harald', action: 'phone' },
    ];
    let recovery: ReturnType<typeof setTimeout> | undefined;
    const timer = setInterval(() => {
      if (cast.current?.contains(document.activeElement)) return;
      const scene = scenes[sceneIndex.current % scenes.length];
      sceneIndex.current += 1;
      setDockAction(scene);
      // Also recover if an asset fails or animationend is lost. No retries.
      if (recovery) clearTimeout(recovery);
      recovery = setTimeout(() => setDockAction(null), 2800);
    }, 4000);
    return () => { clearInterval(timer); if (recovery) clearTimeout(recovery); };
  }, [desktopCast, preferences.hidden, preferences.quiet, visible, open, reducedMotion]);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReducedMotion(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);

  function closePanel() {
    setOpen(false);
    (opener.current?.isConnected ? opener.current : trigger.current)?.focus();
  }

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences)); } catch { /* Session preference still works. */ }
  }, [preferences]);
  useEffect(() => {
    const change = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', change);
    return () => document.removeEventListener('visibilitychange', change);
  }, []);
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_CAST_QUERY);
    const change = () => {
      if (!query.matches && cast.current?.contains(document.activeElement)) trigger.current?.focus();
      setDesktopCast(query.matches);
    };
    query.addEventListener('change', change);
    change();
    return () => query.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.focus();
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !event.defaultPrevented) { event.preventDefault(); closePanel(); }
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

  function select(employee: DdgEmployeeRole) { setSelected(employee); setRemarkIndex(null); setAction('idle'); }
  function inspect(employee: DdgEmployeeRole, button: HTMLButtonElement) {
    opener.current = button;
    select(employee);
    setOpen(true);
  }
  // Remarks are requested by the owner, never generated on a timer or treated as notifications.
  useEffect(() => { if (!open) setRemarkIndex(null); }, [open]);
  function character(employee: DdgEmployeeRole) {
    return <button type="button" className="employee-character" key={employee.id} data-employee={employee.id}
      style={{ visibility: dockAction?.partnerId === employee.id ? 'hidden' : undefined }}
      title={`${employee.name} · ${employee.role}`}
      aria-label={`${employee.name}, ${employee.role}. View character details`}
      onClick={(event) => inspect(employee, event.currentTarget)}>
      <span className="employee-caption" aria-hidden="true">{employee.name}
        {dockAction?.employeeId === employee.id && dockAction.partnerId && ` + ${DDG_EMPLOYEE_ROLES.find((role) => role.id === dockAction.partnerId)?.name ?? ''}`}
      </span>
      <EmployeeSprite employeeId={employee.id} action={dockAction?.employeeId === employee.id ? dockAction.action : 'idle'}
        play={!preferences.quiet && visible && !open} onComplete={() => setDockAction(null)} />
    </button>;
  }

  return <div className="employee-presentation" ref={root}>
    <button type="button" className="theme-toggle employee-toggle" ref={trigger} aria-expanded={open} aria-controls={panelId}
      aria-label="Company characters and presentation preferences" onClick={(event) => {
        opener.current = event.currentTarget;
        setOpen((value) => !value);
      }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="9" cy="7" r="3" /><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 4a3 3 0 0 1 0 6m2 10v-3a6 6 0 0 0-2-4" /></svg>
      <span>Characters</span>
    </button>
    {createPortal(<>
    {desktopCast && !preferences.hidden && <div ref={cast} className="employee-cast" data-quiet={preferences.quiet || !visible || open}>
      <div className="employee-side employee-side-left" role="group" aria-label="Company characters, first four">
        {DDG_EMPLOYEE_ROLES.slice(0, 4).map(character)}
      </div>
      <div className="employee-side employee-side-right" role="group" aria-label="Company characters, remaining five">
        {DDG_EMPLOYEE_ROLES.slice(4).map(character)}
      </div>
    </div>}
    {open && <section id={panelId} className="employee-settings" ref={panel} tabIndex={-1} aria-labelledby={`${panelId}-title`}>
      <div className="employee-settings-heading"><h2 id={`${panelId}-title`}>Company characters</h2>
        <button type="button" onClick={closePanel} aria-label="Close character panel">×</button></div>
      <p>Presentation only. Characters do not show active workers or live employee messages. Saved decisions stay in Notifications.</p>
      <div className="employee-preferences">
        <label><input type="checkbox" checked={preferences.hidden} onChange={(event) => setPreferences((value) => ({ ...value, hidden: event.target.checked }))} /> Hide bottom characters</label>
        <label><input type="checkbox" checked={preferences.quiet} onChange={(event) => setPreferences((value) => ({ ...value, quiet: event.target.checked }))} /> Quiet characters (no idle motion)</label>
      </div>
      <div className="employee-tray" role="group" aria-label="All nine company characters" data-quiet={preferences.quiet || !visible}>
        {DDG_EMPLOYEE_ROLES.map((employee) => <button key={employee.id} type="button"
          data-employee={employee.id} aria-pressed={selected?.id === employee.id} onClick={() => select(employee)}>
          <EmployeeSprite employeeId={employee.id} play={false} /><span>{employee.name}<small>{employee.role}</small></span>
        </button>)}
      </div>
      {selected && <div className="employee-detail" role="status">
        <EmployeeSprite key={`${selected.id}-${playId}`} employeeId={selected.id} action={action}
          play={!preferences.quiet && visible} onComplete={() => setAction('idle')} />
        <p><strong>{selected.name}</strong><br />{selected.role}<br /><small>Company character. Live work and messages are not connected.</small></p>
      </div>}
      {selected && employeeSequences(selected.id).length > 0 && <div className="employee-sequences">
        <p>Owner-supplied pixel animations · presentation only</p>
        <div role="group" aria-label={`${selected.name} animation sequences`}>
          {employeeSequences(selected.id).map((sequence) => <button type="button" key={sequence.id}
            aria-pressed={action === sequence.id} onClick={() => { setAction(sequence.id); setPlayId((value) => value + 1); }}>
            {sequence.label}
          </button>)}
        </div>
        <small>Actions play once, then return to idle. Quiet and reduced-motion settings pause playback.</small>
      </div>}
      {selected && <div className="employee-banter">
        <button type="button" ref={remarkTrigger} onClick={() => setRemarkIndex((value) => value === null ? 0 : (value + 1) % EMPLOYEE_BANTER[selected.id].length)}>
          {remarkIndex === null ? 'Character remark' : 'Another remark'}
        </button>
        {remarkIndex !== null &&
          <p className="employee-banter-label">Preset character banter · not a work update</p>
        }
        <div aria-live="polite" aria-atomic="true">
          {remarkIndex !== null && <p>{selected.name}: “{EMPLOYEE_BANTER[selected.id][remarkIndex]}”</p>}
        </div>
        {remarkIndex !== null && <button type="button" onClick={() => {
          setRemarkIndex(null);
          remarkTrigger.current?.focus();
        }}>Dismiss remark</button>}
      </div>}
    </section>}
    </>, document.body)}
  </div>;
}
