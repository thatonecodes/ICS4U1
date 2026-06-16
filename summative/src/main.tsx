import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import { AuthProvider, UserProvider } from '@/context';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>
);
