import type { DdgEmployeeRoleId } from '@workspace/project-constants';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
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

type Sequence = { id: string; label: string; src: string; frames: number; frameMs: number; start?: number; columns?: number; rows?: number; indices?: number[]; poster?: string; canvasAspect?: number };
const animations = sequences as Partial<Record<DdgEmployeeRoleId, Sequence[]>>;
export function employeeSequences(employeeId: DdgEmployeeRoleId): Sequence[] {
  return animations[employeeId] ?? [];
}

function OwnerSequence({ sequence, title, play, resting, onComplete }: {
  sequence: Sequence; title?: string; play: boolean; resting: boolean; onComplete?: () => void;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(document.visibilityState === 'visible');
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [frame, setFrame] = useState(0);
  const [finished, setFinished] = useState(false);
  const complete = useRef(onComplete);
  complete.current = onComplete;
  useEffect(() => {
    if (resting) return;
    setReady(false); setFailed(false);
    const image = new Image();
    image.onload = () => setReady(true);
    image.onerror = () => { setFailed(true); complete.current?.(); };
    image.src = `${import.meta.env.BASE_URL}${sequence.src}`;
    return () => { image.onload = null; image.onerror = null; };
  }, [sequence.src, resting]);
  useLayoutEffect(() => { setFrame(0); setFinished(false); }, [sequence.id, resting]);
  useEffect(() => {
    if (resting || finished || !play || !onScreen || !pageVisible || reduced || !ready || failed) return;
    // Readable, finite source-frame sequence. Hold the final pose before rest;
    // never slide an entire image strip or loop every character together.
    const frameMs = sequence.frames === 1 ? 1600 : Math.min(320, Math.max(180, Math.floor(2400 / sequence.frames)));
    const last = frame >= sequence.frames - 1;
    const timer = setTimeout(() => {
      if (last) { setFinished(true); complete.current?.(); }
      else setFrame((value) => value + 1);
    }, last ? (sequence.frames === 1 ? 1600 : 500) : frameMs);
    return () => clearTimeout(timer);
  }, [sequence, resting, frame, finished, play, onScreen, pageVisible, reduced, ready, failed]);
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
  const columns = sequence.columns ?? sequence.frames;
  const rows = sequence.rows ?? 1;
  const position = Math.min(frame, sequence.frames - 1);
  const cell = sequence.indices?.[position] ?? (sequence.start ?? 0) + position;
  // Wider transparent cells give staffs, pets and gestures room while every
  // standing body keeps the same vertical scale and ground line.
  const aspect = sequence.canvasAspect ?? 1;
  const padding = { width: `${aspect * 100}%`, left: `${(1 - aspect) * 50}%` };
  return <span ref={root} className="employee-frame-window employee-sprite" role={title ? 'img' : undefined}
    aria-label={title} aria-hidden={title ? undefined : true} data-failed={failed || undefined} data-padded={aspect > 1 || undefined}>
    {sequence.poster && <img className="employee-frame-poster" src={`${import.meta.env.BASE_URL}${sequence.poster}`} alt="" draggable={false}
      decoding="async" style={{ ...padding, visibility: resting || !ready || failed ? 'visible' : 'hidden' }} />}
    <span className="employee-frame-canvas" style={{
      ...padding, position: 'absolute', top: 0,
      visibility: !resting && ready && !failed ? 'visible' : 'hidden',
      backgroundImage: !resting ? `url("${import.meta.env.BASE_URL}${sequence.src}")` : undefined,
      backgroundSize: `${columns * 100}% ${rows * 100}%`,
      backgroundPosition: `${columns > 1 ? (cell % columns) * 100 / (columns - 1) : 0}% ${rows > 1 ? Math.floor(cell / columns) * 100 / (rows - 1) : 0}%`,
    }} />
    {failed && <span className="employee-frame-error">Artwork unavailable</span>}
  </span>;
}

/** Owner-approved22October shaded pixel heroes. Presentation, never worker status.
 * Delivery assets preserve aspect and alpha; full-resolution masters are archived.
 * The enclosing button supplies the accessible name for decorative instances.
 */
export function EmployeeSprite({ employeeId, title, action = 'rest', play = true, faceLeft, onComplete }: {
  employeeId: DdgEmployeeRoleId; title?: string; action?: string; play?: boolean; faceLeft?: boolean; onComplete?: () => void;
}) {
  const requested = employeeSequences(employeeId).find((value) => value.id === action);
  const sequence = requested ?? employeeSequences(employeeId)[0];
  if (sequence) return <span className={`employee-facing${(faceLeft ?? ['person-harald','person-njord'].includes(employeeId)) ? ' employee-facing-left' : ''}`}>
    <OwnerSequence key={employeeId} sequence={sequence} title={title} play={play} resting={action === 'rest' || !requested} onComplete={onComplete} />
  </span>;
  return <span className={`employee-facing${['person-hermes','person-mimir','person-harald','person-njord'].includes(employeeId) ? ' employee-facing-left' : ''}`}><img className="employee-sprite" src={portraits[employeeId]}
    width="256" height="256" alt={title ?? ''} aria-hidden={title ? undefined : true}
    decoding="async" draggable={false} /></span>;
}
