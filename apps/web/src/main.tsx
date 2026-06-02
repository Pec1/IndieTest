import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initThemeFromStorage } from './contexts/ThemeContext';
import { App } from './App';

initThemeFromStorage();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
