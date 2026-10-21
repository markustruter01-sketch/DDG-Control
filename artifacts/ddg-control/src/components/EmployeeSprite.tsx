import type { DdgEmployeeRoleId } from '@workspace/project-constants';
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

/** Owner-approved22October shaded pixel heroes. Presentation, never worker status.
 * Delivery assets preserve aspect and alpha; full-resolution masters are archived.
 * The enclosing button supplies the accessible name for decorative instances.
 */
export function EmployeeSprite({ employeeId, title }: { employeeId: DdgEmployeeRoleId; title?: string }) {
  return <img className="employee-sprite" src={portraits[employeeId]}
    width="256" height="256" alt={title ?? ''} aria-hidden={title ? undefined : true}
    decoding="async" draggable={false} />;
}
