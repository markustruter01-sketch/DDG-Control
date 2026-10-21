import type { DdgEmployeeRoleId } from '@workspace/project-constants';

type Palette = { coat: string; trim: string; hair: string; skin: string };
const palettes: Record<DdgEmployeeRoleId, Palette> = {
  'person-heimdall-gm': { coat: '#123e35', trim: '#e3b33f', hair: '#8c6636', skin: '#e5ae72' },
  'person-freya': { coat: '#672f43', trim: '#e9bb55', hair: '#e49a36', skin: '#f3c58b' },
  'person-tyr': { coat: '#175668', trim: '#a7bac1', hair: '#664a32', skin: '#ddb185' },
  'person-plutus': { coat: '#124b36', trim: '#d9b83f', hair: '#17231f', skin: '#e1b57d' },
  'person-hermes': { coat: '#24533b', trim: '#d8a438', hair: '#8a5930', skin: '#efbd80' },
  'person-mimir': { coat: '#284f3e', trim: '#bea977', hair: '#e2ded0', skin: '#d5b38c' },
  'person-daedalus': { coat: '#725039', trim: '#d5b06a', hair: '#704123', skin: '#dfb482' },
  'person-harald': { coat: '#153b33', trim: '#dcb338', hair: '#392b23', skin: '#dfb185' },
  'person-njord': { coat: '#16534c', trim: '#d7b249', hair: '#e2e1d8', skin: '#dfb38a' },
};

/** Code-native presentation art, never a worker identity or live activity signal.
 * Costumes follow the approved split-dock reference; rendered acceptance is pending.
 * The viewBox retains the complete feet, with no external assets or scripts.
 */
export function EmployeeSprite({ employeeId, title }: { employeeId: DdgEmployeeRoleId; title?: string }) {
  const p = palettes[employeeId];
  return (
    <svg viewBox="0 0 32 40" className="employee-sprite" width="32" height="40"
      shapeRendering="crispEdges" role={title ? 'img' : undefined} aria-label={title}
      aria-hidden={title ? undefined : true} focusable="false">
      <g stroke="#101f24" strokeWidth="1" strokeLinejoin="miter">
        <path fill={p.coat} d="M10 19h12l3 14-5 2h-9l-4-2z" />
        <path fill={p.trim} d="M11 20h3v13h-3zm9 0h2v13h-2z" stroke="none" />
        <path fill="#39392e" d="M11 32h5v6h-6v-3h1zm6 0h5v6h-6v-3h1z" />
        <path fill={p.trim} d="M10 37h6v2H9v-1h1zm7 0h6v2h-7v-1h1z" />
        <path fill={p.skin} d="M10 9h13v9h-3v3h-7v-2h-3z" />
        <path fill={p.hair} d="M9 8h15v4H11v5H9z" />
        <path fill={p.skin} d="M8 23h3v6H7v-4h1zm15 0h3v6h-4v-4h1z" />
      </g>
      <path fill="#17252a" d="M14 14h2v2h-2zm6 0h2v2h-2z" />
      {employeeId === 'person-heimdall-gm' && <g>
        <path fill={p.trim} stroke="#70511b" d="M10 8h14v4H10zM9 4h3v7H8V7H6V3h2v3h1zm14 0h3v3h2V3h2v7h-3v2h-4z" />
        <path fill="#d2a33a" d="M14 9h3v12h-3zM5 20h2v17H5z" />
        <path fill="#f0ca64" d="M4 17h4v5H4z" />
      </g>}
      {employeeId === 'person-freya' && <g>
        <path fill={p.hair} d="M7 10h4v14H8v5H5v-7h2zm16 0h3v12h-3z" />
        <path fill="#457143" d="M9 7h16v4H9z" />
        <path fill="#edc849" d="M10 7h3v3h-3zm5-1h3v3h-3zm6 1h3v3h-3z" />
        <path fill="#879a9d" stroke="#20343a" d="M16 23h14v9H16zM13 32h17v2H13z" />
      </g>}
      {employeeId === 'person-tyr' && <g>
        <path fill="#a7b4ba" stroke="#33434a" d="M9 9V6h3V4h10v2h3v10h-4V9h-3v12h-3V9h-3v10H9z" />
        <path fill="#d1dce1" d="M14 5h3v5h-3z" />
        <path fill="#f0efe0" stroke="#33434a" d="M18 22h12v12H18z" />
        <path fill="none" stroke="#2a8f71" d="m20 25 1 1 2-3m-3 7 1 1 2-3m2-3h3m-3 5h3" />
      </g>}
      {employeeId === 'person-plutus' && <g>
        <path fill="#192723" stroke="#d0ac38" d="M8 5h17v14H8z" />
        <path fill="#e2b63f" d="M13 12h2v3h-2zm8 0h2v3h-2zm-6 10h6v5h-6z" />
        <path fill="#d8ad36" stroke="#292e22" d="m23 23 7 2-3 11-7-2z" />
        <path fill="#3b6251" d="m24 25 4 1-1 3-4-1z" />
        <path fill="#263a31" d="M23 30h2v2h-2zm3 1h2v2h-2z" />
      </g>}
      {employeeId === 'person-hermes' && <g>
        <path fill="#c28e32" stroke="#5a4325" d="M9 9h17v3H9zm3-5h10l3 5H9z" />
        <path fill="#e4e4d4" stroke="#596969" d="M10 7H7V4H4V2h5v3h3z" />
        <path fill={p.trim} d="m11 21 3-2 10 11-3 2zM6 31h2v6H6z" />
      </g>}
      {employeeId === 'person-mimir' && <g>
        <path fill="#1a4437" stroke="#122a29" d="M8 17V7h3V4h11v3h3v14h-3V10H12v10z" />
        <path fill={p.hair} d="M11 16h3v2h8v-2h2v7h-3v4h-5v-3h-3v-3h-2z" />
        <path fill="#dfd4ac" stroke="#756d4b" d="M19 23h12v10H19z" />
        <path fill="#8a846a" d="M21 25h7v1h-7zm0 3h5v1h-5z" />
      </g>}
      {employeeId === 'person-daedalus' && <g>
        <path fill={p.hair} d="M8 8V5h4V3h9v2h4v6H8z" />
        <path fill="#d7b16b" stroke="#392e24" d="M10 12h7v6h-7zm9 0h7v6h-7z" />
        <path fill="#8ab7b7" d="M12 14h3v2h-3zm9 0h3v2h-3z" />
        <path fill="#555e63" stroke="#172b30" d="M15 24h16v10H15zM12 34h19v2H12z" />
        <path fill="#d5d0b5" d="M22 28h2v2h-2z" />
      </g>}
      {employeeId === 'person-harald' && <g>
        <path fill={p.trim} stroke="#735722" d="M9 3h3v4h4V2h3v5h4V3h3v8H9z" />
        <path fill={p.hair} d="M10 17h4v2h6v-2h4v5h-3v3h-7v-3h-4z" />
        <path fill="#d9c48d" stroke="#745d36" d="M18 25h12v7H18z" />
        <path fill="#6c6346" d="M20 27h7v1h-7zm0 2h5v1h-5z" />
      </g>}
      {employeeId === 'person-njord' && <g>
        <path fill={p.hair} d="M7 16V8h3V5h13v3h3v15h-4V11h-7v5h-3v7H7z" />
        <path fill="none" stroke={p.trim} strokeWidth="2" d="M22 22v11m-4-7h8m-9 3 2 4h6l3-4" />
        <path fill={p.trim} d="M21 19h3v3h-3z" />
      </g>}
    </svg>
  );
}
