import { createRoot } from 'react-dom/client';
import { Site } from './Site';
import './site.css';

import { revealPage } from './intro';

createRoot(document.getElementById('root')!).render(<Site />);

// Pages without the 3D scene fade in as soon as their fonts are in (the home page's scene does it itself).
if (location.pathname.replace(/\/+$/, '') !== '') {
  Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 800))]).then(() => revealPage(600));
}
