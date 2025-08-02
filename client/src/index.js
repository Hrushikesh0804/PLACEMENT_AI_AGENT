import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // A file for global styles like fonts or body resets
import App from './App';

// Find the 'root' div from the public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the main App component into that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
