import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

const backgroundImages = [
  `${import.meta.env.BASE_URL}backgrounds/david-becker.webp`,
  `${import.meta.env.BASE_URL}backgrounds/emma-francis.webp`,
  `${import.meta.env.BASE_URL}backgrounds/martin-balle.webp`,
];

let activeBackgroundIndex = Math.floor(Math.random() * backgroundImages.length);
const applyBackground = () => {
  document.documentElement.style.setProperty(
    '--home-background',
    `url("${backgroundImages[activeBackgroundIndex]}")`,
  );
};

applyBackground();
window.setInterval(() => {
  const nextOffset = 1 + Math.floor(Math.random() * (backgroundImages.length - 1));
  activeBackgroundIndex = (activeBackgroundIndex + nextOffset) % backgroundImages.length;
  applyBackground();
}, 60_000);

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
