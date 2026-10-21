import type { DdgEmployeeRoleId } from '@workspace/project-constants';

/** Authored flavour text only. Never company records, messages or provider output. */
export const EMPLOYEE_BANTER: Record<DdgEmployeeRoleId, readonly [string, string, string]> = {
  'person-heimdall-gm': [
    'Nine realms. One sensible checklist.',
    'The horn is for emergencies. A missing comma can wait.',
    'A clear plan beats a heroic guess.',
  ],
  'person-freya': [
    'Good armour. Better positioning.',
    'Even a legendary entrance needs a clear message.',
    'A little flair. A lot of purpose.',
  ],
  'person-tyr': [
    'A quest without a finish line is just wandering.',
    'One shield. One next step.',
    'Bravery is useful. Clear requirements help too.',
  ],
  'person-plutus': [
    'A shiny coin is not a business case.',
    'The abacus has no interest in wishful thinking.',
    'Even treasure needs a ledger.',
  ],
  'person-hermes': [
    'Fast feet. Clear directions.',
    'A good handover should fit through a doorway.',
    'Winged boots are no excuse for skipping the map.',
  ],
  'person-mimir': [
    'A confident claim is still a claim. Bring evidence.',
    'The oldest trick in the book is forgetting to read it.',
    'A useful question can be sharper than a sword.',
  ],
  'person-daedalus': [
    'Measure twice. Enchant once.',
    'A spare bolt is either wisdom or a mystery.',
    'An invention should solve more problems than it creates.',
  ],
  'person-harald': [
    'A crown does not organise a calendar.',
    'Even the long table needs an agenda.',
    'Keep the council short and the purpose clear.',
  ],
  'person-njord': [
    'A promising horizon still needs a seaworthy boat.',
    'Read the tide before raising the sail.',
    'A new voyage starts with knowing the harbour.',
  ],
};
