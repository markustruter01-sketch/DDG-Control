import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

const defaultBackground = `${import.meta.env.BASE_URL}backgrounds/emma-francis.webp`;
document.documentElement.style.setProperty(
  '--home-background',
  `url("${defaultBackground}")`,
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
