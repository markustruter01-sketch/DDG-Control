import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

// The home page's landscape photo (Night Glass: photo on home only).
document.documentElement.style.setProperty(
  '--ng-photo',
  `url("${import.meta.env.BASE_URL}backgrounds/david-becker.webp")`,
);

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
