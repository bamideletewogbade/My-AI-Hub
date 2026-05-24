import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Fade out the static splash screen once React is ready to render
const splash = document.getElementById('splash-screen');
if (splash) {
  // Wait for first paint, then fade out
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      splash.classList.add('fade-out');
      // Remove from DOM after transition completes
      setTimeout(() => {
        splash.remove();
      }, 700);
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
