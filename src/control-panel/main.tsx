// @@filename: src/control-panel/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ControlPanel from './ControlPanel';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ControlPanel />
  </React.StrictMode>
);
