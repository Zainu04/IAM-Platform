import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AccessRequestsProvider } from './context/AccessRequestsContext.jsx';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AccessRequestsProvider>
        <App />
      </AccessRequestsProvider>
    </BrowserRouter>
  </React.StrictMode>
);