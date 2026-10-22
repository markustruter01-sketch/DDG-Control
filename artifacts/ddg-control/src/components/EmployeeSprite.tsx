import type { DdgEmployeeRoleId } from '@workspace/project-constants';
import { useEffect, useRef, useState } from 'react';
import sequences from '../lib/employee-animations.json';
import heimdall from '../assets/employees/heimdall.webp';
import freya from '../assets/employees/freya.webp';
import tyr from '../assets/employees/tyr.webp';
import plutus from '../assets/employees/plutus.webp';
import hermes from '../assets/employees/hermes.webp';
import mimir from '../assets/employees/mimir.webp';
import daedalus from '../assets/employees/daedalus.webp';
import harald from '../assets/employees/harald.webp';
import njord from '../assets/employees/njord.webp';

const portraits: Record<DdgEmployeeRoleId, string> = {
  'person-heimdall-gm': heimdall, 'person-freya': freya, 'person-tyr': tyr,
  'person-plutus': plutus, 'person-hermes': hermes, 'person-mimir': mimir,
  'person-daedalus': daedalus, 'person-harald': harald, 'person-njord': njord,
};

type Sequence = { id: string; label: string; src: string; frames: number; frameMs: number };
const animations = sequences as Partial<Record<DdgEmployeeRoleId, Sequence[]>>;
export function employeeSequences(employeeId: DdgEmployeeRoleId): Sequence[] {
  return animations[employeeId] ?? [];
}

function OwnerSequence({ sequence, title, play, onComplete }: {
  sequence: Sequence; title?: string; play: boolean; onComplete?: () => void;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(document.visibilityState === 'visible');
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const node = root.current;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    if (node) observer.observe(node);
    const visibility = () => setPageVisible(document.visibilityState === 'visible');
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setReduced(query.matches);
    document.addEventListener('visibilitychange', visibility);
    query.addEventListener('change', motion);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', visibility); query.removeEventListener('change', motion); };
  }, []);
  return <span ref={root} className="employee-frame-window employee-sprite" role={title ? 'img' : undefined}
    aria-label={title} aria-hidden={title ? undefined : true} data-failed={failed || undefined}>
    <img className="employee-frame-strip" src={`${import.meta.env.BASE_URL}${sequence.src}`}
      alt="" draggable={false} decoding="async" onLoad={() => setReady(true)} onError={() => setFailed(true)}
      style={{ width: `${sequence.frames * 100}%`, visibility: ready && !failed ? 'visible' : 'hidden',
        animationName: 'employee-owner-frames', animationDuration: `${sequence.frames * sequence.frameMs}ms`,
        animationTimingFunction: `steps(${sequence.frames}, end)`,
        animationIterationCount: sequence.id === 'idle' ? 'infinite' : 1,
        animationPlayState: play && onScreen && pageVisible && !reduced && ready && !failed ? 'running' : 'paused' }}
      onAnimationEnd={sequence.id === 'idle' ? undefined : onComplete} />
    {failed && <span className="employee-frame-error">Artwork unavailable</span>}
  </span>;
}

/** Owner-approved22October shaded pixel heroes. Presentation, never worker status.
 * Delivery assets preserve aspect and alpha; full-resolution masters are archived.
 * The enclosing button supplies the accessible name for decorative instances.
 */
export function EmployeeSprite({ employeeId, title, action = 'idle', play = true, onComplete }: {
  employeeId: DdgEmployeeRoleId; title?: string; action?: string; play?: boolean; onComplete?: () => void;
}) {
  const sequence = employeeSequences(employeeId).find((value) => value.id === action) ?? employeeSequences(employeeId)[0];
  if (sequence) return <span className={`employee-facing${['person-mimir','person-harald','person-njord'].includes(employeeId) ? ' employee-facing-left' : ''}`}>
    <OwnerSequence key={`${employeeId}-${action}`} sequence={sequence} title={title} play={play} onComplete={onComplete} />
  </span>;
  return <span className={`employee-facing${['person-hermes','person-mimir','person-harald','person-njord'].includes(employeeId) ? ' employee-facing-left' : ''}`}><img className="employee-sprite" src={portraits[employeeId]}
    width="256" height="256" alt={title ?? ''} aria-hidden={title ? undefined : true}
    decoding="async" draggable={false} /></span>;
}
